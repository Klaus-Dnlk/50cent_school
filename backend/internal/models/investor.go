package models

import "gorm.io/gorm"

type Investor struct {
	gorm.Model
	Name            string `gorm:"type:varchar(50)"`
	Surname         string `gorm:"type:varchar(50)"`
	MiddleName      string `gorm:"type:varchar(50)"`
	UserEmail       string
	UserID          uint
	User            User
	StripeID        string `gorm:"type:varchar(200)"`
	StripeConfirmed bool   `gorm:"type:boolean; default:false"`
	IsVerified      bool   `gorm:"type:boolean; default:false"`
	Balance         float64
}
