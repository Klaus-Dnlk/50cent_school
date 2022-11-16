package domain

import "time"

type Transaction struct {
	ID           uint
	Amount       float64
	IsInvestment bool
	Time         time.Time
	LoanID       uint
}
