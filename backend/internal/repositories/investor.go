package repositories

import (
	"context"

	"50Cent/backend/internal/models"

	"gorm.io/gorm"
)

type InvestorRepository struct {
	db *gorm.DB
}

func NewInvestorRepository(db *gorm.DB) *InvestorRepository {
	return &InvestorRepository{db: db}
}

func (r *InvestorRepository) CreateInvestor(ctx context.Context, investor *models.Investor) error {
	return r.db.WithContext(ctx).Create(&investor).Error
}

func (r *InvestorRepository) GetAllUnverifiedInvestors(ctx context.Context) ([]models.Investor, error) {
	var investors []models.Investor

	err := r.db.WithContext(ctx).Where("is_verified = ?", false).Find(&investors).Error

	if err != nil {
		return nil, err
	}

	return investors, nil
}

func (r *InvestorRepository) GetInvestorByUserID(ctx context.Context, userID uint64) (*models.Investor, error) {
	var investor models.Investor

	err := r.db.WithContext(ctx).Where("user_ID = ?", userID).First(&investor).Error

	if err != nil {
		return nil, err
	}

	return &investor, nil
}

func (r *InvestorRepository) GetInvestorByStripeID(ctx context.Context, accountID string) (*models.Investor, error) {
	var investor models.Investor

	err := r.db.WithContext(ctx).Where("stripe_id = ?", accountID).First(&investor).Error

	if err != nil {
		return nil, err
	}

	return &investor, nil
}

func (r *InvestorRepository) GetInvestorByID(ctx context.Context, id uint64) (*models.Investor, error) {
	var investor models.Investor

	err := r.db.WithContext(ctx).First(&investor, id).Error
	if err != nil {
		return nil, err
	}

	return &investor, err
}

func (r *InvestorRepository) CheckIfExists(ctx context.Context, accountID string) (bool, error) {
	var exists bool

	err := r.db.WithContext(ctx).Model(&models.Investor{}).Select("count(*) > 0").Where("stripe_id = ?", accountID).Find(&exists).Error
	if err != nil {
		return false, err
	}

	return exists, nil
}

func (r *InvestorRepository) Save(ctx context.Context, investor *models.Investor) error {
	return r.db.WithContext(ctx).Save(investor).Error
}

func (r *InvestorRepository) UpdateInvestor(ctx context.Context, investor *models.Investor) error {
	return r.db.WithContext(ctx).Save(&investor).Error
}
