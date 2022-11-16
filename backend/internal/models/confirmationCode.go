package models

import (
	"time"

	"gorm.io/gorm"
)

type ConfirmationCode struct {
	gorm.Model
	Code      string `gorm:"type:varchar(200)"`
	ExpiredAt time.Time
	UserID    uint
	User      User
}
