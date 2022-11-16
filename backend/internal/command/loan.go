package command

type CreateLoan struct {
	CreditSum         float64 `json:"creditSum" binding:"required"`
	CreditTitle       string  `json:"creditTitle" binding:"required"`
	CreditDescription string  `json:"creditDesc" binding:"required"`
	CreditTerm        uint    `json:"creditTerm" binding:"required"`
	CreditRate        float64 `json:"creditRate" binding:"required"`
}

type UpdateLoan struct {
	CreditSum         float64 `json:"creditSum" binding:"required"`
	CreditTitle       string  `json:"creditTitle" binding:"required"`
	CreditDescription string  `json:"creditDesc" binding:"required"`
	CreditTerm        uint    `json:"creditTerm" binding:"required"`
	CreditRate        float64 `json:"creditRate" binding:"required"`
}
