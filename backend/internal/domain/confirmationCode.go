package domain

import "time"

type ConfirmationCode struct {
	Code      string `gorm:"type:varchar(200)"`
	ExpiredAt time.Time
	UserID    uint
	User      User
}
