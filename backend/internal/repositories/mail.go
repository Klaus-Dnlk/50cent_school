package repositories

import (
	"fmt"

	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)

type MailRepository struct {
	mailclnt *sendgrid.Client
}

func NewMailRepository(mailclnt *sendgrid.Client) *MailRepository {
	return &MailRepository{mailclnt: mailclnt}
}

func (r *MailRepository) Send(email string, msg string) error {
	from := mail.NewEmail("50Cent/ project", "tony.starikov.1992@gmail.com")
	subject := "Important mail from 50Cent/ project"
	name := "Client"
	to := mail.NewEmail(name, email)
	htmlContent := fmt.Sprintf("<strong>%s</strong>", msg)
	message := mail.NewSingleEmail(from, subject, to, msg, htmlContent)

	_, err := r.mailclnt.Send(message)

	return err
}
