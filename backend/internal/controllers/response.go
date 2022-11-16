package controllers

import (
	"50Cent/backend/internal/domain"
	"log"

	"github.com/gin-gonic/gin"
)

type errorResponse struct {
	Message string `json:"message"`
}

type statusResponse struct {
	Status string `json:"status"`
}

type otpResponse struct {
	Code []byte `json:"code"`
}

func newErrorResponse(c *gin.Context, statusCode int, message string) {
	log.Println(message)
	c.AbortWithStatusJSON(statusCode, errorResponse{message})
}

type LoginResponse struct {
	Token    string   `json:"token"`
	TypesMFA []string `json:"typesMFA"`
}

type LoginConfirmResponse struct {
	Token string `json:"token"`
}

type addPaymentResponse struct {
	URL string `json:"url"`
}

type stripeURLResponse struct {
	URL string `json:"url"`
}

type transactionsResponse struct {
	Transactions []domain.Transaction `json:"transactions"`
}

type balancesResponse struct {
	Balances []domain.Balance `json:"balances"`
}

type payoutsResponse struct {
	Payouts []domain.Payout `json:"payouts"`
}

type loanCounteroffersResponse struct {
	Counteroffers []domain.LoanCounteroffer `json:"loan_counteroffers"`
}
