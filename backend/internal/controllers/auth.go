package controllers

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"

	"50Cent/backend/internal/service"

	"50Cent/backend/internal/command"
	"50Cent/backend/internal/domain"
	"50Cent/backend/internal/helper"

	"github.com/gin-gonic/gin"
)

// @Summary      Sign up
// @Tags         Sign-up
// @Description  Create not confirmed user account
// @ID           registration
// @Accept       json
// @Produce      json
// @Param        input  body      command.Registration  true  "account info"
// @Success      200    {object}  statusResponse
// @Failure      400    {object}  errorResponse
// @Failure      500    {object}  errorResponse
// @Router       /auth/registration [post]
func (h *Controller) registration(c *gin.Context) {
	var input command.Registration

	if err := c.BindJSON(&input); err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	user := &domain.User{
		Email:    input.Email,
		Password: input.Password,
		Phone:    input.Phone,
	}

	if _, err := h.services.Auth.Registration(c, user); err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, statusResponse{Status: "created"})
}

func (h *Controller) googleRegistration(c *gin.Context) {
	var input command.GoogleRegistration

	if err := c.BindJSON(&input); err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	email := h.services.GetUserFromGoogleToken(c, input.Token, input.ClientID)

	user := &domain.User{
		Email:      email,
		Password:   "",
		IsVerified: true,
	}

	registeredUser, _ := h.services.Auth.GetUserByEmail(c, email)
	if registeredUser == nil {
		if _, err := h.services.Auth.Registration(c, user); err != nil {
			newErrorResponse(c, http.StatusInternalServerError, err.Error())
			return
		}
	}

	token, typesMFA, err := h.services.Auth.ExternalLogin(c, email)
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, LoginResponse{
		Token:    token,
		TypesMFA: typesMFA,
	})
}

func (h *Controller) facebookRegistration(c *gin.Context) {
	var input command.FacebookRegistration

	if err := c.BindJSON(&input); err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	userDetails, err := h.services.Auth.GetUserInfoFromFacebook(input.Token)
	if err != nil {
		fmt.Println("GetUserInfoFromFacebook error", err)
	}

	user := &domain.User{
		Email:      userDetails.Email,
		Password:   "",
		IsVerified: true,
	}

	registeredUser, _ := h.services.Auth.GetUserByEmail(c, userDetails.Email)
	if registeredUser == nil {
		if _, registrationErr := h.services.Auth.Registration(c, user); err != nil {
			newErrorResponse(c, http.StatusInternalServerError, registrationErr.Error())
			return
		}
	}

	token, typesMFA, err := h.services.Auth.ExternalLogin(c, userDetails.Email)
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, LoginResponse{
		Token:    token,
		TypesMFA: typesMFA,
	})
}

func (h *Controller) githubRegistration(c *gin.Context) {
	var input command.GithubRegistration

	if err := c.BindJSON(&input); err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	code := input.Code

	clientID := h.cfg.Github.ClientID
	clientSecret := h.cfg.Github.ClientSecret

	requestBodyMap := map[string]string{
		"client_id":     clientID,
		"client_secret": clientSecret,
		"code":          code,
	}

	requestJSON, _ := json.Marshal(requestBodyMap)

	req, reqerr := http.NewRequest(
		"POST",
		"https://github.com/login/oauth/access_token",
		bytes.NewBuffer(requestJSON),
	)

	if reqerr != nil {
		log.Panic("Request the Github token failed")
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")

	resp, resperr := http.DefaultClient.Do(req)
	if resperr != nil {
		log.Panic("Request failed")
	}

	respbody, _ := io.ReadAll(resp.Body)

	var ghresp command.GithubAccessTokenResponse

	err := json.Unmarshal(respbody, &ghresp)
	if err != nil {
		fmt.Println(err)
	}

	email, err := service.GetGitHubUser(ghresp.AccessToken)
	if err != nil {
		fmt.Println(err)
	}

	user := &domain.User{
		Email:      email.Email,
		Password:   "",
		IsVerified: true,
	}

	registeredUser, _ := h.services.Auth.GetUserByEmail(c, email.Email)
	if registeredUser == nil {
		if _, registrationErr := h.services.Auth.Registration(c, user); err != nil {
			newErrorResponse(c, http.StatusInternalServerError, registrationErr.Error())
			return
		}
	}

	token, typesMFA, err := h.services.Auth.ExternalLogin(c, email.Email)
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, LoginResponse{
		Token:    token,
		TypesMFA: typesMFA,
	})
}

// @Summary      Email confirmation
// @Tags         Sign-up
// @Description  Confirm user email
// @ID           confirm
// @Accept       json
// @Produce      json
// @Param        input  body      command.ConfirmEmail  true  "Email and code for confirmation"
// @Success      200    {object}  statusResponse
// @Failure      400    {object}  errorResponse
// @Failure      500    {object}  errorResponse
// @Router       /auth/registration/confirm [post]
func (h *Controller) confirm(c *gin.Context) {
	var input command.ConfirmEmail

	if err := c.BindJSON(&input); err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	if err := h.services.Auth.Confirm(c, input.Email, input.Code); err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, statusResponse{Status: "confirmed"})
}

// @Summary Register OTP and Google Authenticator
// @Tags Sign-up
// @Description Register OTP by installing Google Authenticator on your phone and scanning QR code
// @ID registrationOTP
// @Accept json
// @Produce json
// @Success 200 {object} otpResponse
// @Failure 400 {object} errorResponse
// @Failure 500 {object} errorResponse
// @Router /auth/registration/otp [post]
func (h *Controller) registrationOTP(c *gin.Context) {
	code, err := h.services.Auth.RegisterOTP(c, c.GetUint("userID"))
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, otpResponse{Code: code})
}

// @Summary OTP registration confirmation
// @Tags Sign-up
// @Description Confirm OTP set-up by checking code from Google Authenticator
// @ID confirmOTP
// @Accept json
// @Produce json
// @Param input body command.OTP true "Code for confirmation"
// @Success 200 {object} statusResponse
// @Failure 400 {object} errorResponse
// @Failure 500 {object} errorResponse
// @Router /auth/registration/otp/confirm [post]
func (h *Controller) confirmOTP(c *gin.Context) {
	var input command.OTP

	if err := c.BindJSON(&input); err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	user, err := h.GetUser(c)
	if err != nil {
		newErrorResponse(c, http.StatusUnauthorized, err.Error())
	}

	if err := h.services.Auth.ConfirmOTP(c, user.Email, input.Code); err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusOK, statusResponse{Status: "confirmed"})
}

// @Summary Get temporary JWT login token
// @Tags Login, Admin
// @Description Send email and password to get temporary JWT login token then use it in the 2nd stage
// @ID login
// @Accept json
// @Produce json
// @Param input body command.Login true "Email and password for login"
// @Success 200 {object} LoginResponse
// @Failure 400 {object} errorResponse
// @Failure 500 {object} errorResponse
// @Router /auth/login [post]
func (h *Controller) login(c *gin.Context) {
	var input command.Login

	if err := c.BindJSON(&input); err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	token, typesMFA, err := h.services.Auth.Login(c, input.Email, input.Password)
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, LoginResponse{
		Token:    token,
		TypesMFA: typesMFA,
	})
}

// @Summary Send verification code to phone
// @Tags Login, Admin
// @Description After receiving of temporary token user can send verification code on his phone
// @ID loginPhone
// @Accept json
// @Produce json
// @Success 200 {object} statusResponse
// @Failure 400 {object} errorResponse
// @Failure 500 {object} errorResponse
// @Router /auth/login/phone [post]
func (h *Controller) loginPhone(c *gin.Context) {
	user, err := h.GetUser(c)
	if err != nil {
		newErrorResponse(c, http.StatusUnauthorized, err.Error())
	}

	err = h.services.Auth.LoginPhone(c, user.Email)
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, statusResponse{Status: "Code sent"})
}

// @Summary Send verification code to email
// @Tags Login, Admin
// @Description After receiving of temporary token user can send verification code on his email
// @ID loginEmail
// @Accept json
// @Produce json
// @Success 200 {object} statusResponse
// @Failure 400 {object} errorResponse
// @Failure 500 {object} errorResponse
// @Router /auth/login/email [post]
func (h *Controller) loginEmail(c *gin.Context) {
	user, err := h.GetUser(c)
	if err != nil {
		newErrorResponse(c, http.StatusUnauthorized, err.Error())
	}

	err = h.services.Auth.LoginEmail(c, user.Email)
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, statusResponse{Status: "Code sent"})
}

// @Summary Check verification code from phone
// @Tags Login, Admin
// @Description User can send verification code from his phone and get JWT token
// @ID loginConfirmPhone
// @Accept json
// @Produce json
// @Param input body command.LoginConfirm true "Verification code for login"
// @Success 200 {object} LoginConfirmResponse
// @Failure 400 {object} errorResponse
// @Failure 500 {object} errorResponse
// @Router /auth/login/confirm/phone [post]
func (h *Controller) loginConfirmPhone(c *gin.Context) {
	var input command.LoginConfirm

	if err := c.BindJSON(&input); err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	user, err := h.GetUser(c)
	if err != nil {
		newErrorResponse(c, http.StatusUnauthorized, err.Error())
		return
	}

	token, err := h.services.Auth.LoginConfirmPhone(c, user.Email, input.Code)
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, LoginConfirmResponse{
		Token: token,
	})
}

// @Summary Check verification code from email
// @Tags Login, Admin
// @Description User can send verification code from his email and get JWT token
// @ID loginConfirmEmail
// @Accept json
// @Produce json
// @Param input body command.LoginConfirm true "Verification code for login"
// @Success 200 {object} LoginConfirmResponse
// @Failure 400 {object} errorResponse
// @Failure 500 {object} errorResponse
// @Router /auth/login/confirm/email [post]
func (h *Controller) loginConfirmEmail(c *gin.Context) {
	var input command.LoginConfirm

	if err := c.BindJSON(&input); err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	user, err := h.GetUser(c)
	if err != nil {
		newErrorResponse(c, http.StatusUnauthorized, err.Error())
		return
	}

	token, err := h.services.Auth.LoginConfirmEmail(c, user.Email, input.Code)
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, LoginConfirmResponse{
		Token: token,
	})
}

// @Summary Check verification code from OTP
// @Tags Login, Admin
// @Description User can send verification code from his phone and get JWT token
// @ID loginConfirmOTP
// @Accept json
// @Produce json
// @Param input body command.OTP true "Verification code for login"
// @Success 200 {object} LoginConfirmResponse
// @Failure 400 {object} errorResponse
// @Failure 500 {object} errorResponse
// @Router /auth/login/confirm/otp [post]
func (h *Controller) loginConfirmOTP(c *gin.Context) {
	var input command.OTP

	if err := c.BindJSON(&input); err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	user, err := h.GetUser(c)
	if err != nil {
		newErrorResponse(c, http.StatusUnauthorized, err.Error())
	}

	token, err := h.services.Auth.LoginConfirmOTP(c, user.Email, user.ID, input.Code)
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, LoginConfirmResponse{
		Token: token,
	})
}

// @Summary      Check Email
// @Tags         Reset Password
// @Description  Check is email in db
// @ID           checkEmailForReset
// @Accept       json
// @Produce      json
// @Param        input  body      command.RequestToResetPassword  true  "Email"
// @Success      200    {object}  statusResponse
// @Failure      400    {object}  errorResponse
// @Failure      500    {object}  errorResponse
// @Router       /auth/reset [post]
func (h *Controller) checkEmailForReset(c *gin.Context) {
	var input command.RequestToResetPassword

	if err := c.BindJSON(&input); err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	user, err := h.services.Auth.GetUserByEmail(c, input.Email)
	if user == nil {
		newErrorResponse(c, http.StatusNotFound, "user not found")
		return
	}

	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	if err := h.services.Auth.SetConfirmationCode(c, input.Email, service.Email); err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, statusResponse{Status: "ok"})
}

// @Summary      Email confirmation
// @Tags         Reset Password
// @Description  Confirm user email
// @ID           confirm Reset
// @Accept       json
// @Produce      json
// @Param        input  body      command.ConfirmEmail  true  "Email and code for confirmation"
// @Success      200    {object}  statusResponse
// @Failure      400    {object}  errorResponse
// @Failure      500    {object}  errorResponse
// @Router       /auth/reset/confirm [post]
func (h *Controller) confirmReset(c *gin.Context) {
	var input command.ConfirmResetPassword

	if err := c.BindJSON(&input); err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	err := h.services.Auth.Confirm(c, input.Email, input.Code)
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, statusResponse{Status: "ok"})
}

// @Summary      Change Password
// @Tags         Reset Password
// @Description  Change user password
// @ID           Reset
// @Accept       json
// @Produce      json
// @Param        input  body      command.ChangePassword  true  "Email and password to change"
// @Success      200    {object}  statusResponse
// @Failure      400    {object}  errorResponse
// @Failure      500    {object}  errorResponse
// @Router       /auth/reset/change [post]
func (h *Controller) changePassword(c *gin.Context) {
	var input command.ChangePassword

	if err := c.BindJSON(&input); err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	err := h.services.Auth.UpdatePassword(c, input.Email, input.Password)
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, statusResponse{Status: "ok"})
}

// @Summary      Register new admin
// @Tags         Admin
// @Description  Create new admin account
// @ID           admin-registration
// @Accept       json
// @Produce      json
// @Param        input  body      command.Registration  true  "Email and passwords for admin"
// @Success      200    {object}  statusResponse
// @Failure      400    {object}  errorResponse
// @Failure      500    {object}  errorResponse
// @Router       /admin/registration [post]
func (h *Controller) adminRegistration(c *gin.Context) {
	var input command.Registration

	if err := c.BindJSON(&input); err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	user := &domain.User{
		Email:    input.Email,
		Password: input.Password,
		Phone:    input.Phone,
	}

	userID, err := h.services.Auth.Registration(c, user)
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	// add userId to admins table, so we can identify admin later
	admin := &domain.Admin{
		UserID: userID,
	}

	if err := h.services.Auth.AdminRegistration(c, admin); err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, statusResponse{Status: "created"})
}

// @Summary      Register new consumer
// @Tags         Consumer
// @Description  Register new consumer for existing user
// @ID           consumerRegistration
// @Accept       json
// @Produce      json
// @Param        input  body      command.ConsumerRegistration true "Parameters for consumer registration"
// @Success      200    {object}  statusResponse
// @Failure      400    {object}  errorResponse
// @Failure      500    {object}  errorResponse
// @Router       /auth/registration/consumer [post]
func (h *Controller) consumerRegistration(c *gin.Context) {
	var input command.ConsumerRegistration

	if errOnBind := c.ShouldBind(&input); errOnBind != nil {
		newErrorResponse(c, http.StatusBadRequest, errOnBind.Error())
		return
	}

	if input.Photo.Size == 0 {
		newErrorResponse(c, http.StatusBadRequest, "Photo is required")
		return
	}

	if input.WorkFile.Size == 0 {
		newErrorResponse(c, http.StatusBadRequest, "Work file is required")
		return
	}

	user, err := h.GetUser(c)
	if err != nil {
		newErrorResponse(c, http.StatusUnauthorized, err.Error())
	}

	consumer := &domain.Consumer{
		Name:         input.Name,
		Surname:      input.Surname,
		MiddleName:   input.MiddleName,
		UserEmail:    user.Email,
		Photo:        input.Photo,
		WorkFile:     input.WorkFile,
		IDFile:       input.IDFile,
		PropertyFile: input.PropertyFile,
	}

	if err := h.services.ConsumerRegistration(c, consumer); err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusOK, statusResponse{Status: "Added consumer to user"})
}

// @Summary      Register stripe account for existing consumer
// @Tags         ConsumerPayment
// @Description  Register stripe account for existing consumer
// @ID           consumerAddPayment
// @Accept       json
// @Produce      json
// @Success      200    {object}  statusResponse
// @Failure      400    {object}  errorResponse
// @Failure      500    {object}  errorResponse
// @Router       /auth/registration/consumer/addPayment [post]
func (h *Controller) consumerAddPayment(c *gin.Context) {
	userID, err := helper.GetIDFromCtx(c)
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	url, err := h.services.Consumer.AddPayment(c, uint64(userID))
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusOK, addPaymentResponse{URL: url})
}

// @Summary      Register new investor
// @Tags         Investor
// @Description  Register new investor for existing user
// @ID           investorRegistration
// @Accept       json
// @Produce      json
// @Param        input  body      command.InvestorRegistration true "Parameters for investor registration"
// @Success      200    {object}  statusResponse
// @Failure      400    {object}  errorResponse
// @Failure      500    {object}  errorResponse
// @Router       /auth/registration/investor [post]
func (h *Controller) investorRegistration(c *gin.Context) {
	var input command.InvestorRegistration

	if err := c.ShouldBind(&input); err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	if input.Photo.Size == 0 {
		newErrorResponse(c, http.StatusBadRequest, "Photo is required")
		return
	}

	user, err := h.GetUser(c)
	if err != nil {
		newErrorResponse(c, http.StatusUnauthorized, err.Error())
	}

	investor := &domain.Investor{
		Name:       input.Name,
		Surname:    input.Surname,
		MiddleName: input.MiddleName,
		UserEmail:  user.Email,
		Photo:      input.Photo,
		IDFile:     input.IDFile,
	}

	if err := h.services.InvestorRegistration(c, investor); err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusOK, statusResponse{Status: "Added investor to user"})
}

// @Summary      Register stripe account for existing investor
// @Tags         ConsumerPayment
// @Description  Register stripe account for existing investor
// @ID           investorAddPayment
// @Accept       json
// @Produce      json
// @Success      200    {object}  statusResponse
// @Failure      400    {object}  errorResponse
// @Failure      500    {object}  errorResponse
// @Router       /auth/registration/investor/addPayment [post]
func (h *Controller) investorAddPayment(c *gin.Context) {
	userID, err := helper.GetIDFromCtx(c)
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	url, err := h.services.Investor.AddPayment(c, uint64(userID))
	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusOK, addPaymentResponse{URL: url})
}

func (h *Controller) getCurrentUser(c *gin.Context) {
	user, err := h.GetUser(c)
	if err != nil {
		newErrorResponse(c, http.StatusUnauthorized, err.Error())
		return
	}

	c.JSON(http.StatusOK, user)
}

// helper
func (h *Controller) GetUser(c *gin.Context) (user *domain.User, err error) {
	userID, err := helper.GetIDFromCtx(c)
	if err != nil {
		return nil, errors.New("id's not found in context")
	}

	user, err = h.services.GetUserByID(c, userID)
	if err != nil {
		return nil, errors.New("user's not found")
	}

	return user, nil
}
