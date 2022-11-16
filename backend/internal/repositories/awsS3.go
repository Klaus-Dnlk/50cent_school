package repositories

import (
	"50Cent/backend/config"
	"50Cent/backend/internal/command"
	"bytes"
	"errors"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/awserr"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

type AwsS3 interface {
	GetAwsS3ClientInstance() error
	ValidateUploadFiles(files command.MultipartFiles) error
	UploadFiles(files command.MultipartFiles, fileType string) (*[]string, error)
}

type AwsS3Repo struct {
	bucketName  string
	config      *aws.Config
	client      *s3.S3
	maxPartSize int64
	maxRetries  int
}

func NewAwsS3Repo(cfg *config.Config) *AwsS3Repo {
	creds := credentials.NewStaticCredentials(cfg.AWS.AccessKeyID, cfg.AWS.SecretAccessKey, "")
	_, err := creds.Get()

	if err != nil {
		panic(err)
	}

	activeConfig := aws.NewConfig().WithRegion(cfg.AWS.Region).WithCredentials(creds)

	kilobyte := 1024
	maxPartSize := int64(5 * kilobyte * kilobyte)
	maxRetries := 3

	return &AwsS3Repo{bucketName: cfg.AWS.BucketName, config: activeConfig, client: nil, maxPartSize: maxPartSize, maxRetries: maxRetries}
}

func (s *AwsS3Repo) GetAwsS3ClientInstance() error {
	newSession, err := session.NewSession(s.config)

	if err != nil {
		return err
	}

	s.client = s3.New(newSession, s.config)

	return nil
}

func (s *AwsS3Repo) ValidateUploadFiles(files command.MultipartFiles) error {
	for _, formFile := range files {
		size := formFile.Size
		contentType := formFile.Header.Get("Content-Type")

		if size > s.maxPartSize {
			return errors.New("file too large")
		}

		if contentType != "image/jpeg" && contentType != "image/png" {
			return errors.New("filetype is not supported")
		}
	}

	return nil
}

func (s *AwsS3Repo) UploadFiles(files command.MultipartFiles, fileType string) (*[]string, error) {
	now := time.Now()
	nowRFC3339 := now.Format(time.RFC3339)

	paths := make([]string, len(files))
	pathNumber := 0

	for _, formFile := range files {
		binaryFile, err := readFile(formFile)

		if err != nil {
			return nil, err
		}

		path := fmt.Sprintf("/%s/", fileType) + nowRFC3339 + "-" + formFile.Filename
		fileType := http.DetectContentType(binaryFile)

		input := &s3.CreateMultipartUploadInput{
			Bucket:      aws.String(s.bucketName),
			Key:         aws.String(path),
			ContentType: aws.String(fileType),
		}

		res, err := s.client.CreateMultipartUpload(input)
		if err != nil {
			return nil, err
		}

		var curr, partLength int64

		var remaining = formFile.Size

		var completedParts []*s3.CompletedPart

		partNumber := 1

		for curr = 0; remaining != 0; curr += partLength {
			if remaining < s.maxPartSize {
				partLength = remaining
			} else {
				partLength = s.maxPartSize
			}

			completedPart, errUpload := uploadPart(s.maxRetries, s.client, res, binaryFile[curr:curr+partLength], partNumber)
			if errUpload != nil {
				errAbort := abortMultipartUpload(s.client, res)
				if errAbort != nil {
					return nil, errAbort
				}
			}

			remaining -= partLength
			partNumber++

			completedParts = append(completedParts, completedPart)
		}

		completeResponse, err := completeMultipartUpload(s.client, res, completedParts)
		if err != nil {
			return nil, err
		}

		paths[pathNumber] = *completeResponse.Location
		pathNumber++
	}

	return &paths, nil
}

func readFile(file *multipart.FileHeader) ([]byte, error) {
	openedFile, _ := file.Open()

	binaryFile, err := io.ReadAll(openedFile)
	if err != nil {
		return nil, err
	}

	defer func(openedFile multipart.File) {
		err := openedFile.Close()
		if err != nil {
			return
		}
	}(openedFile)

	return binaryFile, nil
}

func completeMultipartUpload(svc *s3.S3, resp *s3.CreateMultipartUploadOutput, completedParts []*s3.CompletedPart) (*s3.CompleteMultipartUploadOutput, error) {
	completeInput := &s3.CompleteMultipartUploadInput{
		Bucket:   resp.Bucket,
		Key:      resp.Key,
		UploadId: resp.UploadId,
		MultipartUpload: &s3.CompletedMultipartUpload{
			Parts: completedParts,
		},
	}

	return svc.CompleteMultipartUpload(completeInput)
}

func uploadPart(maxRetries int, svc *s3.S3, resp *s3.CreateMultipartUploadOutput, fileBytes []byte, partNumber int) (*s3.CompletedPart, error) {
	tryNum := 1
	partInput := &s3.UploadPartInput{
		Body:          bytes.NewReader(fileBytes),
		Bucket:        resp.Bucket,
		Key:           resp.Key,
		PartNumber:    aws.Int64(int64(partNumber)),
		UploadId:      resp.UploadId,
		ContentLength: aws.Int64(int64(len(fileBytes))),
	}

	for tryNum <= maxRetries {
		uploadResult, err := svc.UploadPart(partInput)
		if err != nil {
			if tryNum == maxRetries {
				if aerr, ok := err.(awserr.Error); ok {
					return nil, aerr
				}

				return nil, err
			}
			tryNum++
		} else {
			return &s3.CompletedPart{
				ETag:       uploadResult.ETag,
				PartNumber: aws.Int64(int64(partNumber)),
			}, nil
		}
	}

	return nil, nil
}

func abortMultipartUpload(svc *s3.S3, resp *s3.CreateMultipartUploadOutput) error {
	abortInput := &s3.AbortMultipartUploadInput{
		Bucket:   resp.Bucket,
		Key:      resp.Key,
		UploadId: resp.UploadId,
	}
	_, err := svc.AbortMultipartUpload(abortInput)

	return err
}
