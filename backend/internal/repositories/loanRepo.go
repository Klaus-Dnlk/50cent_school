package repositories

import (
	"context"
	"math"

	"50Cent/backend/internal/helper"
	"50Cent/backend/internal/models"

	"gorm.io/gorm"
)

type LoanRepository struct {
	db *gorm.DB
}

func NewLoanRepository(db *gorm.DB) *LoanRepository {
	return &LoanRepository{db: db}
}

func (r *LoanRepository) Create(ctx context.Context, loan *models.Loan) error {
	return r.db.WithContext(ctx).Create(loan).Error
}

func (r *LoanRepository) Delete(ctx context.Context, id uint64) error {
	return r.db.WithContext(ctx).Delete(&models.Loan{}, id).Error
}

func (r *LoanRepository) GetAll(ctx context.Context, page, pageSize int) (*[]models.Loan, float64, error) {
	var loans []models.Loan

	var totalRows int64

	var totalPages float64

	r.db.Model(loans).Where("is_accepted= ?", false).Count(&totalRows)

	if err := r.db.WithContext(ctx).Scopes(helper.Paginate(page, pageSize)).Where("is_accepted= ?", false).Find(&loans).Error; err != nil {
		return nil, 0, err
	}

	totalPages = math.Ceil(float64(totalRows) / float64(pageSize))

	return &loans, totalPages, nil
}

func (r *LoanRepository) GetByID(ctx context.Context, id uint64) (*models.Loan, error) {
	var loan models.Loan

	err := r.db.WithContext(ctx).First(&loan, id).Error
	if err != nil {
		return nil, err
	}

	return &loan, err
}

func (r *LoanRepository) GetAllByInvestorID(ctx context.Context, id uint) ([]models.Loan, error) {
	var loans []models.Loan
	if err := r.db.WithContext(ctx).Where("investor_id = ?", id).Where("is_accepted = ?", true).Where("is_returned = ?", false).Find(&loans).Error; err != nil {
		return nil, err
	}

	return loans, nil
}

func (r *LoanRepository) GetAllByConsumerID(ctx context.Context, id uint) ([]models.Loan, error) {
	var loans []models.Loan
	if err := r.db.WithContext(ctx).Where("consumer_id = ?", id).Where("is_accepted = ?", true).Where("is_returned = ?", false).Find(&loans).Error; err != nil {
		return nil, err
	}

	return loans, nil
}

func (r *LoanRepository) Update(ctx context.Context, loan *models.Loan) error {
	return r.db.WithContext(ctx).Save(loan).Error
}
