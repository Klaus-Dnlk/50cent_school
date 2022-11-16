package models

import "gorm.io/gorm"

const (
	Email uint = 1 << iota
	Phone
	OTP
)

type User struct {
	gorm.Model
	Email      string `gorm:"type:varchar(50); not null; unique"`
	Password   string `gorm:"type:varchar(200); not null"`
	Phone      string `gorm:"type:varchar(50); not null; unique"`
	IsVerified bool   `gorm:"type:boolean; default:false"`
	HasMFA     uint   `gorm:"type:uint; default:3"`
	Secret     string `gorm:"type:varchar(200)"`
	Files      []UserFile
}
