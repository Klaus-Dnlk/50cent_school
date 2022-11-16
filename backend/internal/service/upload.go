package service

import (
	"context"

	"50Cent/backend/internal/command"
	"50Cent/backend/internal/models"
	"50Cent/backend/internal/repositories"
)

type UploadService struct {
	UploadRepo repositories.Upload
}

func NewUploadService(repository repositories.Upload) *UploadService {
	return &UploadService{UploadRepo: repository}
}

func (s *UploadService) Create(ctx context.Context, files command.MultipartFiles, fileType models.FileType) error {
	return s.UploadRepo.Create(ctx, files, fileType)
}

func (s *UploadService) GetUserFilesLinks(ctx context.Context, userID uint) (map[models.FileType]string, error) {
	return s.UploadRepo.GetUserFilesLinks(ctx, userID)
}
