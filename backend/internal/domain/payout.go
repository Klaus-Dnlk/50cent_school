package domain

import "time"

type Payout struct {
	ID     uint
	Amount float64
	Time   time.Time
}
