package repositories

import (
	"50Cent/backend/config"
	"errors"

	"github.com/stripe/stripe-go/v72/paymentintent"

	"github.com/stripe/stripe-go/v72"
	"github.com/stripe/stripe-go/v72/account"
	"github.com/stripe/stripe-go/v72/accountlink"
	"github.com/stripe/stripe-go/v72/checkout/session"
	"github.com/stripe/stripe-go/v72/price"
)

type Action int

const (
	Lend Action = iota
	Return
)

type PaymentRepository struct {
	cfg *config.Config
}

func NewPaymentRepository(cfg *config.Config) *PaymentRepository {
	return &PaymentRepository{
		cfg: cfg,
	}
}

func (r *PaymentRepository) CreateAccount() (url string, id string, err error) {
	stripe.Key = r.cfg.Stripe.Key

	params := &stripe.AccountParams{
		Type:    stripe.String(string(stripe.AccountTypeExpress)),
		Country: stripe.String("US"),
		Capabilities: &stripe.AccountCapabilitiesParams{
			CardPayments: &stripe.AccountCapabilitiesCardPaymentsParams{
				Requested: stripe.Bool(true),
			},
			Transfers: &stripe.AccountCapabilitiesTransfersParams{
				Requested: stripe.Bool(true),
			},
		},
	}

	result, err := account.New(params)
	if err != nil {
		return "", "", errors.New("unable to create stripe account")
	}

	linkParams := &stripe.AccountLinkParams{
		Account:    stripe.String(result.ID),
		RefreshURL: stripe.String(r.cfg.Stripe.RefreshURL),
		ReturnURL:  stripe.String(r.cfg.Stripe.ReturnURL),
		Type:       stripe.String("account_onboarding"),
	}

	res, err := accountlink.New(linkParams)
	if err != nil {
		return "", "", errors.New("unable to create account link")
	}

	return res.URL, result.ID, nil
}

func (r *PaymentRepository) CreatePrice(amount int64, action Action) (string, error) {
	stripe.Key = r.cfg.Stripe.Key

	var productID string
	if action == Lend {
		productID = r.cfg.Stripe.LoanID
	} else if action == Return {
		productID = r.cfg.Stripe.RepayLoanID
	}

	priceParams := &stripe.PriceParams{
		Currency:   stripe.String(string(stripe.CurrencyUSD)),
		Product:    stripe.String(productID),
		UnitAmount: stripe.Int64(amount),
	}

	p, err := price.New(priceParams)
	if err != nil {
		return "", err
	}

	return p.ID, nil
}

func (r *PaymentRepository) CreatePayment(priceID, accountID string, appFee int64) (url string, id string, err error) {
	stripe.Key = r.cfg.Stripe.Key

	params := &stripe.CheckoutSessionParams{
		LineItems: []*stripe.CheckoutSessionLineItemParams{
			{
				Price:    stripe.String(priceID),
				Quantity: stripe.Int64(1),
			},
		},
		Mode:       stripe.String(string(stripe.CheckoutSessionModePayment)),
		SuccessURL: stripe.String(r.cfg.Stripe.PaymentSuccessURL),
		CancelURL:  stripe.String(r.cfg.Stripe.PaymentCancelURL),
		PaymentIntentData: &stripe.CheckoutSessionPaymentIntentDataParams{
			ApplicationFeeAmount: stripe.Int64(appFee),
			OnBehalfOf:           stripe.String(accountID),
			TransferData: &stripe.CheckoutSessionPaymentIntentDataTransferDataParams{
				Destination: stripe.String(accountID),
			},
		},
	}

	s, err := session.New(params)
	if err != nil {
		return "", "", err
	}

	return s.URL, s.ID, nil
}

func (r *PaymentRepository) GetPaymentIntentStatusByID(id string) (string, error) {
	stripe.Key = r.cfg.Stripe.Key

	pi, err := paymentintent.Get(id, nil)
	if err != nil {
		return "", err
	}

	return string(pi.Status), nil
}
