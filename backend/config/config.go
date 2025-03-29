package config

import (
	"log"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"github.com/joho/godotenv"
)

type Config struct {
	Port        string
	Environment string
	Debug       bool
	JWT         JWTConfig
	Database    DatabaseConfig
}

type JWTConfig struct {
	Secret    string
	ExpiresIn time.Duration
}

type DatabaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	Name     string
}

func Load() Config {
	err := godotenv.Load()
	if err != nil {
		rootPath := filepath.Join("..", "..")
		err = godotenv.Load(filepath.Join(rootPath, ".env"))
		if err != nil {
			log.Println("No .env file found, using default environment variables")
		}
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	env := os.Getenv("ENVIRONMENT")
	if env == "" {
		env = "development"
	}

	debug := false
	debugStr := os.Getenv("DEBUG")
	if debugStr != "" {
		debug, _ = strconv.ParseBool(debugStr)
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "EXAMPLE_SECRET_KEY_REPLACE_ME"
	}

	jwtExpiresIn := 24 * time.Hour
	jwtExpiresInStr := os.Getenv("JWT_EXPIRES_IN")
	if jwtExpiresInStr != "" {
		expiresInHours, err := strconv.Atoi(jwtExpiresInStr)
		if err == nil {
			jwtExpiresIn = time.Duration(expiresInHours) * time.Hour
		}
	}

	dbHost := os.Getenv("DB_HOST")
	if dbHost == "" {
		dbHost = "localhost"
	}

	dbPort := os.Getenv("DB_PORT")
	if dbPort == "" {
		dbPort = "5432"
	}

	dbUser := os.Getenv("DB_USER")
	if dbUser == "" {
		dbUser = "postgres"
	}

	dbPassword := os.Getenv("DB_PASSWORD")
	if dbPassword == "" {
		dbPassword = "postgres"
	}

	dbName := os.Getenv("DB_NAME")
	if dbName == "" {
		dbName = "velo"
	}

	return Config{
		Port:        port,
		Environment: env,
		Debug:       debug,
		JWT: JWTConfig{
			Secret:    jwtSecret,
			ExpiresIn: jwtExpiresIn,
		},
		Database: DatabaseConfig{
			Host:     dbHost,
			Port:     dbPort,
			User:     dbUser,
			Password: dbPassword,
			Name:     dbName,
		},
	}
} 