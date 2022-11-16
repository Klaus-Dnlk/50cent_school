package service

import (
	"bytes"
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/json"
	"errors"
	"fmt"
	"image/png"
	"io"
	"net/http"
	"strconv"
	"time"

	"github.com/pquerna/otp/totp"
	"google.golang.org/api/idtoken"

	"50Cent/backend/config"

	"50Cent/backend/internal/command"
	"50Cent/backend/internal/domain"
	"50Cent/backend/internal/models"
	"50Cent/backend/internal/repositories"

	"github.com/golang-jwt/jwt"
)

type AuthService struct {
	authRepo             repositories.Auth
	uploadRepo           repositories.Upload
	twilioRepo           repositories.Twilio
	mailRepo             repositories.Mail
	confirmationCodeRepo repositories.ConfirmationCode
	cfg                  *config.Config
}

func NewAuthService(authRepo repositories.Auth, uploadRepo repositories.Upload, twilioRepo repositories.Twilio, mailRepo repositories.Mail, confirmationCodeRepo repositories.ConfirmationCode, cfg *config.Config) *AuthService {
	return &AuthService{authRepo: authRepo, uploadRepo: uploadRepo, twilioRepo: twilioRepo, mailRepo: mailRepo, confirmationCodeRepo: confirmationCodeRepo, cfg: cfg}
}

func (s *AuthService) Registration(ctx context.Context, user *domain.User) (uint, error) {
	user.Password = s.generatePasswordHash(user.Password)

	userID, err := s.authRepo.Create(ctx, domainUserToDB(user))
	if err != nil {
		return userID, err
	}

	if er := s.SetConfirmationCode(ctx, user.Email, Email); er != nil {
		return userID, er
	}

	return userID, err
}

func (s *AuthService) Confirm(ctx context.Context, email string, code string) error {
	user, err := s.authRepo.GetUserByEmail(ctx, email)
	if err != nil {
		return err
	}

	err = s.verifyCode(ctx, code, user)
	if err != nil {
		return err
	}

	user.IsVerified = true

	err = s.authRepo.Update(ctx, user)
	if err != nil {
		return err
	}

	if err := s.resetConfirmationCode(ctx, email); err != nil {
		return err
	}

	return nil
}

func (s *AuthService) Login(ctx context.Context, email string, password string) (tok string, mfaTypes []string, err error) {
	user, err := s.authRepo.GetUserByEmail(ctx, email)
	if err != nil {
		return "", nil, err
	}

	if user.Password != s.generatePasswordHash(password) {
		return "", nil, errors.New("password or email is not correct")
	}

	token, err := s.GenerateToken(email, user.ID, true)
	if err != nil {
		return "", nil, errors.New("failed to generate temporary token")
	}

	typesMFA := make([]string, 0, 3)
	if user.HasMFA&models.OTP != 0 {
		typesMFA = append(typesMFA, "otp")
	}

	if user.HasMFA&models.Email != 0 {
		typesMFA = append(typesMFA, "email")
	}

	if user.HasMFA&models.Phone != 0 {
		typesMFA = append(typesMFA, "phone")
	}

	return token, typesMFA, nil
}

func (s *AuthService) ExternalLogin(ctx context.Context, email string) (tok string, mfaTypes []string, err error) {
	user, err := s.authRepo.GetUserByEmail(ctx, email)
	if err != nil {
		return "", nil, err
	}

	token, err := s.GenerateToken(email, user.ID, true)
	if err != nil {
		return "", nil, errors.New("failed to generate temporary token")
	}

	typesMFA := make([]string, 0, 3)
	if user.HasMFA&models.OTP != 0 {
		typesMFA = append(typesMFA, "otp")
	}

	if user.HasMFA&models.Email != 0 {
		typesMFA = append(typesMFA, "email")
	}

	if user.HasMFA&models.Phone != 0 {
		typesMFA = append(typesMFA, "phone")
	}

	return token, typesMFA, nil
}

func (s *AuthService) LoginPhone(ctx context.Context, email string) error {
	user, err := s.authRepo.GetUserByEmail(ctx, email)
	if err != nil {
		return err
	}

	if user.HasMFA&models.Phone == 0 {
		return errors.New("this user doesn't have phone authorization method")
	}

	if err := s.SetConfirmationCode(ctx, user.Email, Phone); err != nil {
		return err
	}

	return nil
}

func (s *AuthService) LoginEmail(ctx context.Context, email string) error {
	user, err := s.authRepo.GetUserByEmail(ctx, email)
	if err != nil {
		return err
	}

	if user.HasMFA&models.Email == 0 {
		return errors.New("this user doesn't have email authorization method")
	}

	if err := s.SetConfirmationCode(ctx, user.Email, Email); err != nil {
		return err
	}

	return nil
}

func (s *AuthService) LoginConfirmPhone(ctx context.Context, email string, code string) (string, error) {
	user, err := s.authRepo.GetUserByEmail(ctx, email)
	if err != nil {
		return "", err
	}

	if user.HasMFA&models.Phone == 0 {
		return "", errors.New("this user doesn't have phone authorization method")
	}

	err = s.verifyCode(ctx, code, user)
	if err != nil {
		return "", err
	}

	if er := s.resetConfirmationCode(ctx, email); er != nil {
		return "", er
	}

	token, err := s.GenerateToken(email, user.ID, false)
	if err != nil {
		return "", errors.New("failed to generate token")
	}

	return token, nil
}

func (s *AuthService) LoginConfirmEmail(ctx context.Context, email string, code string) (string, error) {
	user, err := s.authRepo.GetUserByEmail(ctx, email)
	if err != nil {
		return "", err
	}

	if user.HasMFA&models.Email == 0 {
		return "", errors.New("this user doesn't have email authorization method")
	}

	err = s.verifyCode(ctx, code, user)
	if err != nil {
		return "", err
	}

	err = s.resetConfirmationCode(ctx, email)
	if err != nil {
		return "", err
	}

	token, err := s.GenerateToken(email, user.ID, false)
	if err != nil {
		return "", errors.New("failed to generate token")
	}

	return token, nil
}

func (s *AuthService) LoginConfirmOTP(ctx context.Context, email string, userID uint, code string) (string, error) {
	if err := s.checkOTP(ctx, email, code); err != nil {
		return "", err
	}

	token, err := s.GenerateToken(email, userID, false)
	if err != nil {
		return "", errors.New("failed to generate token")
	}

	return token, nil
}

func (s *AuthService) GenerateToken(email string, userID uint, isTemporary bool) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return "", errors.New("invalid token claims")
	}

	claims["email"] = email
	claims["userID"] = userID

	if isTemporary {
		claims["exp"] = time.Now().Add(time.Second * time.Duration(s.cfg.Auth.JWT.TemporaryExpire)).Unix()
		claims["isTemporary"] = true
	} else {
		claims["exp"] = time.Now().Add(time.Second * time.Duration(s.cfg.Auth.JWT.Expire)).Unix()
		claims["isTemporary"] = false
	}

	tokenString, err := token.SignedString([]byte(s.cfg.Auth.JWT.Secret))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func (s *AuthService) ParseToken(tokenString string) (tok string, userID uint, isTemporary bool, err error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(s.cfg.Auth.JWT.Secret), nil
	})

	if err != nil {
		return "", 0, false, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		id, _ := strconv.ParseUint(fmt.Sprintf("%.f", claims["userID"]), 10, 32)
		userID := uint(id)

		return claims["email"].(string), userID, claims["isTemporary"].(bool), nil
	}

	return "", 0, false, fmt.Errorf("token is not valid")
}

func (s *AuthService) generatePasswordHash(password string) string {
	hash := sha256.New()
	hash.Write([]byte(password))

	return fmt.Sprintf("%x", hash.Sum([]byte(s.cfg.Auth.Salt)))
}

func domainUserToDB(user *domain.User) *models.User {
	return &models.User{
		Email:      user.Email,
		Password:   user.Password,
		Phone:      user.Phone,
		IsVerified: user.IsVerified,
	}
}

func (s *AuthService) UpdatePassword(ctx context.Context, email, password string) error {
	dbUser, err := s.authRepo.GetUserByEmail(ctx, email)
	if err != nil {
		return err
	}

	user := domain.User{
		ID:         dbUser.ID,
		Password:   dbUser.Password,
		IsVerified: dbUser.IsVerified,
		Email:      dbUser.Email,
		Phone:      dbUser.Phone,
	}
	user.Password = s.generatePasswordHash(password)

	dbUser.Password = user.Password

	return s.authRepo.Update(ctx, dbUser)
}

func (s *AuthService) GetUserByID(ctx context.Context, userID uint) (*domain.User, error) {
	dbUser, err := s.authRepo.GetUserByID(ctx, userID)
	if err != nil {
		return nil, err
	}

	domainUser := &domain.User{
		ID:         dbUser.ID,
		Password:   dbUser.Password,
		IsVerified: dbUser.IsVerified,
		Email:      dbUser.Email,
		Phone:      dbUser.Phone,
	}

	return domainUser, nil
}

func (s *AuthService) GetUserFromGoogleToken(ctx context.Context, idToken string, clientID string) (email string) {
	payload, err := idtoken.Validate(ctx, idToken, clientID)
	if err != nil {
		panic(err)
	}

	userEmail, exist := payload.Claims["email"].(string)
	if !exist {
		fmt.Println("email wasn't parsed")
	}

	return userEmail
}

func (s *AuthService) GetUserInfoFromFacebook(token string) (command.FacebookUserDetails, error) {
	var fbUserDetails command.FacebookUserDetails

	facebookUserDetailsRequest, _ := http.NewRequest("GET", "https://graph.facebook.com/me?fields=id,email&access_token="+token, http.NoBody)

	facebookUserDetailsResponse, facebookUserDetailsResponseError := http.DefaultClient.Do(facebookUserDetailsRequest)

	if facebookUserDetailsResponseError != nil {
		return command.FacebookUserDetails{}, errors.New("error occurred while getting information from Facebook")
	}

	decoder := json.NewDecoder(facebookUserDetailsResponse.Body)
	decoderErr := decoder.Decode(&fbUserDetails)

	defer facebookUserDetailsResponse.Body.Close()

	if decoderErr != nil {
		return command.FacebookUserDetails{}, errors.New("error occurred while getting information from Facebook")
	}

	return fbUserDetails, nil
}

func GetGitHubUser(accessToken string) (*command.GithubUserDetails, error) {
	rootURL := "https://api.github.com/user"

	req, err := http.NewRequest("GET", rootURL, http.NoBody)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", accessToken))

	client := http.Client{
		Timeout: time.Second * 30,
	}

	res, err := client.Do(req)
	if err != nil {
		return nil, err
	}

	if res.StatusCode != http.StatusOK {
		return nil, errors.New("could not retrieve user")
	}

	resBody, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}

	var GitHubUserRes map[string]interface{}

	if err := json.Unmarshal(resBody, &GitHubUserRes); err != nil {
		return nil, err
	}

	userBody := &command.GithubUserDetails{
		Email: GitHubUserRes["email"].(string),
	}

	return userBody, nil
}

func (s *AuthService) GetUserByEmail(ctx context.Context, email string) (*domain.User, error) {
	dbUser, err := s.authRepo.GetUserByEmail(ctx, email)
	if err != nil {
		return nil, err
	}

	domainUser := &domain.User{
		ID:         dbUser.ID,
		Password:   dbUser.Password,
		IsVerified: dbUser.IsVerified,
		Email:      dbUser.Email,
	}

	return domainUser, nil
}

// admin functionality
func domainAdminToDB(admin *domain.Admin) *models.Admin {
	return &models.Admin{
		UserID: admin.UserID,
	}
}

func (s *AuthService) AdminRegistration(ctx context.Context, admin *domain.Admin) error {
	return s.authRepo.CreateAdmin(ctx, domainAdminToDB(admin))
}

func (s *AuthService) GetAdminByID(ctx context.Context, userID uint) (*models.Admin, error) {
	return s.authRepo.GetAdminByID(ctx, userID)
}

func (s *AuthService) RegisterOTP(ctx context.Context, userID uint) ([]byte, error) {
	user, err := s.authRepo.GetUserByID(ctx, userID)
	if err != nil {
		return nil, err
	}

	code, secret, err := s.generateCodeSecret(user.Email)
	if err != nil {
		return nil, err
	}

	user.Secret = secret
	if err := s.authRepo.Update(ctx, user); err != nil {
		return nil, err
	}

	return code, nil
}

func (s *AuthService) generateCodeSecret(email string) (code []byte, secret string, err error) {
	key, err := totp.Generate(totp.GenerateOpts{
		Issuer:      "50Cent/.com",
		AccountName: email,
	})
	if err != nil {
		return nil, "", err
	}

	img, err := key.Image(400, 400)
	if err != nil {
		return nil, "", err
	}

	var buf bytes.Buffer
	if err := png.Encode(&buf, img); err != nil {
		return nil, "", err
	}

	return buf.Bytes(), key.Secret(), nil
}

func (s *AuthService) ConfirmOTP(ctx context.Context, email string, code string) error {
	user, err := s.authRepo.GetUserByEmail(ctx, email)
	if err != nil {
		return err
	}

	if valid := totp.Validate(code, user.Secret); !valid {
		return errors.New("invalid otp code")
	}

	user.HasMFA |= models.OTP
	if err := s.authRepo.Update(ctx, user); err != nil {
		return err
	}

	return nil
}

func (s *AuthService) checkOTP(ctx context.Context, email string, code string) error {
	user, err := s.authRepo.GetUserByEmail(ctx, email)
	if err != nil {
		return err
	}

	if user.HasMFA&models.OTP == 0 {
		return errors.New("OTP method isn't available for this user")
	}

	if user.Secret == "" {
		return errors.New("invalid secret")
	}

	if valid := totp.Validate(code, user.Secret); !valid {
		return errors.New("invalid otp code")
	}

	return nil
}

func generateConfirmationCode() string {
	digitNum := 6

	table := [...]byte{'1', '2', '3', '4', '5', '6', '7', '8', '9', '0'}

	b := make([]byte, digitNum)

	n, err := io.ReadAtLeast(rand.Reader, b, digitNum)

	if n != digitNum {
		panic(err)
	}

	for i := 0; i < len(b); i++ {
		b[i] = table[int(b[i])%len(table)]
	}

	return string(b)
}

type SendingMethod int

const (
	Email SendingMethod = iota
	Phone
)

func (s *AuthService) SetConfirmationCode(ctx context.Context, email string, method SendingMethod) error {
	user, err := s.authRepo.GetUserByEmail(ctx, email)
	if err != nil {
		return err
	}

	code := generateConfirmationCode()

	codeModel := models.ConfirmationCode{
		Code:      code,
		ExpiredAt: time.Now().Add(time.Second * time.Duration(s.cfg.Auth.ConfirmationCode.Expire)),
		UserID:    user.ID,
	}

	err = s.confirmationCodeRepo.Create(ctx, &codeModel)
	if err != nil {
		return err
	}

	if method == Email {
		if err := s.mailRepo.Send(email, code); err != nil {
			return err
		}
	}

	if method == Phone {
		status, err := s.twilioRepo.SendMessage(user.Phone, code)
		if err != nil {
			return err
		}

		if status == "failed" {
			return errors.New("failed to send a message")
		}
	}

	return nil
}

func (s *AuthService) resetConfirmationCode(ctx context.Context, email string) error {
	user, err := s.authRepo.GetUserByEmail(ctx, email)
	if err != nil {
		return err
	}

	if err := s.confirmationCodeRepo.DeleteConfirmationCode(ctx, user); err != nil {
		return err
	}

	return nil
}

func (s *AuthService) verifyCode(ctx context.Context, code string, user *models.User) error {
	userCode, err := s.confirmationCodeRepo.GetConfirmationCode(ctx, user)
	if err != nil {
		return err
	}

	if userCode.ExpiredAt.Before(time.Now()) {
		return errors.New("code is expired")
	}

	if code != userCode.Code {
		return fmt.Errorf("code is not correct")
	}

	return nil
}
