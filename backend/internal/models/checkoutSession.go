package models

import "gorm.io/gorm"

type CheckoutSession struct {
	gorm.Model
	SessionID    string
	LoanID       uint
	IsAcceptance bool
	UserID       uint
	Amount       float64
	Loan         Loan
}
