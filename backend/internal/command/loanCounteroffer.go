package command

type CreateLoanCounteroffer struct {
	CreditTerm uint    `json:"creditTerm" binding:"required"`
	CreditRate float64 `json:"creditRate" binding:"required"`
}
