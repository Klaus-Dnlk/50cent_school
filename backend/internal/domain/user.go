package domain

type User struct {
	ID         uint
	Password   string
	IsVerified bool
	Email      string
	Phone      string
}
