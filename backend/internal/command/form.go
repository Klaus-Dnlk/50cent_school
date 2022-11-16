package command

import "mime/multipart"

type MultipartFiles []*multipart.FileHeader

type Form struct {
	Files MultipartFiles `form:"files" binding:"required"`
}
