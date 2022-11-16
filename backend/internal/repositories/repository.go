package repositories

import (
	"context"
	"mime/multipart"

	"50Cent/backend/internal/command"

	"50Cent/backend/config"
	"50Cent/backend/internal/models"

	"github.com/sendgrid/sendgrid-go"
	"gorm.io/gorm"
)

type Auth interface {
	Create(ctx context.Context, user *models.User) (uint, error)
	GetUserByID(ctx context.Context, userID uint) (*models.User, error)
	GetUserByEmail(ctx context.Context, email string) (*models.User, error)
	Update(ctx context.Context, user *models.User) error

	// admin functionality
	CreateAdmin(ctx context.Context, admin *models.Admin) error
	GetAdminByID(ctx context.Context, userID uint) (*models.Admin, error)
}

type Upload interface {
	Create(ctx context.Context, files command.MultipartFiles, fileType models.FileType) error
	CreateOne(ctx context.Context, file *multipart.FileHeader, fileType models.FileType, userID uint) (*models.UserFile, error)
	AddFileToConsumer(ctx context.Context, file *models.UserFile) error
	AddFileToInvestor(ctx context.Context, file *models.UserFile) error
	GetUserFilesLinks(ctx context.Context, userID uint) (map[models.FileType]string, error)
}

type Loan interface {
	Create(ctx context.Context, loan *models.Loan) error
	GetAll(ctx context.Context, page int, pageSize int) (*[]models.Loan, float64, error)
	GetAllByInvestorID(ctx context.Context, id uint) ([]models.Loan, error)
	GetAllByConsumerID(ctx context.Context, id uint) ([]models.Loan, error)
	Delete(ctx context.Context, id uint64) error
	Update(ctx context.Context, loan *models.Loan) error
	GetByID(ctx context.Context, id uint64) (*models.Loan, error)
}

type Consumer interface {
	CreateConsumer(ctx context.Context, consumer *models.Consumer) error
	CheckIfExists(ctx context.Context, accountID string) (bool, error)
	GetConsumerByUserID(ctx context.Context, userID uint64) (*models.Consumer, error)
	GetConsumerByID(ctx context.Context, id uint64) (*models.Consumer, error)
	GetConsumerByStripeID(ctx context.Context, stripeID string) (*models.Consumer, error)
	Save(ctx context.Context, consumer *models.Consumer) error
	UpdateConsumer(ctx context.Context, consumer *models.Consumer) error
	GetAllUnverifiedConsumers(ctx context.Context) ([]models.Consumer, error)
}

type Mail interface {
	Send(email string, msg string) error
}

type Twilio interface {
	SendMessage(to, code string) (string, error)
}

type Investor interface {
	CreateInvestor(ctx context.Context, investor *models.Investor) error
	CheckIfExists(ctx context.Context, accountID string) (bool, error)
	GetInvestorByUserID(ctx context.Context, userID uint64) (*models.Investor, error)
	GetInvestorByID(ctx context.Context, id uint64) (*models.Investor, error)
	GetInvestorByStripeID(ctx context.Context, accountID string) (*models.Investor, error)
	Save(ctx context.Context, investor *models.Investor) error
	UpdateInvestor(ctx context.Context, investor *models.Investor) error
	GetAllUnverifiedInvestors(ctx context.Context) ([]models.Investor, error)
}

type ConfirmationCode interface {
	Create(ctx context.Context, code *models.ConfirmationCode) error
	GetConfirmationCode(ctx context.Context, user *models.User) (*models.ConfirmationCode, error)
	DeleteConfirmationCode(ctx context.Context, user *models.User) error
}

type Payment interface {
	CreateAccount() (string, string, error)
	CreatePrice(amount int64, action Action) (string, error)
	CreatePayment(priceID, accountID string, appFee int64) (string, string, error)
	GetPaymentIntentStatusByID(id string) (string, error)
}

type CheckoutSession interface {
	Create(ctx context.Context, checkoutSession *models.CheckoutSession) error
	GetBySessionID(ctx context.Context, sessionID string) (*models.CheckoutSession, error)
	GetByLoanID(ctx context.Context, loanID uint) (*models.CheckoutSession, error)
	CountByLoanID(ctx context.Context, loanID, userID uint) (bool, error)
	DeleteByLoanID(ctx context.Context, loanID uint) error
}

type Transaction interface {
	Create(ctx context.Context, transaction *models.Transaction) error
	GetByLoanID(ctx context.Context, id uint) ([]models.Transaction, error)
}

type LoanCounteroffer interface {
	Create(ctx context.Context, counteroffer *models.LoanCounteroffer) error
	GetByID(ctx context.Context, id uint) (*models.LoanCounteroffer, error)
	GetAllByLoanID(ctx context.Context, id uint) ([]models.LoanCounteroffer, error)
	DeleteByID(ctx context.Context, id uint) error
	DeleteByLoanID(ctx context.Context, id uint) error
}

type Balance interface {
	Create(ctx context.Context, balance *models.Balance) error
	GetAllByInvestorID(ctx context.Context, id uint) ([]models.Balance, error)
	GetAllByConsumerID(ctx context.Context, id uint) ([]models.Balance, error)
}

type Payout interface {
	Create(ctx context.Context, payout *models.Payout) error
	GetByInvestorID(ctx context.Context, id uint) ([]models.Payout, error)
	GetByConsumerID(ctx context.Context, id uint) ([]models.Payout, error)
	GetLastByInvestorID(ctx context.Context, id uint) (*models.Payout, error)
	GetLastByConsumerID(ctx context.Context, id uint) (*models.Payout, error)
}

type Repository struct {
	Auth
	Loan
	Upload
	Consumer
	Mail
	Twilio
	Investor
	ConfirmationCode
	Payment
	CheckoutSession
	Transaction
	LoanCounteroffer
	Balance
	Payout
}

func NewRepository(db *gorm.DB, cfg *config.Config, mailclnt *sendgrid.Client) *Repository {
	return &Repository{
		Auth:             NewAuthRepository(db),
		Loan:             NewLoanRepository(db),
		Upload:           NewUploadRepository(db, cfg),
		Consumer:         NewConsumerRepository(db),
		Mail:             NewMailRepository(mailclnt),
		Twilio:           NewTwilioRepository(cfg),
		Investor:         NewInvestorRepository(db),
		ConfirmationCode: NewConfirmationCodeRepository(db),
		Payment:          NewPaymentRepository(cfg),
		CheckoutSession:  NewCheckoutSessionRepository(db),
		Transaction:      NewTransactionRepository(db),
		LoanCounteroffer: NewLoanCounterofferRepository(db),
		Balance:          NewBalanceRepository(db),
		Payout:           NewPayoutRepository(db),
	}
}
