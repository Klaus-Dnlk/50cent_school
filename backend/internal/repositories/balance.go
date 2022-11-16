package repositories

import (
	"50Cent/backend/internal/models"
	"context"

	"gorm.io/gorm"
)

type BalanceRepository struct {
	DB *gorm.DB
}

func NewBalanceRepository(db *gorm.DB) *BalanceRepository {
	return &BalanceRepository{DB: db}
}

func (r *BalanceRepository) Create(ctx context.Context, balance *models.Balance) error {
	return r.DB.WithContext(ctx).Create(balance).Error
}

func (r *BalanceRepository) GetAllByInvestorID(ctx context.Context, id uint) ([]models.Balance, error) {
	var bal []models.Balance
	if err := r.DB.WithContext(ctx).Where("user_type = ?", 2).Where("user_id = ?", id).Order("time asc").Find(&bal).Error; err != nil {
		return nil, err
	}

	return bal, nil
}

func (r *BalanceRepository) GetAllByConsumerID(ctx context.Context, id uint) ([]models.Balance, error) {
	var bal []models.Balance
	if err := r.DB.WithContext(ctx).Where("user_type = ?", 1).Where("user_id = ?", id).Order("time asc").Find(&bal).Error; err != nil {
		return nil, err
	}

	return bal, nil
}
