package repositories

import (
	"context"

	"50Cent/backend/internal/models"

	"gorm.io/gorm"
)

type ConsumerRepository struct {
	db *gorm.DB
}

func NewConsumerRepository(db *gorm.DB) *ConsumerRepository {
	return &ConsumerRepository{db: db}
}

func (r *ConsumerRepository) CreateConsumer(ctx context.Context, consumer *models.Consumer) error {
	return r.db.WithContext(ctx).Create(&consumer).Error
}

func (r *ConsumerRepository) GetConsumerByUserID(ctx context.Context, userID uint64) (*models.Consumer, error) {
	var consumer models.Consumer

	err := r.db.WithContext(ctx).Where("user_ID = ?", userID).First(&consumer).Error

	if err != nil {
		return nil, err
	}

	return &consumer, nil
}

func (r *ConsumerRepository) GetConsumerByStripeID(ctx context.Context, stripeID string) (*models.Consumer, error) {
	var consumer models.Consumer

	err := r.db.WithContext(ctx).Where("stripe_id = ?", stripeID).First(&consumer).Error

	if err != nil {
		return nil, err
	}

	return &consumer, nil
}

func (r *ConsumerRepository) GetConsumerByID(ctx context.Context, id uint64) (*models.Consumer, error) {
	var consumer models.Consumer

	err := r.db.WithContext(ctx).First(&consumer, id).Error
	if err != nil {
		return nil, err
	}

	return &consumer, err
}

func (r *ConsumerRepository) CheckIfExists(ctx context.Context, accountID string) (bool, error) {
	var exists bool

	err := r.db.WithContext(ctx).Model(&models.Consumer{}).Select("count(*) > 0").Where("stripe_id = ?", accountID).Find(&exists).Error
	if err != nil {
		return false, err
	}

	return exists, nil
}

func (r *ConsumerRepository) Save(ctx context.Context, consumer *models.Consumer) error {
	return r.db.WithContext(ctx).Save(consumer).Error
}

func (r *ConsumerRepository) UpdateConsumer(ctx context.Context, con *models.Consumer) error {
	return r.db.WithContext(ctx).Save(&con).Error
}

func (r *ConsumerRepository) GetAllUnverifiedConsumers(ctx context.Context) ([]models.Consumer, error) {
	var consumers []models.Consumer

	err := r.db.WithContext(ctx).Where("is_verified = ?", false).Find(&consumers).Error

	if err != nil {
		return nil, err
	}

	return consumers, nil
}
