package services

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
	"time"

	"github.com/onurhan/velo/internal/database"
	"github.com/onurhan/velo/internal/models"
)

var (
	ErrTokenNotFound     = errors.New("reset token not found")
	ErrTokenExpired      = errors.New("reset token has expired")
	ErrTokenAlreadyUsed  = errors.New("reset token has already been used")
	ErrTokenGenerationFailed = errors.New("failed to generate token")
)

type PasswordResetService struct {
	tokenExpiryHours int
}

func NewPasswordResetService() *PasswordResetService {
	return &PasswordResetService{
		tokenExpiryHours: 24,
	}
}

func (s *PasswordResetService) GenerateToken(email string) (string, error) {
	var user models.User
	if err := database.DB.Where("email = ?", email).First(&user).Error; err != nil {
		return "", ErrUserNotFound
	}

	b := make([]byte, 16)
	if _, err := rand.Read(b); err != nil {
		return "", ErrTokenGenerationFailed
	}
	token := hex.EncodeToString(b)

	resetToken := models.PasswordResetToken{
		UserID:    user.ID,
		Token:     token,
		ExpiresAt: time.Now().Add(time.Duration(s.tokenExpiryHours) * time.Hour),
		Used:      false,
	}

	if err := database.DB.Create(&resetToken).Error; err != nil {
		return "", err
	}

	return token, nil
}

func (s *PasswordResetService) ValidateToken(token string) (*models.User, error) {
	var resetToken models.PasswordResetToken
	if err := database.DB.Where("token = ?", token).First(&resetToken).Error; err != nil {
		return nil, ErrTokenNotFound
	}

	if resetToken.ExpiresAt.Before(time.Now()) {
		return nil, ErrTokenExpired
	}
	
	if resetToken.Used {
		return nil, ErrTokenAlreadyUsed
	}

	var user models.User
	if err := database.DB.First(&user, resetToken.UserID).Error; err != nil {
		return nil, ErrUserNotFound
	}

	return &user, nil
}

func (s *PasswordResetService) ResetPassword(token, newPassword string) error {
	var resetToken models.PasswordResetToken
	if err := database.DB.Where("token = ?", token).First(&resetToken).Error; err != nil {
		return ErrTokenNotFound
	}

	if resetToken.ExpiresAt.Before(time.Now()) {
		return ErrTokenExpired
	}

	if resetToken.Used {
		return ErrTokenAlreadyUsed
	}

	var user models.User
	if err := database.DB.First(&user, resetToken.UserID).Error; err != nil {
		return ErrUserNotFound
	}

	user.Password = newPassword
	if err := database.DB.Save(&user).Error; err != nil {
		return err
	}

	resetToken.Used = true
	if err := database.DB.Save(&resetToken).Error; err != nil {
		return err
	}

	return nil
} 