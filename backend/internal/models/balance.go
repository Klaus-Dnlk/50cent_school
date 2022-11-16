package models

import (
	"time"

	"gorm.io/gorm"
)

type Balance struct {
	gorm.Model
	Value float64
	Time  time.Time
	// 1 - consumer, 2 - investor
	UserType uint
	UserID   uint
}
