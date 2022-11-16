package models

import (
	"time"

	"gorm.io/gorm"
)

type Transaction struct {
	gorm.Model
	Amount       float64   `gorm:"type:float; not null"`
	IsInvestment bool      `gorm:"type:bool; not null"`
	Time         time.Time `gorm:"type:time; not null"`
	LoanID       uint      `gorm:"type:uint; not null"`
	Loan         Loan
}
