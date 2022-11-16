package service

import (
	"50Cent/backend/config"
	"50Cent/backend/internal/domain"
	"50Cent/backend/internal/models"
	"50Cent/backend/internal/repositories"
	"context"
	"errors"
	"mime/multipart"
	"time"
)

type ConsumerService struct {
	consumerRepo repositories.Consumer
	authRepo     repositories.Auth
	uploadRepo   repositories.Upload
	paymentRepo  repositories.Payment
	balanceRepo  repositories.Balance
	payoutRepo   repositories.Payout
	loanRepo     repositories.Loan
	cfg          *config.Config
}

func NewConsumerService(
	consumerRepo repositories.Consumer,
	uploadRepo repositories.Upload,
	authRepo repositories.Auth,
	paymentRepo repositories.Payment,
	balanceRepo repositories.Balance,
	payoutRepo repositories.Payout,
	loanRepo repositories.Loan,
	cfg *config.Config) *ConsumerService {
	return &ConsumerService{
		consumerRepo: consumerRepo,
		authRepo:     authRepo,
		uploadRepo:   uploadRepo,
		paymentRepo:  paymentRepo,
		balanceRepo:  balanceRepo,
		payoutRepo:   payoutRepo,
		loanRepo:     loanRepo,
		cfg:          cfg,
	}
}

func (s *ConsumerService) ConsumerRegistration(ctx context.Context, consumer *domain.Consumer) error {
	user, err := s.authRepo.GetUserByEmail(ctx, consumer.UserEmail)
	if err != nil {
		return err
	}

	consumer.UserID = user.ID

	err = s.consumerRepo.CreateConsumer(ctx, domainConsumerToDB(consumer))
	if err != nil {
		return err
	}

	modelConsumer, err := s.consumerRepo.GetConsumerByUserID(ctx, uint64(user.ID))
	if err != nil {
		return err
	}

	if err := s.AddFileToConsumer(ctx, modelConsumer, &consumer.Photo, models.Photo); err != nil {
		return err
	}

	if err := s.AddFileToConsumer(ctx, modelConsumer, &consumer.WorkFile, models.WorkFIle); err != nil {
		return err
	}

	if err := s.AddFileToConsumer(ctx, modelConsumer, &consumer.IDFile, models.IDFile); err != nil {
		return err
	}

	if err := s.AddFileToConsumer(ctx, modelConsumer, &consumer.PropertyFile, models.PropertyFile); err != nil {
		return err
	}

	return nil
}

func domainConsumerToDB(consumer *domain.Consumer) *models.Consumer {
	return &models.Consumer{
		Name:       consumer.Name,
		Surname:    consumer.Surname,
		MiddleName: consumer.MiddleName,
		UserEmail:  consumer.UserEmail,
		UserID:     consumer.UserID,
	}
}

func (s *ConsumerService) AddFileToConsumer(ctx context.Context, consumer *models.Consumer, file *multipart.FileHeader, fileType models.FileType) error {
	if file.Size == 0 {
		return nil
	}

	modelFile, err := s.uploadRepo.CreateOne(ctx, file, fileType, consumer.UserID)
	if err != nil {
		return err
	}

	if err := s.uploadRepo.AddFileToConsumer(ctx, modelFile); err != nil {
		return err
	}

	return nil
}

func (s *ConsumerService) GetConsumerByUserID(ctx context.Context, userID uint64) (*models.Consumer, error) {
	consumer, err := s.consumerRepo.GetConsumerByUserID(ctx, userID)

	if err != nil {
		return nil, err
	}

	return consumer, nil
}

func (s *ConsumerService) GetConsumerByID(ctx context.Context, id uint64) (*models.Consumer, error) {
	consumer, err := s.consumerRepo.GetConsumerByID(ctx, id)

	if err != nil {
		return nil, err
	}

	return consumer, nil
}

func (s *ConsumerService) ApproveConsumerByID(ctx context.Context, id uint) error {
	consumer, err := s.consumerRepo.GetConsumerByUserID(ctx, uint64(id))
	if err != nil {
		return err
	}

	consumer.IsVerified = true

	err = s.consumerRepo.UpdateConsumer(ctx, consumer)
	if err != nil {
		return err
	}

	return nil
}

func (s *ConsumerService) GetAllUnverifiedConsumers(ctx context.Context) ([]models.Consumer, error) {
	return s.consumerRepo.GetAllUnverifiedConsumers(ctx)
}

func (s *ConsumerService) AddPayment(ctx context.Context, userID uint64) (string, error) {
	consumer, err := s.GetConsumerByUserID(ctx, userID)
	if err != nil {
		return "", err
	}

	url, id, err := s.paymentRepo.CreateAccount()
	if err != nil {
		return "", err
	}

	consumer.StripeID = id
	if err := s.consumerRepo.Save(ctx, consumer); err != nil {
		return "", err
	}

	return url, nil
}

func (s *ConsumerService) AddPaymentConfirm(ctx context.Context, accountID string, detailsSubmitted bool) error {
	if !detailsSubmitted {
		return nil
	}

	exists, err := s.consumerRepo.CheckIfExists(ctx, accountID)
	if err != nil {
		return err
	}

	if !exists {
		return errors.New("consumer doesn't exist")
	}

	consumer, err := s.consumerRepo.GetConsumerByStripeID(ctx, accountID)
	if err != nil {
		return err
	}

	consumer.StripeConfirmed = true
	if err := s.consumerRepo.Save(ctx, consumer); err != nil {
		return err
	}

	return nil
}

func (s *ConsumerService) GetBalanceHistory(ctx context.Context, id uint) ([]domain.Balance, error) {
	balanceSlice, err := s.balanceRepo.GetAllByConsumerID(ctx, id)
	if err != nil {
		return nil, err
	}

	balances := make([]domain.Balance, 0, len(balanceSlice))

	for _, model := range balanceSlice {
		balance := domain.Balance{
			ID:    model.ID,
			Value: model.Value,
			Time:  model.Time,
		}

		balances = append(balances, balance)
	}

	return balances, nil
}

func (s *ConsumerService) GetRequiredPayments(ctx context.Context, id uint) ([]domain.Payout, error) {
	payoutModels, err := s.payoutRepo.GetByConsumerID(ctx, id)
	if err != nil {
		return nil, err
	}

	payouts := make([]domain.Payout, 0, len(payoutModels))

	for _, model := range payoutModels {
		payout := domain.Payout{
			ID:     model.ID,
			Amount: model.Amount,
			Time:   model.CreatedAt,
		}
		payouts = append(payouts, payout)
	}

	if payoutModels[len(payoutModels)-1].CreatedAt.Month() != time.Now().Month() {
		payment, err := s.addRequiredPayment(ctx, id)
		if err != nil {
			return nil, err
		}

		payouts = append(payouts, *payment)
	}

	return payouts, nil
}

func (s *ConsumerService) addRequiredPayment(ctx context.Context, id uint) (*domain.Payout, error) {
	loans, err := s.loanRepo.GetAllByConsumerID(ctx, id)
	if err != nil {
		return nil, err
	}

	var amount float64

	for _, loan := range loans {
		now := time.Now()
		if (loan.AcceptedAt.Year()-now.Year())*12+int(now.Month()-loan.AcceptedAt.Month())-int(loan.ReturnedAmount) > 0 {
			amount += loan.CreditSum / float64(loan.CreditTerm)
		}
	}

	payment := models.Payout{
		Amount:     amount,
		IsConsumer: true,
		UserID:     id,
	}

	err = s.payoutRepo.Create(ctx, &payment)
	if err != nil {
		return nil, err
	}

	payoutModel, err := s.payoutRepo.GetLastByConsumerID(ctx, id)
	if err != nil {
		return nil, err
	}

	payout := domain.Payout{
		ID:     payoutModel.ID,
		Amount: payoutModel.Amount,
		Time:   payoutModel.CreatedAt,
	}

	return &payout, nil
}
