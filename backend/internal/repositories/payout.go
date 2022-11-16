package repositories

import (
	"50Cent/backend/internal/models"
	"context"

	"gorm.io/gorm"
)

type PayoutRepository struct {
	DB *gorm.DB
}

func NewPayoutRepository(db *gorm.DB) *PayoutRepository {
	return &PayoutRepository{DB: db}
}

func (r *PayoutRepository) Create(ctx context.Context, payout *models.Payout) error {
	return r.DB.WithContext(ctx).Create(payout).Error
}

func (r *PayoutRepository) GetByInvestorID(ctx context.Context, id uint) ([]models.Payout, error) {
	var payouts []models.Payout
	if err := r.DB.WithContext(ctx).Where("user_id = ?", id).Where("is_consumer = ?", false).Find(&payouts).Error; err != nil {
		return nil, err
	}

	return payouts, nil
}

func (r *PayoutRepository) GetByConsumerID(ctx context.Context, id uint) ([]models.Payout, error) {
	var payouts []models.Payout
	if err := r.DB.WithContext(ctx).Where("user_id = ?", id).Where("is_consumer = ?", true).Find(&payouts).Error; err != nil {
		return nil, err
	}

	return payouts, nil
}

func (r *PayoutRepository) GetLastByInvestorID(ctx context.Context, id uint) (*models.Payout, error) {
	var payout models.Payout
	if err := r.DB.WithContext(ctx).Where("user_id = ?", id).Where("is_consumer = ?", false).Last(&payout).Error; err != nil {
		return nil, err
	}

	return &payout, nil
}

func (r *PayoutRepository) GetLastByConsumerID(ctx context.Context, id uint) (*models.Payout, error) {
	var payout models.Payout
	if err := r.DB.WithContext(ctx).Where("user_id = ?", id).Where("is_consumer = ?", true).Last(&payout).Error; err != nil {
		return nil, err
	}

	return &payout, nil
}
