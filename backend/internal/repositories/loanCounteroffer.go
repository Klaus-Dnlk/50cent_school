package repositories

import (
	"50Cent/backend/internal/models"
	"context"

	"gorm.io/gorm"
)

type LoanCounterofferRepository struct {
	DB *gorm.DB
}

func NewLoanCounterofferRepository(db *gorm.DB) *LoanCounterofferRepository {
	return &LoanCounterofferRepository{DB: db}
}

func (r *LoanCounterofferRepository) Create(ctx context.Context, counteroffer *models.LoanCounteroffer) error {
	return r.DB.WithContext(ctx).Create(counteroffer).Error
}

func (r *LoanCounterofferRepository) GetByID(ctx context.Context, id uint) (*models.LoanCounteroffer, error) {
	var offer models.LoanCounteroffer
	if err := r.DB.WithContext(ctx).Where("id = ?", id).First(&offer).Error; err != nil {
		return nil, err
	}

	return &offer, nil
}

func (r *LoanCounterofferRepository) GetAllByLoanID(ctx context.Context, id uint) ([]models.LoanCounteroffer, error) {
	var offers []models.LoanCounteroffer
	if err := r.DB.WithContext(ctx).Where("loan_id = ?", id).Order("time desc").Find(&offers).Error; err != nil {
		return nil, err
	}

	return offers, nil
}

func (r *LoanCounterofferRepository) DeleteByID(ctx context.Context, id uint) error {
	return r.DB.WithContext(ctx).Where("id = ?", id).Delete(&models.LoanCounteroffer{}).Error
}

func (r *LoanCounterofferRepository) DeleteByLoanID(ctx context.Context, id uint) error {
	return r.DB.WithContext(ctx).Where("loan_id = ?", id).Delete(&models.LoanCounteroffer{}).Error
}
