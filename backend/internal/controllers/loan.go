package controllers

import (
	"50Cent/backend/internal/constants"
	"50Cent/backend/internal/helper"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/stripe/stripe-go/v72/webhook"

	"github.com/stripe/stripe-go/v72"

	"50Cent/backend/internal/command"
	"50Cent/backend/internal/domain"

	"github.com/gin-gonic/gin"
)

// @Summary                     Create Loan
// @Tags                        Loans
// @Description                 Create loan request form
// @ID                          createLoan
// @Accept                      json
// @Produce                     json
// @Param                       input  body  command.CreateLoan  true  "account info"
// @securityDefinitions.apikey  ApiKeyAuth
// @Success                     200  {object}  statusResponse
// @Failure                     400  {object}  errorResponse
// @Failure                     500  {object}  errorResponse
// @Router                      /loans [post]
// @Security                    ApiKeyAuth
func (h *Controller) createLoan(c *gin.Context) {
	var input command.CreateLoan

	if err := c.BindJSON(&input); err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	consumerID, err := helper.GetConsumerIDFromCtx(c)
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	loan := domain.Loan{
		CreditSum:         input.CreditSum,
		CreditTitle:       input.CreditTitle,
		CreditDescription: input.CreditDescription,
		CreditTerm:        input.CreditTerm,
		CreditRate:        input.CreditRate,
		ConsumerID:        consumerID,
	}

	if err := h.services.Loan.Create(c, &loan); err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{"Loan": "created"})
}

// @Summary                     Accept Loan
// @Tags                        Loans
// @Description                 Accept loan request
// @ID                          acceptLoan
// @Accept                      json
// @Produce                     json
// @securityDefinitions.apikey  ApiKeyAuth
// @Success                     200  {object}  stripeURLResponse
// @Failure                     400  {object}  errorResponse
// @Failure                     500  {object}  errorResponse
// @Router                      /loans/:id/accept [post]
// @Security                    ApiKeyAuth
func (h *Controller) acceptLoan(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, "invalid id")
		return
	}

	investorID, err := helper.GetInvestorIDFromCtx(c)
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	url, err := h.services.Loan.Accept(c, id, investorID)
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusOK, stripeURLResponse{URL: url})
}

// @Summary                     Repay loan
// @Tags                        Loans
// @Description                 Make monthly payment for your loan
// @ID                          repayLoan
// @Accept                      json
// @Produce                     json
// @securityDefinitions.apikey  ApiKeyAuth
// @Success                     200  {object}  stripeURLResponse
// @Failure                     400  {object}  errorResponse
// @Failure                     500  {object}  errorResponse
// @Router                      /loans/:id/repay [post]
// @Security                    ApiKeyAuth
func (h *Controller) repayLoan(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, "invalid id")
		return
	}

	url, err := h.services.Loan.Repay(c, id, c.GetUint("ConsumerID"))
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusOK, stripeURLResponse{URL: url})
}

// @Summary                     Get All Loans
// @Tags                        Loans
// @Description                 Get all loans list
// @ID                          getallloans
// @Accept                      json
// @Produce                     json
// @Param        page           path      int  true  "Current Page"
// @Param        page_size      path      int  true  "Page Size"
// @securityDefinitions.apikey  ApiKeyAuth
// @Success                     200  {object}  statusResponse
// @Failure                     400  {object}  errorResponse
// @Failure                     500  {object}  errorResponse
// @Router                      /loans/{page}/{page_size} [get]
// @Security                    ApiKeyAuth
func (h *Controller) getLoans(c *gin.Context) {
	var p command.Pagination

	if err := c.BindQuery(&p); err != nil {
		p.Page = 1
		p.PageSize = 5
	}

	loanResponse, err := h.services.Loan.GetAll(c, p.Page, p.PageSize)
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, "")
		return
	}

	c.JSON(http.StatusOK, &loanResponse)
}

// @Summary                     Get loans by id
// @Tags                        Loans
// @Description                 Get loan by id (yet not )
// @ID                          getloanbyid
// @Accept                      json
// @Produce                     json
// @Param                       id   path      int  true  "Loan ID"
// @securityDefinitions.apikey  ApiKeyAuth
// @Success                     200  {object}  statusResponse
// @Failure                     400  {object}  errorResponse
// @Failure                     500  {object}  errorResponse
// @Router                      /loans/{id} [get]
// @Security                    ApiKeyAuth
func (h *Controller) getLoanByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, "invalid id")
		return
	}

	loan, err := h.services.Loan.GetByID(c, id)
	if err != nil {
		newErrorResponse(c, http.StatusNotFound, "ID not found")
		return
	}

	c.JSON(http.StatusOK, &loan)
}

// @Summary                     Update Loan
// @Tags                        Loans
// @Description                 Update loan by id
// @ID                          loanupdate
// @Accept                      json
// @Produce                     json
// @Param                       id   path      int  true  "Loan ID"
// @Param                       input  body  command.CreateLoan  true  "account info"
// @securityDefinitions.apikey  ApiKeyAuth
// @Success                     200  {object}  statusResponse
// @Failure                     400  {object}  errorResponse
// @Failure                     500  {object}  errorResponse
// @Router                      /loans/{id} [post]
// @Security                    ApiKeyAuth
func (h *Controller) updateLoan(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)

	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, "invalid loan id")
		return
	}

	var updatedInput command.UpdateLoan

	if errOnBind := c.BindJSON(&updatedInput); errOnBind != nil {
		newErrorResponse(c, http.StatusBadRequest, errOnBind.Error())
		return
	}

	loan := domain.Loan{

		CreditSum:         updatedInput.CreditSum,
		CreditTitle:       updatedInput.CreditTitle,
		CreditDescription: updatedInput.CreditDescription,
		CreditTerm:        updatedInput.CreditTerm,
		CreditRate:        updatedInput.CreditRate,
		ConsumerID:        c.GetUint("ConsumerID"),
	}

	if err := h.services.Loan.Update(c, id, &loan); err != nil {
		newErrorResponse(c, http.StatusBadRequest, "You can not update this loan")
		return
	}

	c.JSON(http.StatusOK, &updatedInput)
}

// @Summary                     Delete Loan
// @Tags                        Loans
// @Description                 Delete loan by id
// @ID                          loandelete
// @Accept                      json
// @Produce                     json
// @Param                       id   path      int  true  "Loan ID"
// @securityDefinitions.apikey  ApiKeyAuth
// @Success                     200  {object}  statusResponse
// @Failure                     400  {object}  errorResponse
// @Failure                     500  {object}  errorResponse
// @Router                      /loans/{id} [delete]
// @Security                    ApiKeyAuth
func (h *Controller) deleteLoan(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, "There is no such loan")
		return
	}

	if err := h.services.Loan.Delete(c, id); err != nil {
		newErrorResponse(c, http.StatusBadRequest, "You can not delete")
		return
	}

	c.JSON(http.StatusOK, gin.H{"Loan": "deleted"})
}

// @Summary                     Webhook for stripe events
// @Tags                        Webhook
// @Description                 Webhook for stripe events such as account confirmation, payment success or fail
// @ID                          stripeWebhook
// @Accept                      json
// @Produce                     json
// @Success                     200  {object}  statusResponse
// @Failure                     400  {object}  errorResponse
// @Failure                     500  {object}  errorResponse
// @Router                      /stripe/webhook [post]
func (h *Controller) stripeWebhook(c *gin.Context) {
	endpointSecret := h.cfg.Stripe.WebhookKey

	body, err := c.GetRawData()
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	event, err := webhook.ConstructEvent(body, c.GetHeader("Stripe-Signature"), endpointSecret)
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	switch event.Type {
	case constants.StripeAccountUpdated:
		var account stripe.Account
		if err := json.Unmarshal(event.Data.Raw, &account); err != nil {
			newErrorResponse(c, http.StatusBadRequest, err.Error())
			return
		}

		error1 := h.services.Consumer.AddPaymentConfirm(c, account.ID, account.DetailsSubmitted)
		error2 := h.services.Investor.AddPaymentConfirm(c, account.ID, account.DetailsSubmitted)

		if error1 == nil || error2 == nil {
			c.JSON(http.StatusOK, gin.H{"Account": "confirmed"})
			return
		}

		newErrorResponse(c, http.StatusBadRequest, "Invalid stripe event")

		return

	case constants.StripeCheckoutSessionCompleted:
		var session stripe.CheckoutSession
		if err := json.Unmarshal(event.Data.Raw, &session); err != nil {
			newErrorResponse(c, http.StatusBadRequest, err.Error())
			return
		}

		if err := h.services.CheckoutSessionCompleted(c, session.ID, session.PaymentIntent.ID); err != nil {
			newErrorResponse(c, http.StatusBadRequest, err.Error())
			return
		}

	case constants.StripePaymentSucceeded:
		var session stripe.CheckoutSession
		if err := json.Unmarshal(event.Data.Raw, &session); err != nil {
			newErrorResponse(c, http.StatusBadRequest, err.Error())
			return
		}

		if err := h.services.Loan.PaymentSuccess(c, session.ID); err != nil {
			newErrorResponse(c, http.StatusBadRequest, err.Error())
			return
		}

	case constants.StripePaymentFailed:
		var session stripe.CheckoutSession
		if err := json.Unmarshal(event.Data.Raw, &session); err != nil {
			newErrorResponse(c, http.StatusBadRequest, err.Error())
			return
		}

		if err := h.services.Loan.PaymentFailed(c, session.ID); err != nil {
			newErrorResponse(c, http.StatusBadRequest, err.Error())
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"Status": "processed"})
}

// @Summary                     Loan counteroffer
// @Tags                        Loan, Investor
// @Description                 Investor can suggest his loan terms to consumer
// @ID                          loanCounteroffer
// @Accept                      json
// @Produce                     json
// @Param                       input  body  command.CreateLoanCounteroffer  true  "counteroffer terms"
// @Success                     200  {object}  statusResponse
// @Failure                     400  {object}  errorResponse
// @Failure                     500  {object}  errorResponse
// @Router                      /loans/{id}/counteroffers [post]
func (h *Controller) loanCounteroffer(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, "There is no such loan")
		return
	}

	var input command.CreateLoanCounteroffer
	if err := c.BindJSON(&input); err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	loanCounteroffer := domain.LoanCounteroffer{
		CreditTerm: input.CreditTerm,
		CreditRate: input.CreditRate,
		LoanID:     uint(id),
	}

	if err := h.services.Counteroffer(c, &loanCounteroffer); err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusOK, statusResponse{Status: "Created"})
}

// @Summary                     Loan counteroffers
// @Tags                        Loan, Investor
// @Description                 Retrieve all counteroffers related to this loan
// @ID                          getLoanCounteroffers
// @Accept                      json
// @Produce                     json
// @Success                     200  {object}  statusResponse
// @Failure                     400  {object}  errorResponse
// @Failure                     500  {object}  errorResponse
// @Router                      /loans/{id}/counteroffers [get]
func (h *Controller) getLoanCounteroffers(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, "There is no such loan")
		return
	}

	counteroffers, err := h.services.GetAllCounteroffers(c, uint(id))
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusOK, loanCounteroffersResponse{Counteroffers: counteroffers})
}

// @Summary                     Loan counteroffer accept
// @Tags                        Loan, Investor, Consumer
// @Description                 Consumer can accept investor's terms and update loan details
// @ID                          loanCounterofferAccept
// @Accept                      json
// @Produce                     json
// @Success                     200  {object}  statusResponse
// @Failure                     400  {object}  errorResponse
// @Failure                     500  {object}  errorResponse
// @Router                      /loans/counteroffers/{id}/accept [post]
func (h *Controller) loanCounterofferAccept(c *gin.Context) {
	consumerID, err := helper.GetConsumerIDFromCtx(c)
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, "There is no such loanCounteroffer")
		return
	}

	if err := h.services.CounterofferAccept(c, consumerID, uint(id)); err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusOK, statusResponse{Status: "Accepted"})
}

// @Summary                     Loan counteroffer reject
// @Tags                        Loan, Investor, Consumer
// @Description                 Consumer can reject investor's terms if he doesn't want to accept them
// @ID                          loanCounterofferReject
// @Accept                      json
// @Produce                     json
// @Success                     200  {object}  statusResponse
// @Failure                     400  {object}  errorResponse
// @Failure                     500  {object}  errorResponse
// @Router                      /loans/counteroffers/{id}/reject [post]
func (h *Controller) loanCounterofferReject(c *gin.Context) {
	consumerID, err := helper.GetConsumerIDFromCtx(c)
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, "There is no such loanCounteroffer")
		return
	}

	if err := h.services.CounterofferReject(c, consumerID, uint(id)); err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusOK, statusResponse{Status: "Accepted"})
}

// @Summary                     Get Loan Transactions
// @Tags                        Loan, Investor, Consumer
// @Description                 User can get transactions related to his loan
// @ID                          getLoanTransactions
// @Accept                      json
// @Produce                     json
// @Success                     200  {object}  statusResponse
// @Failure                     400  {object}  errorResponse
// @Failure                     500  {object}  errorResponse
// @Router                      /loans/{id}/transactions [get]
func (h *Controller) getLoanTransactions(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, "There is no such loanCounteroffer")
		return
	}

	transactions, err := h.services.GetTransactionsByLoanID(c, uint(id))
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusOK, transactionsResponse{Transactions: transactions})
}
