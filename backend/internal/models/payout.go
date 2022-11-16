package models

import "gorm.io/gorm"

type Payout struct {
	gorm.Model
	Amount     float64
	IsConsumer bool
	UserID     uint
}
