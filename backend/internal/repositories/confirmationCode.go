package repositories

import (
	"context"

	"50Cent/backend/internal/models"

	"gorm.io/gorm"
)

type ConfirmationCodeRepository struct {
	db *gorm.DB
}

func NewConfirmationCodeRepository(db *gorm.DB) *ConfirmationCodeRepository {
	return &ConfirmationCodeRepository{db: db}
}

func (r *ConfirmationCodeRepository) Create(ctx context.Context, code *models.ConfirmationCode) error {
	return r.db.WithContext(ctx).Create(&code).Error
}

func (r *ConfirmationCodeRepository) GetConfirmationCode(ctx context.Context, user *models.User) (*models.ConfirmationCode, error) {
	var code models.ConfirmationCode

	err := r.db.WithContext(ctx).Where("user_ID = ?", user.ID).First(&code).Error

	if err != nil {
		return nil, err
	}

	return &code, nil
}

func (r *ConfirmationCodeRepository) DeleteConfirmationCode(ctx context.Context, user *models.User) error {
	code, err := r.GetConfirmationCode(ctx, user)
	if err != nil {
		return err
	}

	err = r.db.WithContext(ctx).Delete(code).Error
	if err != nil {
		return err
	}

	return err
}
