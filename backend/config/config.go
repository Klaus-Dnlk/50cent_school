package config

import (
	"sync"

	"github.com/ilyakaznacheev/cleanenv"
)

const DevConfig = "config/config.dev.yml"
const DefaultConfig = "config/config.yml"

type Config struct {
	App struct {
		Port string `env:"PORT" env-default:"8000" yaml:"port"`
	} `env:"app" yaml:"app"`
	PostgreSQL struct {
		Username string `env-required:"true" env-default:"postgres" yaml:"username"`
		Password string `env-required:"true" env-default:"qwerty" yaml:"password"`
		Host     string `env-required:"true" env-default:"localhost" yaml:"host"`
		Port     string `env-required:"true" env-default:"5432" yaml:"port"`
		Database string `env-required:"true" env-default:"postgres" yaml:"database"`
		SSLMODE  string `env-default:"disable" yaml:"sslmode"`
	} `yaml:"postgreSQL"`
	Auth struct {
		Salt string `env-required:"true" yaml:"salt"`
		JWT  struct {
			Secret          string `env-required:"true" yaml:"secret"`
			Expire          int    `env-default:"3600" yaml:"expire"`
			TemporaryExpire int    `env-default:"1800" yaml:"temporaryExpire"`
		} `yaml:"jwt"`
		ConfirmationCode struct {
			Expire int `env-default:"3600" yaml:"expire"`
		} `yaml:"confirmationCode"`
	} `yaml:"auth"`
	AWS struct {
		AccessKeyID     string `env-required:"true" yaml:"awsAccessKeyId"`
		SecretAccessKey string `env-required:"true" yaml:"awsSecretAccessKey"`
		Region          string `env-required:"true" yaml:"awsRegion"`
		BucketName      string `env-required:"true" yaml:"awsBucketName"`
	} `yaml:"awsS3"`
	SendGrid struct {
		Key string `env-required:"true" yaml:"key"`
	} `yaml:"sendGrid"`
	Twilio struct {
		AccountSid string `env-required:"true" yaml:"accountSid"`
		AuthToken  string `env-required:"true" yaml:"authToken"`
		From       string `env-required:"true" yaml:"from"`
	} `yaml:"twilio"`
	Stripe struct {
		Key               string `env-required:"true" yaml:"key"`
		RefreshURL        string `env-required:"true" yaml:"refreshURL"`
		ReturnURL         string `env-required:"true" yaml:"returnURL"`
		LoanID            string `env-required:"true" yaml:"loanID"`
		RepayLoanID       string `env-required:"true" yaml:"repayLoanID"`
		PaymentSuccessURL string `env-required:"true" yaml:"paymentSuccessURL"`
		PaymentCancelURL  string `env-required:"true" yaml:"paymentCancelURL"`
		WebhookKey        string `env-required:"true" yaml:"webhookKey"`
	} `yaml:"stripe"`
	Github struct {
		ClientID     string `env-required:"true" yaml:"clientID"`
		ClientSecret string `env-required:"true" yaml:"clientSecret"`
	} `yaml:"github"`
}

var instance *Config
var once sync.Once

func GetConfig() *Config {
	var configFiles = []string{DefaultConfig, DevConfig}

	once.Do(func() {
		instance = &Config{}
		for _, v := range configFiles {
			if err := cleanenv.ReadConfig(v, instance); err != nil {
				_, _ = cleanenv.GetDescription(instance, nil)
				continue
			}

			break
		}
	})

	return instance
}
