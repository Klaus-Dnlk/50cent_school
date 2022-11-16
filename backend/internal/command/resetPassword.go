package command

type RequestToResetPassword struct {
	Email string `json:"email" binding:"required"`
}

type ConfirmResetPassword struct {
	Email string `json:"email" binding:"required"`
	Code  string `json:"code" binding:"required"`
}

type ChangePassword struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}
