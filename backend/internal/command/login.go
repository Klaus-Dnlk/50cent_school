package command

type Login struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type LoginConfirm struct {
	Code string `json:"code" binding:"required"`
}
