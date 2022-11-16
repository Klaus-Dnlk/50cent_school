package controllers

import (
	"50Cent/backend/internal/helper"
	"net/http"

	"github.com/gin-gonic/gin"
)

// @Summary                     Get Balance history for consumer
// @Tags                        Consumer
// @Description                 Get List of balance snapshots
// @ID                          getBalanceHistoryConsumer
// @Accept                      json
// @Produce                     json
// @securityDefinitions.apikey  ApiKeyAuth
// @Success                     200  {object}  balancesResponse
// @Failure                     400  {object}  errorResponse
// @Failure                     500  {object}  errorResponse
// @Router                      /consumers/balance [get]
// @Security                    ApiKeyAuth
func (h *Controller) getBalanceHistoryConsumer(c *gin.Context) {
	consumerID, err := helper.GetConsumerIDFromCtx(c)
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	balances, err := h.services.Consumer.GetBalanceHistory(c, consumerID)
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusOK, balancesResponse{Balances: balances})
}

// @Summary                     Get required payments for consumer
// @Tags                        Consumer
// @Description                 Get List of required payments snapshots
// @ID                          getRequiredPayments
// @Accept                      json
// @Produce                     json
// @securityDefinitions.apikey  ApiKeyAuth
// @Success                     200  {object}  payoutsResponse
// @Failure                     400  {object}  errorResponse
// @Failure                     500  {object}  errorResponse
// @Router                      /consumers/payments [get]
// @Security                    ApiKeyAuth
func (h *Controller) getRequiredPayments(c *gin.Context) {
	consumerID, err := helper.GetConsumerIDFromCtx(c)
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	payments, err := h.services.Consumer.GetRequiredPayments(c, consumerID)
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusOK, payoutsResponse{Payouts: payments})
}
