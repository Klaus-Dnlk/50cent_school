package repositories

import (
	"context"

	"50Cent/backend/internal/models"

	"gorm.io/gorm"
)

type AuthRepository struct {
	db *gorm.DB
}

func NewAuthRepository(db *gorm.DB) *AuthRepository {
	return &AuthRepository{db: db}
}

func (r *AuthRepository) Create(ctx context.Context, user *models.User) (uint, error) {
	err := r.db.WithContext(ctx).Create(&user).Error
	return user.ID, err
}

func (r *AuthRepository) GetUserByID(ctx context.Context, userID uint) (*models.User, error) {
	var user models.User

	err := r.db.WithContext(ctx).Where("id = ?", userID).First(&user).Error
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *AuthRepository) GetUserByEmail(ctx context.Context, email string) (*models.User, error) {
	var user models.User

	err := r.db.WithContext(ctx).Where("email = ?", email).First(&user).Error
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *AuthRepository) Update(ctx context.Context, user *models.User) error {
	return r.db.WithContext(ctx).Save(&user).Error
}

// admin functionality
func (r *AuthRepository) CreateAdmin(ctx context.Context, admin *models.Admin) error {
	return r.db.WithContext(ctx).Create(admin).Error
}

func (r *AuthRepository) GetAdminByID(ctx context.Context, userID uint) (*models.Admin, error) {
	// 1. Find userId with email
	// 2. Check is that UserID is in Admin table
	user, err := r.GetUserByID(ctx, userID)
	if err != nil {
		return nil, err
	}

	var admin models.Admin
	err = r.db.WithContext(ctx).First(&admin, "user_id = ?", user.ID).Error

	if err != nil {
		return nil, err
	}

	return &admin, nil
}
