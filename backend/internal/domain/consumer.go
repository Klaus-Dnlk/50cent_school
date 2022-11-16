package domain

import "mime/multipart"

type Consumer struct {
	ID           uint
	Name         string
	Surname      string
	MiddleName   string
	UserEmail    string
	Photo        multipart.FileHeader
	WorkFile     multipart.FileHeader
	IDFile       multipart.FileHeader
	PropertyFile multipart.FileHeader
	UserID       uint
	Balance      float64
}
