package models

import (
	"gorm.io/gorm"
)

type FileType string

const (
	General      FileType = "general"
	Photo        FileType = "photo"
	WorkFIle     FileType = "work_file"
	IDFile       FileType = "id_file"
	PropertyFile FileType = "property_file"
)

type UserFile struct {
	gorm.Model
	Title       string   `gorm:"size:255;not null;" json:"title"`
	FileType    FileType `gorm:"size:255;not null;" json:"filetype"`
	ContentPath string   `gorm:"size:255;not null;unique" json:"contentpath"`
	UserID      uint
}
