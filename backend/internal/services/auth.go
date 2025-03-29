package services

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/onurhan/velo/config"
	"github.com/onurhan/velo/internal/database"
	"github.com/onurhan/velo/internal/models"
)

var (
	ErrInvalidCredentials = errors.New("invalid email or password")
	ErrUserNotFound       = errors.New("user not found")
	ErrEmailAlreadyExists = errors.New("email already exists")
)

type AuthService struct {
	config config.Config
}

func NewAuthService(cfg config.Config) *AuthService {
	return &AuthService{
		config: cfg,
	}
}

func (s *AuthService) Register(email, password, firstName, lastName string) (*models.UserResponse, error) {
	var existingUser models.User
	result := database.DB.Where("email = ?", email).First(&existingUser)
	if result.RowsAffected > 0 {
		return nil, ErrEmailAlreadyExists
	}

	user := models.User{
		Email:     email,
		Password:  password,
		FirstName: firstName,
		LastName:  lastName,
	}

	if err := database.DB.Create(&user).Error; err != nil {
		return nil, err
	}

	userResponse := user.ToResponse()
	return &userResponse, nil
}

func (s *AuthService) Login(email, password string) (string, *models.UserResponse, error) {
	var user models.User
	result := database.DB.Where("email = ?", email).First(&user)
	if result.Error != nil {
		return "", nil, ErrInvalidCredentials
	}

	if !user.ValidatePassword(password) {
		return "", nil, ErrInvalidCredentials
	}

	token, err := s.GenerateToken(user.ID)
	if err != nil {
		return "", nil, err
	}

	userResponse := user.ToResponse()
	return token, &userResponse, nil
}

func (s *AuthService) GetUserByID(id uint) (*models.UserResponse, error) {
	var user models.User
	result := database.DB.First(&user, id)
	if result.Error != nil {
		return nil, ErrUserNotFound
	}

	userResponse := user.ToResponse()
	return &userResponse, nil
}

func (s *AuthService) GenerateToken(userID uint) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(s.config.JWT.ExpiresIn).Unix(),
		"iat":     time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.config.JWT.Secret))
}

func (s *AuthService) ValidateToken(tokenString string) (uint, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(s.config.JWT.Secret), nil
	})

	if err != nil {
		return 0, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		userID := uint(claims["user_id"].(float64))
		return userID, nil
	}

	return 0, errors.New("invalid token")
} 