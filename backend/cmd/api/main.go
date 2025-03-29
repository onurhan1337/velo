package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gorilla/mux"
	"github.com/onurhan/velo/config"
	"github.com/onurhan/velo/internal/database"
	"github.com/onurhan/velo/internal/handlers"
	"github.com/onurhan/velo/internal/middleware"
	"github.com/onurhan/velo/internal/services"
)

func main() {
	cfg := config.Load()

	database.Connect()

	authService := services.NewAuthService(cfg)

	authHandler := handlers.NewAuthHandler(cfg)
	passwordResetHandler := handlers.NewPasswordResetHandler()

	router := mux.NewRouter()
	
	router.Use(middleware.CorsMiddleware)

	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Welcome to Velo API!")
	})
	router.HandleFunc("/health", handlers.HealthHandler)
	router.HandleFunc("/api/auth/register", authHandler.Register).Methods("POST")
	router.HandleFunc("/api/auth/login", authHandler.Login).Methods("POST")
	router.HandleFunc("/api/auth/forgot-password", passwordResetHandler.RequestReset).Methods("POST")
	router.HandleFunc("/api/auth/reset-password", passwordResetHandler.ResetPassword).Methods("POST")

	authMiddleware := middleware.AuthMiddleware(authService)
	protectedRouter := router.PathPrefix("/api").Subrouter()
	protectedRouter.Use(authMiddleware)
	protectedRouter.HandleFunc("/profile", authHandler.GetProfile).Methods("GET")

	server := &http.Server{
		Addr:    ":" + cfg.Port,
		Handler: router,
	}

	done := make(chan os.Signal, 1)
	signal.Notify(done, os.Interrupt, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		log.Printf("Server starting on port %s in %s mode", cfg.Port, cfg.Environment)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Error starting server: %v", err)
		}
	}()

	<-done
	log.Print("Server stopping...")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatalf("Server shutdown failed: %v", err)
	}

	log.Print("Server stopped gracefully")
} 