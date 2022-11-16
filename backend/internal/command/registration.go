package command

import "mime/multipart"

type Registration struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
	Phone    string `json:"phone" binding:"required"`
}

type GoogleRegistration struct {
	Token    string `json:"token"`
	ClientID string `json:"clientId"`
}

type FacebookRegistration struct {
	Token string `json:"token"`
}

type FacebookUserDetails struct {
	ID    string
	Email string
}

type GithubRegistration struct {
	Code string `json:"code"`
}

type GithubUserDetails struct {
	Email string
}

type GitHubOauthToken struct {
	AccessToken string
}

type GithubAccessTokenResponse struct {
	AccessToken string `json:"access_token"`
	TokenType   string `json:"token_type"`
	Scope       string `json:"scope"`
}

type ConfirmEmail struct {
	Email string `json:"email"`
	Code  string `json:"code" binding:"required"`
}

type ConsumerRegistration struct {
	Name         string               `form:"name"`
	Surname      string               `form:"surname"`
	MiddleName   string               `form:"middle_name"`
	Photo        multipart.FileHeader `form:"photo"`
	WorkFile     multipart.FileHeader `form:"work_file"`
	IDFile       multipart.FileHeader `form:"id_file"`
	PropertyFile multipart.FileHeader `form:"property_file"`
}

type InvestorRegistration struct {
	Name       string               `form:"name"`
	Surname    string               `form:"surname"`
	MiddleName string               `form:"middle_name"`
	Photo      multipart.FileHeader `form:"photo"`
	IDFile     multipart.FileHeader `form:"id_file"`
}
