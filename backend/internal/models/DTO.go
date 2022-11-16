package models

type UserToVerifyOnAdminPage struct {
	ID uint
	// 1 - investor, 2 - consumer
	Role      int
	Name      string
	Photo     string
	Passport  string
	WorkPlace string
	Property  string
}
