package models

import "gorm.io/gorm"

// Admin `Admin` belongs to `User`, `UserID` is the foreign key
type Admin struct {
	gorm.Model
	UserID uint
	User   User
}
