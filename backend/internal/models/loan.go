package models

import (
	"time"

	"gorm.io/gorm"
)

type Loan struct {
	gorm.Model
	CreditSum         float64 `gorm:"type:float; not null"`
	CreditTitle       string  `gorm:"type:varchar(100); not null"`
	CreditDescription string  `gorm:"type:varchar(100)"`
	CreditTerm        uint    `gorm:"type:uint; not null"`
	CreditRate        float64 `gorm:"type:float; not null"`
	ReturnedAmount    uint    `gorm:"type:uint; default:0"`
	IsReturned        bool    `gorm:"type:boolean; default:false"`
	IsAccepted        bool    `gorm:"type:boolean; default:false"`
	AcceptedAt        time.Time
	ConsumerID        uint
	Consumer          Consumer
	InvestorID        *uint
	Investor          Investor
}
