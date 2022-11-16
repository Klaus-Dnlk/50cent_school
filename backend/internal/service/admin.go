package service

import (
	"context"

	"50Cent/backend/config"
	"50Cent/backend/internal/constants"
	"50Cent/backend/internal/models"
	"50Cent/backend/internal/repositories"
)

type AdminService struct {
	investorRepo repositories.Investor
	consumerRepo repositories.Consumer
	authRepo     repositories.Auth
	uploadRepo   repositories.Upload
	cfg          *config.Config
}

func NewAdminService(investorRepo repositories.Investor, consumerRepo repositories.Consumer, uploadRepo repositories.Upload, authRepo repositories.Auth, cfg *config.Config) *AdminService {
	return &AdminService{
		investorRepo: investorRepo,
		consumerRepo: consumerRepo,
		authRepo:     authRepo,
		uploadRepo:   uploadRepo,
		cfg:          cfg,
	}
}

func (s *AdminService) GetALlUnverifiedUsers(ctx context.Context) ([]models.UserToVerifyOnAdminPage, error) {
	// unite investors and consumers into an array of UserToVerifyOnAdminPage
	var users []models.UserToVerifyOnAdminPage //nolint:prealloc // preallocating users will lead to server error where it outputs users with nil values

	investors, err := s.investorRepo.GetAllUnverifiedInvestors(ctx)
	if err != nil {
		return nil, err
	}

	for _, investor := range investors {
		// get user files:
		var userFiles map[models.FileType]string

		userFiles, err = s.uploadRepo.GetUserFilesLinks(ctx, investor.UserID)

		if err != nil {
			return nil, err
		}

		users = append(users, models.UserToVerifyOnAdminPage{
			ID:        investor.UserID,
			Role:      constants.InvestorRole,
			Name:      investor.Name + " " + investor.MiddleName + " " + investor.Surname,
			Photo:     userFiles[models.Photo],
			Passport:  userFiles[models.IDFile],
			WorkPlace: userFiles[models.WorkFIle],
			Property:  userFiles[models.PropertyFile],
		})
	}

	consumers, err := s.consumerRepo.GetAllUnverifiedConsumers(ctx)
	if err != nil {
		return nil, err
	}

	for _, consumer := range consumers {
		// get user files:
		userFiles, err := s.uploadRepo.GetUserFilesLinks(ctx, consumer.UserID)

		if err != nil {
			return nil, err
		}

		users = append(users, models.UserToVerifyOnAdminPage{
			ID:        consumer.UserID,
			Role:      constants.ConsumerRole,
			Name:      consumer.Name + " " + consumer.MiddleName + " " + consumer.Surname,
			Photo:     userFiles[models.Photo],
			Passport:  userFiles[models.IDFile],
			WorkPlace: userFiles[models.WorkFIle],
			Property:  userFiles[models.PropertyFile],
		})
	}

	return users, nil
}
