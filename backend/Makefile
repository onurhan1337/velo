.PHONY: build run dev test clean

# Build variables
BINARY_NAME=velo-api
BUILD_DIR=./build

# Development variables
GO_FILES=$(shell find . -name "*.go" -type f)

# Default target
all: build

# Build the application
build:
	@echo "Building..."
	@go build -o $(BUILD_DIR)/$(BINARY_NAME) ./cmd/api

# Run the application
run: build
	@echo "Running..."
	@$(BUILD_DIR)/$(BINARY_NAME)

# Run in development mode with hot reload (requires air to be installed)
dev:
	@echo "Starting development server..."
	@if command -v air > /dev/null; then \
		air; \
	else \
		echo "air is not installed. Install with: go install github.com/cosmtrek/air@latest"; \
		go run ./cmd/api; \
	fi

# Run tests
test:
	@echo "Running tests..."
	@go test -v ./...

# Run tests with coverage
test-coverage:
	@echo "Running tests with coverage..."
	@go test -coverprofile=coverage.out ./...
	@go tool cover -html=coverage.out

# Format code
fmt:
	@echo "Formatting code..."
	@gofmt -s -w $(GO_FILES)

# Lint code (requires golangci-lint)
lint:
	@echo "Linting code..."
	@if command -v golangci-lint > /dev/null; then \
		golangci-lint run; \
	else \
		echo "golangci-lint is not installed. Install from https://golangci-lint.run/usage/install/"; \
	fi

# Clean build artifacts
clean:
	@echo "Cleaning..."
	@rm -rf $(BUILD_DIR)

# Install dependencies
deps:
	@echo "Installing dependencies..."
	@go mod tidy 