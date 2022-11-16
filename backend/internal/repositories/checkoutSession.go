package repositories

import (
	"50Cent/backend/internal/models"
	"context"

	"gorm.io/gorm"
)

type CheckoutSessionRepository struct {
	db *gorm.DB
}

func NewCheckoutSessionRepository(db *gorm.DB) *CheckoutSessionRepository {
	return &CheckoutSessionRepository{db: db}
}

func (r *CheckoutSessionRepository) Create(ctx context.Context, checkoutSession *models.CheckoutSession) error {
	return r.db.WithContext(ctx).Create(checkoutSession).Error
}

func (r *CheckoutSessionRepository) GetBySessionID(ctx context.Context, sessionID string) (*models.CheckoutSession, error) {
	var session models.CheckoutSession

	if err := r.db.WithContext(ctx).Where("session_id = ?", sessionID).First(&session).Error; err != nil {
		return nil, err
	}

	return &session, nil
}

func (r *CheckoutSessionRepository) GetByLoanID(ctx context.Context, loanID uint) (*models.CheckoutSession, error) {
	var session models.CheckoutSession

	if err := r.db.WithContext(ctx).Where("loan_id = ?", loanID).First(&session).Error; err != nil {
		return nil, err
	}

	return &session, nil
}

func (r *CheckoutSessionRepository) CountByLoanID(ctx context.Context, loanID, userID uint) (bool, error) {
	var count int64

	if err := r.db.WithContext(ctx).Model(&models.CheckoutSession{}).Where("loan_id = ?", loanID).Where("user_id <> ?", userID).Count(&count).Error; err != nil {
		return false, err
	}

	return count > 0, nil
}

func (r *CheckoutSessionRepository) DeleteByLoanID(ctx context.Context, loanID uint) error {
	return r.db.WithContext(ctx).Where("loan_id = ?", loanID).Delete(&models.CheckoutSession{}).Error
}
