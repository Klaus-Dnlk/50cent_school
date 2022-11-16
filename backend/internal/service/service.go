package service

import (
	"context"

	"50Cent/backend/config"
	"50Cent/backend/internal/command"
	"50Cent/backend/internal/domain"
	"50Cent/backend/internal/models"
	"50Cent/backend/internal/repositories"
)

//go:generate mockgen -source=service.go -destination=mocks/mock.go

type Auth interface {
	Registration(ctx context.Context, user *domain.User) (uint, error)
	Confirm(ctx context.Context, email string, code string) error
	GenerateToken(email string, userID uint, isTemporary bool) (string, error)
	ParseToken(token string) (string, uint, bool, error)
	Login(ctx context.Context, email string, password string) (string, []string, error)
	ExternalLogin(ctx context.Context, email string) (string, []string, error)
	LoginPhone(ctx context.Context, email string) error
	LoginEmail(ctx context.Context, email string) error
	LoginConfirmPhone(ctx context.Context, email string, code string) (string, error)
	LoginConfirmEmail(ctx context.Context, email string, code string) (string, error)
	LoginConfirmOTP(ctx context.Context, email string, userID uint, code string) (string, error)
	UpdatePassword(ctx context.Context, email, password string) error
	GetUserByID(ctx context.Context, userID uint) (*domain.User, error)
	GetUserByEmail(ctx context.Context, email string) (*domain.User, error)
	RegisterOTP(ctx context.Context, userID uint) ([]byte, error)
	ConfirmOTP(ctx context.Context, email string, code string) error
	SetConfirmationCode(ctx context.Context, email string, method SendingMethod) error
	GetUserFromGoogleToken(ctx context.Context, idToken string, clientID string) (email string)
	GetUserInfoFromFacebook(token string) (command.FacebookUserDetails, error)

	// admin functionality
	AdminRegistration(ctx context.Context, admin *domain.Admin) error
	GetAdminByID(ctx context.Context, userID uint) (*models.Admin, error)
}

type Upload interface {
	Create(ctx context.Context, files command.MultipartFiles, fileType models.FileType) error
	GetUserFilesLinks(ctx context.Context, userID uint) (map[models.FileType]string, error)
}

type Loan interface {
	Create(ctx context.Context, loan *domain.Loan) error
	Accept(ctx context.Context, loanID uint64, investorID uint) (string, error)
	Repay(ctx context.Context, loanID uint64, consumerID uint) (string, error)
	Delete(ctx context.Context, id uint64) error
	GetAll(ctx context.Context, page, pageSize int) (*domain.LoanResponse, error)
	GetByID(ctx context.Context, id uint64) (*domain.Loan, error)
	Update(ctx context.Context, id uint64, loan *domain.Loan) error
	PaymentSuccess(ctx context.Context, sessionID string) error
	PaymentFailed(ctx context.Context, sessionID string) error
	CheckoutSessionCompleted(ctx context.Context, sessionID string, paymentID string) error
	GetTransactionsByLoanID(ctx context.Context, id uint) ([]domain.Transaction, error)
	Counteroffer(ctx context.Context, loan *domain.LoanCounteroffer) error
	CounterofferAccept(ctx context.Context, consumerID, offerID uint) error
	CounterofferReject(ctx context.Context, offerID, consumerID uint) error
	GetAllCounteroffers(ctx context.Context, loanID uint) ([]domain.LoanCounteroffer, error)
}

type Consumer interface {
	ConsumerRegistration(ctx context.Context, consumer *domain.Consumer) error
	GetConsumerByUserID(ctx context.Context, userID uint64) (*models.Consumer, error)
	GetConsumerByID(ctx context.Context, id uint64) (*models.Consumer, error)
	AddPayment(ctx context.Context, userID uint64) (string, error)
	AddPaymentConfirm(ctx context.Context, accountID string, detailsSubmitted bool) error
	ApproveConsumerByID(ctx context.Context, ID uint) error
	GetAllUnverifiedConsumers(ctx context.Context) ([]models.Consumer, error)
	GetRequiredPayments(ctx context.Context, id uint) ([]domain.Payout, error)
	GetBalanceHistory(ctx context.Context, id uint) ([]domain.Balance, error)
}

type Investor interface {
	InvestorRegistration(ctx context.Context, investor *domain.Investor) error
	GetInvestorByUserID(ctx context.Context, userID uint64) (*models.Investor, error)
	GetInvestorByID(ctx context.Context, id uint64) (*models.Investor, error)
	AddPayment(ctx context.Context, userID uint64) (string, error)
	AddPaymentConfirm(ctx context.Context, accountID string, detailsSubmitted bool) error
	ApproveInvestorByID(ctx context.Context, ID uint) error
	GetAllUnverifiedInvestors(ctx context.Context) ([]models.Investor, error)
	GetPotentialPayouts(ctx context.Context, id uint) ([]domain.Payout, error)
	GetBalanceHistory(ctx context.Context, id uint) ([]domain.Balance, error)
}

type Admin interface {
	GetALlUnverifiedUsers(ctx context.Context) ([]models.UserToVerifyOnAdminPage, error)
}

type Service struct {
	Auth
	Loan
	Upload
	Consumer
	Investor
	Admin
}

func NewService(repository *repositories.Repository, cfg *config.Config) *Service {
	return &Service{
		Auth:     NewAuthService(repository.Auth, repository.Upload, repository.Twilio, repository.Mail, repository.ConfirmationCode, cfg),
		Consumer: NewConsumerService(repository.Consumer, repository.Upload, repository.Auth, repository.Payment, repository.Balance, repository.Payout, repository.Loan, cfg),
		Investor: NewInvestorService(repository.Investor, repository.Upload, repository.Auth, repository.Payment, repository.Balance, repository.Payout, repository.Loan, cfg),
		Upload:   NewUploadService(repository.Upload),
		Loan:     NewLoanService(repository.Loan, repository.Payment, repository.Consumer, repository.Investor, repository.CheckoutSession, repository.Transaction, repository.LoanCounteroffer, repository.Balance),
		Admin:    NewAdminService(repository.Investor, repository.Consumer, repository.Upload, repository.Auth, cfg),
	}
}
