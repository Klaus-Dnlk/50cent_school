package domain

import (
	"time"
)

type Balance struct {
	ID    uint
	Value float64
	Time  time.Time
}
