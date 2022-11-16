package controllers

import (
	"50Cent/backend/config"
	// swag docs
	_ "50Cent/backend/docs"
	"50Cent/backend/internal/service"

	"github.com/gin-contrib/cors"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

type Controller struct {
	services *service.Service
	cfg      *config.Config
}

func NewController(services *service.Service, cfg *config.Config) *Controller {
	return &Controller{
		services: services,
		cfg:      cfg,
	}
}

func (h *Controller) InitRouter(port string) error {
	router := gin.Default()

	corsConfig := cors.DefaultConfig()
	corsConfig.AddAllowHeaders("Authorization")
	corsConfig.AllowAllOrigins = true
	corsConfig.AllowMethods = []string{"GET,POST,PUT"}
	router.Use(cors.New(corsConfig))

	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	gr := router.Group("/api/v1")

	stripe := gr.Group("/stripe")
	stripe.POST("/webhook", h.stripeWebhook)

	upload := gr.Group("/upload")
	upload.POST("/personal", h.personaIDUpload)
	upload.POST("/general", h.generalUpload)

	auth := gr.Group("/auth")

	auth.POST("/registration", h.registration)
	auth.POST("/registration/google", h.googleRegistration)
	auth.POST("/registration/facebook", h.facebookRegistration)
	auth.POST("/registration/github", h.githubRegistration)
	auth.POST("/registration/confirm", h.confirm)
	auth.POST("/registration/otp", h.AuthMiddleware, h.registrationOTP)
	auth.POST("/registration/otp/confirm", h.AuthMiddleware, h.confirmOTP)
	auth.POST("/registration/consumer", h.AuthMiddleware, h.consumerRegistration)
	auth.POST("/registration/consumer/addPayment", h.AuthMiddleware, h.consumerAddPayment)
	auth.POST("/registration/investor", h.AuthMiddleware, h.investorRegistration)
	auth.POST("/registration/investor/addPayment", h.AuthMiddleware, h.investorAddPayment)
	auth.POST("/login", h.login)
	auth.POST("/login/phone", h.LoginMiddleware, h.loginPhone)
	auth.POST("/login/email", h.LoginMiddleware, h.loginEmail)
	auth.POST("/login/confirm/phone", h.LoginMiddleware, h.loginConfirmPhone)
	auth.POST("/login/confirm/email", h.LoginMiddleware, h.loginConfirmEmail)
	auth.POST("/login/confirm/otp", h.LoginMiddleware, h.loginConfirmOTP)
	auth.POST("/reset", h.checkEmailForReset)
	auth.POST("/reset/confirm", h.confirmReset)
	auth.POST("/reset/change", h.changePassword)
	auth.GET("/me", h.AuthMiddleware, h.getCurrentUser)

	admin := gr.Group("/admin")
	// endpoints for admin auth
	admin.POST("/registration", h.adminRegistration)
	admin.POST("/login", h.login)

	// endpoints for admin to manage users, we need to check admin auth
	adminActions := admin.Group("/actions")
	// AuthMiddleware sets email variable in context
	adminActions.Use(h.AuthMiddleware)
	// AdminAuthMiddleware checks if user is admin (we check if email value set in context by AuthMiddleware is also located in admins table)
	adminActions.Use(h.AdminAuthMiddleware)

	adminActions.GET("/users", h.getAllUsers)
	adminActions.POST("/users/investors/:id/approve", h.approveInvestor)
	adminActions.POST("/users/consumers/:id/approve", h.approveConsumer)

	adminActions.POST("/users/investors/:id/decline", h.declineUser)
	adminActions.POST("/users/consumers/:id/decline", h.declineUser)

	investor := gr.Group("/investors", h.AuthMiddleware)

	investor.GET("/balance", h.VerifyInvestorExistsMiddleware, h.getBalanceHistoryInvestor)
	investor.GET("/payouts", h.VerifyInvestorExistsMiddleware, h.getPotentialPayouts)

	consumer := gr.Group("/consumers", h.AuthMiddleware)

	consumer.GET("/balance", h.VerifyConsumerExistsMiddleware, h.getBalanceHistoryConsumer)
	consumer.GET("/payments", h.VerifyConsumerExistsMiddleware, h.getRequiredPayments)

	loan := gr.Group("/loans", h.AuthMiddleware)

	loan.POST("", h.VerifyConsumerExistsMiddleware, h.createLoan)
	loan.GET("", h.getLoans)
	loan.GET("/:id", h.CheckAccessLoanMiddleware, h.getLoanByID)
	loan.GET("/:id/transactions", h.CheckAccessLoanMiddleware, h.getLoanTransactions)
	loan.POST("/:id/accept", h.VerifyInvestorExistsMiddleware, h.acceptLoan)
	loan.POST("/:id/repay", h.VerifyConsumerExistsMiddleware, h.repayLoan)
	loan.POST("/:id/counteroffers", h.VerifyInvestorExistsMiddleware, h.loanCounteroffer)
	loan.GET("/:id/counteroffers", h.getLoanCounteroffers)
	loan.POST("/counteroffers/:id/accept", h.VerifyConsumerExistsMiddleware, h.loanCounterofferAccept)
	loan.POST("/counteroffers/:id/reject", h.VerifyConsumerExistsMiddleware, h.loanCounterofferReject)
	loan.PUT("/:id", h.CheckAccessLoanMiddleware, h.updateLoan)
	loan.DELETE("/:id", h.CheckAccessLoanMiddleware, h.deleteLoan)

	userProfile := gr.Group("/profile")
	// endpoints for user profile
	userProfile.GET("/:type/:id")
	userProfile.PUT("/:type/:id", h.CheckAccessProfileMiddleware)

	return router.Run(port)
}
