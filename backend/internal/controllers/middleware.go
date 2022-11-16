package controllers

import (
	"net/http"
	"strconv"
	"strings"

	"50Cent/backend/internal/constants"
	"50Cent/backend/internal/helper"

	"github.com/gin-gonic/gin"
)

func (h *Controller) AuthMiddleware(c *gin.Context) {
	header := c.GetHeader("Authorization")
	if header == "" {
		newErrorResponse(c, http.StatusUnauthorized, "Authorization header is empty")
		return
	}

	headerParts := strings.Split(header, " ")
	if len(headerParts) != 2 {
		newErrorResponse(c, http.StatusUnauthorized, "Authorization header is invalid")
		return
	}

	_, userID, isTemporary, err := h.services.Auth.ParseToken(headerParts[1])
	if err != nil {
		newErrorResponse(c, http.StatusUnauthorized, err.Error())
		return
	}

	if isTemporary {
		newErrorResponse(c, http.StatusUnauthorized, "Invalid token")
		return
	}

	c.Set("userID", userID)

	c.Next()
}

func (h *Controller) LoginMiddleware(c *gin.Context) {
	header := c.GetHeader("Authorization")
	if header == "" {
		newErrorResponse(c, http.StatusUnauthorized, "Authorization header is empty")
		return
	}

	headerParts := strings.Split(header, " ")
	if len(headerParts) != 2 {
		newErrorResponse(c, http.StatusUnauthorized, "Authorization header is invalid")
		return
	}

	_, userID, _, err := h.services.Auth.ParseToken(headerParts[1])
	if err != nil {
		newErrorResponse(c, http.StatusUnauthorized, err.Error())
		return
	}

	c.Set("userID", userID)
	c.Next()
}

func (h *Controller) AdminAuthMiddleware(c *gin.Context) {
	userID, err := helper.GetIDFromCtx(c)
	if err != nil {
		newErrorResponse(c, http.StatusUnauthorized, err.Error())
		return
	}

	admin, err := h.services.Auth.GetAdminByID(c, userID)
	if err != nil || admin == nil {
		newErrorResponse(c, http.StatusUnauthorized, err.Error())
		return
	}
}

func (h *Controller) CheckAccessLoanMiddleware(c *gin.Context) {
	userID, err := helper.GetIDFromCtx(c)
	if err != nil {
		newErrorResponse(c, http.StatusUnauthorized, err.Error())
		return
	}

	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, "invalid id")
		return
	}

	loan, err := h.services.Loan.GetByID(c, id)
	if err != nil || loan == nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	if userID != loan.ConsumerID && userID != loan.InvestorID {
		newErrorResponse(c, http.StatusUnauthorized, "you're not authorized to do this action")
		return
	}

	c.Set("ConsumerID", loan.ConsumerID)
}

func (h *Controller) CheckAccessProfileMiddleware(c *gin.Context) {
	userID, err := helper.GetIDFromCtx(c)
	if err != nil {
		newErrorResponse(c, http.StatusUnauthorized, err.Error())
		return
	}

	userType := c.Param("type")

	if userType == "" {
		newErrorResponse(c, http.StatusBadRequest, "invalid type")
		return
	}

	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, "invalid id")
		return
	}

	switch userType {
	case constants.Consumer:
		consumer, err := h.services.Consumer.GetConsumerByID(c, id)

		if err != nil || consumer == nil {
			newErrorResponse(c, http.StatusUnauthorized, err.Error())
			return
		}

		if consumer.UserID != userID {
			newErrorResponse(c, http.StatusUnauthorized, "you're not authorized to do this action")
			return
		}
	case constants.Investor:
		return
	}
}

// Verification consumer or investor
func (h *Controller) VerifyConsumerMiddleware(c *gin.Context) {
	userID, err := helper.GetIDFromCtx(c)
	if err != nil {
		newErrorResponse(c, http.StatusUnauthorized, err.Error())
		return
	}

	consumer, _ := h.services.GetConsumerByUserID(c, uint64(userID))
	if consumer != nil && consumer.UserID == userID {
		newErrorResponse(c, http.StatusBadRequest, "consumer already exists")
		return
	}
}

func (h *Controller) VerifyInvestorMiddleware(c *gin.Context) {
	userID, err := helper.GetIDFromCtx(c)
	if err != nil {
		newErrorResponse(c, http.StatusUnauthorized, err.Error())
		return
	}

	investor, _ := h.services.GetInvestorByUserID(c, uint64(userID))
	if investor != nil && investor.UserID == userID {
		newErrorResponse(c, http.StatusBadRequest, "investor already exists")
		return
	}
}

func (h *Controller) VerifyConsumerExistsMiddleware(c *gin.Context) {
	userID, err := helper.GetIDFromCtx(c)
	if err != nil {
		newErrorResponse(c, http.StatusUnauthorized, err.Error())
		return
	}

	consumer, err := h.services.GetConsumerByUserID(c, uint64(userID))
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, "consumer doesn't exist")
		return
	}

	if !consumer.StripeConfirmed {
		newErrorResponse(c, http.StatusBadRequest, "consumer doesn't have confirmed Stripe account")
		return
	}

	c.Set("ConsumerID", consumer.ID)
	c.Next()
}

func (h *Controller) VerifyInvestorExistsMiddleware(c *gin.Context) {
	userID, err := helper.GetIDFromCtx(c)
	if err != nil {
		newErrorResponse(c, http.StatusUnauthorized, err.Error())
		return
	}

	investor, err := h.services.GetInvestorByUserID(c, uint64(userID))
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, "investor doesn't exist")
		return
	}

	if !investor.StripeConfirmed {
		newErrorResponse(c, http.StatusBadRequest, "investor doesn't have confirmed Stripe account")
		return
	}

	c.Set("InvestorID", investor.ID)
	c.Next()
}
