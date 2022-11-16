package email

import (
	"50Cent/backend/config"

	"github.com/sendgrid/sendgrid-go"
)

func NewSendgridClient(cfg *config.Config) *sendgrid.Client {
	client := sendgrid.NewSendClient(cfg.SendGrid.Key)
	return client
}
