package service

import (
	"50Cent/backend/internal/constants"
	"50Cent/backend/internal/helper"
	"context"
	"errors"
	"time"

	"50Cent/backend/internal/domain"
	"50Cent/backend/internal/models"
	"50Cent/backend/internal/repositories"
)

type LoanService struct {
	loanRepo             repositories.Loan
	paymentRepo          repositories.Payment
	consumerRepo         repositories.Consumer
	investorRepo         repositories.Investor
	checkoutSessionRepo  repositories.CheckoutSession
	transactionRepo      repositories.Transaction
	loanCounterofferRepo repositories.LoanCounteroffer
	balanceRepo          repositories.Balance
}

func NewLoanService(
	loanRepo repositories.Loan,
	paymentRepo repositories.Payment,
	consumerRepo repositories.Consumer,
	investorRepo repositories.Investor,
	checkoutSessionRepo repositories.CheckoutSession,
	transactionRepo repositories.Transaction,
	loanCounterofferRepo repositories.LoanCounteroffer,
	balanceRepo repositories.Balance) *LoanService {
	return &LoanService{
		loanRepo:             loanRepo,
		paymentRepo:          paymentRepo,
		consumerRepo:         consumerRepo,
		investorRepo:         investorRepo,
		checkoutSessionRepo:  checkoutSessionRepo,
		transactionRepo:      transactionRepo,
		loanCounterofferRepo: loanCounterofferRepo,
		balanceRepo:          balanceRepo,
	}
}

func (s *LoanService) Create(ctx context.Context, loan *domain.Loan) error {
	totalPrice := helper.CalculatePriceWithFee(loan.CreditSum, helper.CalculateAppFee(loan.CreditSum))

	model := models.Loan{
		CreditSum:         totalPrice,
		CreditTitle:       loan.CreditTitle,
		CreditDescription: loan.CreditTitle,
		CreditTerm:        loan.CreditTerm,
		CreditRate:        loan.CreditRate,
		ConsumerID:        loan.ConsumerID,
	}

	return s.loanRepo.Create(ctx, &model)
}

func (s *LoanService) Counteroffer(ctx context.Context, loan *domain.LoanCounteroffer) error {
	model := models.LoanCounteroffer{
		CreditTerm: loan.CreditTerm,
		CreditRate: loan.CreditRate,
		LoanID:     loan.LoanID,
	}

	return s.loanCounterofferRepo.Create(ctx, &model)
}

func (s *LoanService) CounterofferAccept(ctx context.Context, consumerID, offerID uint) error {
	offer, err := s.loanCounterofferRepo.GetByID(ctx, offerID)
	if err != nil {
		return err
	}

	loan, err := s.loanRepo.GetByID(ctx, uint64(offer.LoanID))
	if err != nil {
		return err
	}

	if loan.ConsumerID != consumerID {
		return errors.New("you don't have access to this loan")
	}

	loan.CreditTerm = offer.CreditTerm
	loan.CreditRate = offer.CreditRate

	if err := s.loanRepo.Update(ctx, loan); err != nil {
		return err
	}

	if err := s.loanCounterofferRepo.DeleteByID(ctx, offerID); err != nil {
		return err
	}

	return nil
}

func (s *LoanService) CounterofferReject(ctx context.Context, offerID, consumerID uint) error {
	offer, err := s.loanCounterofferRepo.GetByID(ctx, offerID)
	if err != nil {
		return err
	}

	loan, err := s.loanRepo.GetByID(ctx, uint64(offer.LoanID))
	if err != nil {
		return err
	}

	if loan.ConsumerID != consumerID {
		return errors.New("you don't have access to this loan")
	}

	if err := s.loanCounterofferRepo.DeleteByID(ctx, offerID); err != nil {
		return err
	}

	return nil
}

func (s *LoanService) GetAllCounteroffers(ctx context.Context, loanID uint) ([]domain.LoanCounteroffer, error) {
	offers, err := s.loanCounterofferRepo.GetAllByLoanID(ctx, loanID)
	if err != nil {
		return nil, err
	}

	offersDomain := make([]domain.LoanCounteroffer, 0, len(offers))

	for _, model := range offers {
		offer := domain.LoanCounteroffer{
			CreditTerm: model.CreditTerm,
			CreditRate: model.CreditRate,
			LoanID:     model.LoanID,
		}
		offersDomain = append(offersDomain, offer)
	}

	return offersDomain, nil
}

func (s *LoanService) Accept(ctx context.Context, loanID uint64, investorID uint) (string, error) {
	loan, err := s.loanRepo.GetByID(ctx, loanID)
	if err != nil {
		return "", err
	}

	if loan.IsAccepted {
		return "", errors.New("this loan has already been accepted")
	}

	exists, err := s.checkoutSessionRepo.CountByLoanID(ctx, uint(loanID), investorID)
	if err != nil {
		return "", err
	}

	if exists {
		return "", errors.New("this loan is being processed")
	}

	consumer, err := s.consumerRepo.GetConsumerByID(ctx, uint64(loan.ConsumerID))
	if err != nil {
		return "", err
	}

	id, err := s.paymentRepo.CreatePrice(int64(loan.CreditSum), repositories.Lend)
	if err != nil {
		return "", err
	}

	appFee := helper.CalculateAppFee(loan.CreditSum)

	url, sessionID, err := s.paymentRepo.CreatePayment(id, consumer.StripeID, int64(appFee))
	if err != nil {
		return "", err
	}

	checkoutSession := models.CheckoutSession{
		SessionID:    sessionID,
		LoanID:       uint(loanID),
		IsAcceptance: true,
		UserID:       investorID,
		Amount:       loan.CreditSum,
	}

	if err := s.checkoutSessionRepo.Create(ctx, &checkoutSession); err != nil {
		return "", err
	}

	loan.InvestorID = &investorID
	if err := s.loanRepo.Update(ctx, loan); err != nil {
		return "", err
	}

	if err := s.loanCounterofferRepo.DeleteByLoanID(ctx, loan.ID); err != nil {
		return "", err
	}

	return url, nil
}

func (s *LoanService) PaymentSuccess(ctx context.Context, sessionID string) error {
	checkoutSession, err := s.checkoutSessionRepo.GetBySessionID(ctx, sessionID)
	if err != nil {
		return err
	}

	loan, err := s.loanRepo.GetByID(ctx, uint64(checkoutSession.LoanID))
	if err != nil {
		return err
	}

	var transaction models.Transaction
	transaction.LoanID = loan.ID
	transaction.Time = time.Now()
	transaction.Amount = checkoutSession.Amount

	if checkoutSession.IsAcceptance {
		loan.IsAccepted = true
		loan.AcceptedAt = time.Now()
		transaction.IsInvestment = true
	} else {
		loan.ReturnedAmount++
		if loan.ReturnedAmount == loan.CreditTerm {
			loan.IsReturned = true
		}
		transaction.IsInvestment = false
	}

	if err := s.loanRepo.Update(ctx, loan); err != nil {
		return err
	}

	if err := s.transactionRepo.Create(ctx, &transaction); err != nil {
		return err
	}

	if err := s.checkoutSessionRepo.DeleteByLoanID(ctx, loan.ID); err != nil {
		return err
	}

	if err := s.updateBalance(ctx, loan.ConsumerID, *loan.InvestorID, transaction.Amount, checkoutSession.IsAcceptance); err != nil {
		return err
	}

	return nil
}

func (s *LoanService) updateBalance(ctx context.Context, consumerID, investorID uint, amount float64, isInvestment bool) error {
	consumer, err := s.consumerRepo.GetConsumerByID(ctx, uint64(consumerID))
	if err != nil {
		return err
	}

	investor, err := s.investorRepo.GetInvestorByID(ctx, uint64(investorID))
	if err != nil {
		return err
	}

	consumerBalance := models.Balance{
		Value:    consumer.Balance,
		Time:     time.Now(),
		UserType: 1,
		UserID:   consumerID,
	}

	investorBalance := models.Balance{
		Value:    investor.Balance,
		Time:     time.Now(),
		UserType: 2,
		UserID:   investorID,
	}

	if err := s.balanceRepo.Create(ctx, &consumerBalance); err != nil {
		return err
	}

	if err := s.balanceRepo.Create(ctx, &investorBalance); err != nil {
		return err
	}

	if isInvestment {
		consumer.Balance += amount
		investor.Balance -= amount
	} else {
		consumer.Balance -= amount
		investor.Balance += amount
	}

	if err := s.consumerRepo.Save(ctx, consumer); err != nil {
		return err
	}

	if err := s.investorRepo.Save(ctx, investor); err != nil {
		return err
	}

	return nil
}

func (s *LoanService) PaymentFailed(ctx context.Context, sessionID string) error {
	checkoutSession, err := s.checkoutSessionRepo.GetBySessionID(ctx, sessionID)
	if err != nil {
		return err
	}

	loan, err := s.loanRepo.GetByID(ctx, uint64(checkoutSession.LoanID))
	if err != nil {
		return err
	}

	if checkoutSession.IsAcceptance {
		loan.InvestorID = nil
	}

	if err := s.loanRepo.Update(ctx, loan); err != nil {
		return err
	}

	if err := s.checkoutSessionRepo.DeleteByLoanID(ctx, loan.ID); err != nil {
		return err
	}

	return nil
}

func (s *LoanService) CheckoutSessionCompleted(ctx context.Context, sessionID string, paymentID string) error {
	piStatus, err := s.paymentRepo.GetPaymentIntentStatusByID(paymentID)
	if err != nil {
		return err
	}

	switch piStatus {
	case constants.PaymentIntentProcessing:
		return nil
	case constants.PaymentIntentCanceled:
		return s.PaymentFailed(ctx, sessionID)
	case constants.PaymentIntentRequiresPaymentMethod:
		return s.PaymentFailed(ctx, sessionID)
	case constants.PaymentIntentSucceeded:
		return s.PaymentSuccess(ctx, sessionID)
	}

	return nil
}

func (s *LoanService) Repay(ctx context.Context, loanID uint64, consumerID uint) (string, error) {
	loan, err := s.loanRepo.GetByID(ctx, loanID)
	if err != nil {
		return "", err
	}

	if loan.ConsumerID != consumerID {
		return "", errors.New("it's not your loan")
	}

	if !loan.IsAccepted {
		return "", errors.New("this loan doesn't have an investor")
	}

	if loan.IsReturned {
		return "", errors.New("this loan has already been returned")
	}

	exists, err := s.checkoutSessionRepo.CountByLoanID(ctx, uint(loanID), consumerID)
	if err != nil {
		return "", err
	}

	if exists {
		return "", errors.New("this loan is being processed by another session")
	}

	investor, err := s.investorRepo.GetInvestorByID(ctx, uint64(*loan.InvestorID))
	if err != nil {
		return "", err
	}

	fullCreditFee := loan.CreditSum * (1.0 + loan.CreditRate/100.0*float64(loan.CreditTerm)/12)
	totalFee, appFee := helper.CalculateOneTimePayment(fullCreditFee, loan.CreditTerm)

	id, err := s.paymentRepo.CreatePrice(int64(totalFee), repositories.Return)
	if err != nil {
		return "", err
	}

	url, sessionID, err := s.paymentRepo.CreatePayment(id, investor.StripeID, int64(appFee))
	if err != nil {
		return "", err
	}

	checkoutSession := models.CheckoutSession{
		SessionID:    sessionID,
		LoanID:       loan.ID,
		IsAcceptance: false,
		UserID:       consumerID,
		Amount:       fullCreditFee / float64(loan.CreditTerm),
	}

	if err := s.checkoutSessionRepo.Create(ctx, &checkoutSession); err != nil {
		return "", err
	}

	return url, nil
}

func (s *LoanService) GetAll(ctx context.Context, page, pageSize int) (*domain.LoanResponse, error) {
	if page == 0 {
		page = 1
	}

	switch {
	case pageSize > 100:
		pageSize = 100
	case pageSize <= 0:
		pageSize = 5
	}

	allModels, totalPages, err := s.loanRepo.GetAll(ctx, page, pageSize)
	if err != nil {
		return nil, err
	}

	loans := make([]domain.Loan, len(*allModels))

	for i, modelItem := range *allModels {
		currentModel := modelItem
		loans[i] = *convertLoan(&currentModel)
	}

	loanResponse := domain.LoanResponse{TotalPages: totalPages, Data: loans}

	return &loanResponse, nil
}

func (s *LoanService) GetByID(ctx context.Context, id uint64) (*domain.Loan, error) {
	model, err := s.loanRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	return convertLoan(model), err
}

func (s *LoanService) GetTransactionsByLoanID(ctx context.Context, id uint) ([]domain.Transaction, error) {
	transactionModels, err := s.transactionRepo.GetByLoanID(ctx, id)
	if err != nil {
		return nil, err
	}

	transactions := make([]domain.Transaction, 0, len(transactionModels))

	for _, model := range transactionModels {
		transaction := domain.Transaction{
			ID:           model.ID,
			Amount:       model.Amount,
			IsInvestment: model.IsInvestment,
			Time:         model.Time,
			LoanID:       model.LoanID,
		}
		transactions = append(transactions, transaction)
	}

	return transactions, nil
}

func (s *LoanService) Update(ctx context.Context, id uint64, loan *domain.Loan) error {
	model, err := s.loanRepo.GetByID(ctx, id)
	if err != nil {
		return nil
	}

	model.CreditSum = loan.CreditSum
	model.CreditTitle = loan.CreditTitle
	model.CreditDescription = loan.CreditDescription
	model.CreditTerm = loan.CreditTerm
	model.CreditRate = loan.CreditRate

	return s.loanRepo.Update(ctx, model)
}

func (s *LoanService) Delete(ctx context.Context, id uint64) error {
	return s.loanRepo.Delete(ctx, id)
}

func convertLoan(model *models.Loan) *domain.Loan {
	var investorID uint
	if model.InvestorID == nil {
		investorID = 0
	} else {
		investorID = *model.InvestorID
	}

	return &domain.Loan{
		ID:                model.ID,
		CreditSum:         model.CreditSum,
		CreditTitle:       model.CreditTitle,
		CreditDescription: model.CreditDescription,
		CreditTerm:        model.CreditTerm,
		CreditRate:        model.CreditRate,
		ReturnedAmount:    model.ReturnedAmount,
		IsReturned:        model.IsReturned,
		IsAccepted:        model.IsAccepted,
		AcceptedAt:        model.AcceptedAt,
		ConsumerID:        model.ConsumerID,
		InvestorID:        investorID,
	}
}
