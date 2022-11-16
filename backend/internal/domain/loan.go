package domain

import "time"

type Loan struct {
	ID                uint
	CreditSum         float64
	CreditTitle       string
	CreditDescription string
	CreditTerm        uint
	CreditRate        float64
	ReturnedAmount    uint
	IsReturned        bool
	IsAccepted        bool
	AcceptedAt        time.Time
	ConsumerID        uint
	InvestorID        uint
}

type LoanResponse struct {
	TotalPages float64
	Data       []Loan
}
