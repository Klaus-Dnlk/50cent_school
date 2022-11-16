package models

import "gorm.io/gorm"

type LoanCounteroffer struct {
	gorm.Model
	CreditTerm uint    `gorm:"type:uint; not null"`
	CreditRate float64 `gorm:"type:float; not null"`
	LoanID     uint
	Loan       Loan
}
