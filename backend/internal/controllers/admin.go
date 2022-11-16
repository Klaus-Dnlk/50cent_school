package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// @Summary      Get all unverified users in JSON
// @Tags         Admin
// @Description  Get all unverified users (both investors and loaners) in JSON
// @ID           admin-get-all-unverified-users
// @Accept       json
// @Produce      json
// @Success      200  {object}  map[string]any
// @Failure      400  {object}  errorResponse
// @Failure      500  {object}  errorResponse
// @Router       /admin/actions/users [get]
// @Security     ApiKeyAuth
func (h *Controller) getAllUsers(c *gin.Context) {
	users, err := h.services.Admin.GetALlUnverifiedUsers(c)
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{"users": users})
}

// @Summary      Approve investor with given ID
// @Tags         Admin
// @Description  Approve account of user with given ID
// @ID           admin-approve-investor
// @Produce      json
// @Param        id   path      int  true  "Account ID"
// @Success      200  {object}  map[string]any
// @Failure      400  {object}  errorResponse
// @Failure      500  {object}  errorResponse
// @Router       /admin/actions/users/investors/{id}/approve [post]
// @Security     ApiKeyAuth
func (h *Controller) approveInvestor(c *gin.Context) {
	userID, err := findUserIDFromURL(c)

	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	if err := h.services.Investor.ApproveInvestorByID(c, userID); err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{"Investor with the following user ID has been successfully approved: ": userID})
}

// A helper func that finds id from the url and converts it to uint
func findUserIDFromURL(c *gin.Context) (uint, error) {
	userID, err := strconv.Atoi(c.Param("id"))

	return uint(userID), err
}

// @Summary      Approve consumer with given ID
// @Tags         Admin
// @Description  Approve account of user with given ID
// @ID           admin-approve-consumer
// @Produce      json
// @Param        id   path      int  true  "Account ID"
// @Success      200  {object}  map[string]any
// @Failure      400  {object}  errorResponse
// @Failure      500  {object}  errorResponse
// @Router       /admin/actions/users/consumers/{id}/approve [post]
// @Security     ApiKeyAuth
func (h *Controller) approveConsumer(c *gin.Context) {
	userID, err := findUserIDFromURL(c)
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	if err := h.services.Consumer.ApproveConsumerByID(c, userID); err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{"Consumer with the following user ID has been successfully approved: ": userID})
}

// @Summary      Decline user with given ID
// @Tags         Admin
// @Description  Decline account of user with given ID
// @ID           admin-decline-user
// @Produce      json
// @Param        id   path      int  true  "Account ID"
// @Param        accountType   path      string  true  "Account type(either 'consumers' or 'investors')"
// @Success      200  {object}  map[string]any
// @Failure      400  {object}  errorResponse
// @Failure      500  {object}  errorResponse
// @Router       /admin/actions/users/{accountType}/{id}/decline [post]
// @Security     ApiKeyAuth
func (h *Controller) declineUser(c *gin.Context) {
	userID, err := findUserIDFromURL(c)
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{"User with the following user ID has been successfully declined: ": userID})
}
