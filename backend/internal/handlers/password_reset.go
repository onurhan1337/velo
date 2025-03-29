package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/onurhan/velo/internal/services"
)

type PasswordResetHandler struct {
	resetService *services.PasswordResetService
}

func NewPasswordResetHandler() *PasswordResetHandler {
	return &PasswordResetHandler{
		resetService: services.NewPasswordResetService(),
	}
}

type RequestResetRequest struct {
	Email string `json:"email"`
}

type ResetPasswordRequest struct {
	Token       string `json:"token"`
	NewPassword string `json:"new_password"`
}

func (h *PasswordResetHandler) RequestReset(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req RequestResetRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.Email == "" {
		http.Error(w, "Email is required", http.StatusBadRequest)
		return
	}

	token, err := h.resetService.GenerateToken(req.Email)
	if err != nil {
		if err == services.ErrUserNotFound {
			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(map[string]string{
				"message": "If your email is registered, you will receive reset instructions shortly",
			})
			return
		}
		http.Error(w, "Failed to generate reset token", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Reset token generated successfully",
		"token":   token,
	})
}

func (h *PasswordResetHandler) ResetPassword(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req ResetPasswordRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.Token == "" || req.NewPassword == "" {
		http.Error(w, "Token and new password are required", http.StatusBadRequest)
		return
	}

	err := h.resetService.ResetPassword(req.Token, req.NewPassword)
	if err != nil {
		switch err {
		case services.ErrTokenNotFound:
			http.Error(w, "Invalid reset token", http.StatusBadRequest)
		case services.ErrTokenExpired:
			http.Error(w, "Reset token has expired", http.StatusBadRequest)
		case services.ErrTokenAlreadyUsed:
			http.Error(w, "Reset token has already been used", http.StatusBadRequest)
		default:
			http.Error(w, "Failed to reset password", http.StatusInternalServerError)
		}
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Password reset successfully",
	})
} 