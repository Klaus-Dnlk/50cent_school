package repositories

import (
	"fmt"

	"github.com/twilio/twilio-go"
	openapi "github.com/twilio/twilio-go/rest/api/v2010"

	"50Cent/backend/config"
)

type TwilioRepository struct {
	client *twilio.RestClient
	from   string
}

func NewTwilioRepository(cfg *config.Config) *TwilioRepository {
	client := twilio.NewRestClientWithParams(twilio.ClientParams{
		Username: cfg.Twilio.AccountSid,
		Password: cfg.Twilio.AuthToken,
	})

	return &TwilioRepository{
		client: client,
		from:   cfg.Twilio.From,
	}
}

func (r *TwilioRepository) SendMessage(to, code string) (string, error) {
	params := &openapi.CreateMessageParams{}
	params.SetTo(to)
	params.SetFrom(r.from)
	params.SetBody(fmt.Sprintf("50Cent/.com | Your authorization code: %s", code))

	resp, err := r.client.Api.CreateMessage(params)
	if err != nil {
		return "", err
	}

	return *resp.Status, nil
}
