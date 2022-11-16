package database

import (
	"fmt"

	"50Cent/backend/config"
	"50Cent/backend/internal/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func NewPostgresDB(cfg *config.Config) (*gorm.DB, error) {
	dsn := fmt.Sprintf(
		"host=localhost port=5432 user=postgres dbname=postgres password=qwerty sslmode=disable",
	)

	db, err := gorm.Open(
		postgres.Open(dsn),
		&gorm.Config{},
	)
	if err != nil {
		return nil, err
	}

	if err := db.AutoMigrate(
		&models.User{},
		&models.Admin{},
		&models.Consumer{},
		&models.Investor{},
		&models.UserFile{},
		&models.Loan{},
		&models.ConfirmationCode{},
		&models.CheckoutSession{},
		&models.Transaction{},
		&models.LoanCounteroffer{},
		&models.Balance{},
		&models.Payout{},
	); err != nil {
		return nil, err
	}

	return db, nil
}
