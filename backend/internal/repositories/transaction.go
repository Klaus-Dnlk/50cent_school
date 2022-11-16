package repositories

import (
	"50Cent/backend/internal/models"
	"context"

	"gorm.io/gorm"
)

type TransactionRepository struct {
	DB *gorm.DB
}

func NewTransactionRepository(db *gorm.DB) *TransactionRepository {
	return &TransactionRepository{DB: db}
}

func (r *TransactionRepository) Create(ctx context.Context, transaction *models.Transaction) error {
	return r.DB.WithContext(ctx).Create(transaction).Error
}

func (r *TransactionRepository) GetByLoanID(ctx context.Context, id uint) ([]models.Transaction, error) {
	var transactions []models.Transaction
	if err := r.DB.WithContext(ctx).Where("loan_id = ?", id).Order("time desc").Find(&transactions).Error; err != nil {
		return nil, err
	}

	return transactions, nil
}
