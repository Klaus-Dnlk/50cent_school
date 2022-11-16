package domain

import "mime/multipart"

type Investor struct {
	ID         uint
	Name       string
	Surname    string
	MiddleName string
	UserEmail  string
	Photo      multipart.FileHeader
	IDFile     multipart.FileHeader
	UserID     uint
	Balance    float64
}
