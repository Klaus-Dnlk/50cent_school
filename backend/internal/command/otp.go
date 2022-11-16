package command

type RegistrationOTP struct {
	Email string `json:"email" binding:"required"`
}

type OTP struct {
	Code string `json:"code" binding:"required"`
}
