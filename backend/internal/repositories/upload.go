package repositories

import (
	"context"
	"mime/multipart"

	"50Cent/backend/config"
	"50Cent/backend/internal/command"
	"50Cent/backend/internal/models"

	"gorm.io/gorm"
)

type UploadRepository struct {
	db *gorm.DB
	AwsS3
}

func NewUploadRepository(db *gorm.DB, cfg *config.Config) *UploadRepository {
	return &UploadRepository{db: db, AwsS3: NewAwsS3Repo(cfg)}
}

func (r *UploadRepository) Create(ctx context.Context, files command.MultipartFiles, fileType models.FileType) error {
	if err := r.AwsS3.ValidateUploadFiles(files); err != nil {
		return err
	}

	if err := r.AwsS3.GetAwsS3ClientInstance(); err != nil {
		return err
	}

	paths, err := r.AwsS3.UploadFiles(files, string(fileType))
	if err != nil {
		return err
	}

	uploadedFiles := make([]models.UserFile, 0, len(*paths))

	for _, path := range *paths {
		uploadedFiles = append(uploadedFiles, models.UserFile{ContentPath: path, FileType: fileType})
	}

	return r.db.WithContext(ctx).Create(uploadedFiles).Error
}

func (r *UploadRepository) CreateOne(ctx context.Context, file *multipart.FileHeader, fileType models.FileType, userID uint) (*models.UserFile, error) {
	var files command.MultipartFiles

	files = append(files, file)

	if err := r.AwsS3.ValidateUploadFiles(files); err != nil {
		return nil, err
	}

	if err := r.AwsS3.GetAwsS3ClientInstance(); err != nil {
		return nil, err
	}

	paths, err := r.AwsS3.UploadFiles(files, string(fileType))
	if err != nil {
		return nil, err
	}

	uploadedFiles := make([]models.UserFile, 0, len(*paths))

	for _, path := range *paths {
		uploadedFiles = append(uploadedFiles, models.UserFile{ContentPath: path, FileType: fileType, UserID: userID})
	}

	return &uploadedFiles[0], nil
}

func (r *UploadRepository) AddFileToConsumer(ctx context.Context, file *models.UserFile) error {
	return r.db.WithContext(ctx).Create(&file).Error
}

func (r *UploadRepository) AddFileToInvestor(ctx context.Context, file *models.UserFile) error {
	return r.db.WithContext(ctx).Create(&file).Error
}

func (r *UploadRepository) GetUserFilesLinks(ctx context.Context, userID uint) (map[models.FileType]string, error) {
	// make hash map with key as file type and value link
	fileTypeToLink := make(map[models.FileType]string)

	var files []models.UserFile

	if err := r.db.WithContext(ctx).Where("user_id = ?", userID).Find(&files).Error; err != nil {
		return nil, err
	}

	for _, file := range files {
		fileTypeToLink[file.FileType] = file.ContentPath
	}

	return fileTypeToLink, nil
}
