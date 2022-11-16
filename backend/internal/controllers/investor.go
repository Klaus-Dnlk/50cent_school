package controllers

import (
	"50Cent/backend/internal/helper"
	"net/http"

	"github.com/gin-gonic/gin"
)

// @Summary                     Get Balance history for investor
// @Tags                        Investor
// @Description                 Get List of balance snapshots
// @ID                          getBalanceHistoryInvestor
// @Accept                      json
// @Produce                     json
// @securityDefinitions.apikey  ApiKeyAuth
// @Success                     200  {object}  balancesResponse
// @Failure                     400  {object}  errorResponse
// @Failure                     500  {object}  errorResponse
// @Router                      /investors/balance [get]
// @Security                    ApiKeyAuth
func (h *Controller) getBalanceHistoryInvestor(c *gin.Context) {
	investorID, err := helper.GetInvestorIDFromCtx(c)
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	balances, err := h.services.Investor.GetBalanceHistory(c, investorID)
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusOK, balancesResponse{Balances: balances})
}

// @Summary                     Get potential payouts for investor
// @Tags                        Investor
// @Description                 Get List of potential payouts snapshots
// @ID                          getPotentialPayouts
// @Accept                      json
// @Produce                     json
// @securityDefinitions.apikey  ApiKeyAuth
// @Success                     200  {object}  payoutsResponse
// @Failure                     400  {object}  errorResponse
// @Failure                     500  {object}  errorResponse
// @Router                      /investors/payouts [get]
// @Security                    ApiKeyAuth
func (h *Controller) getPotentialPayouts(c *gin.Context) {
	investorID, err := helper.GetInvestorIDFromCtx(c)
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	payouts, err := h.services.Investor.GetPotentialPayouts(c, investorID)
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusOK, payoutsResponse{Payouts: payouts})
}
