package domain

type LoanCounteroffer struct {
	ID         uint
	CreditTerm uint
	CreditRate float64
	LoanID     uint
}
