# Velo Backend

This is the backend API for Velo application built with Go.

## Project Structure

```
backend/
├── cmd/              # Command-line applications
│   └── api/          # Main API entry point
├── config/           # Configuration
├── internal/         # Private application code
│   ├── handlers/     # HTTP handlers
│   ├── models/       # Data models
│   ├── services/     # Business logic
│   └── database/     # Database access
├── build/            # Compiled binaries
└── tmp/              # Temporary files
```

## Prerequisites

- Go 1.18+
- Make (optional, for using the Makefile)
- [Air](https://github.com/cosmtrek/air) (optional, for hot reloading)
- [golangci-lint](https://golangci-lint.run/) (optional, for linting)

## Getting Started

1. Clone the repository
2. Navigate to the backend directory
3. Run the application

```bash
# Install dependencies
go mod tidy

# Run in development mode (with hot reloading if Air is installed)
make dev

# Or build and run
make run

# Or directly with Go
go run cmd/api/main.go
```

## Development

```bash
# Format code
make fmt

# Run tests
make test

# Run tests with coverage
make test-coverage

# Lint code
make lint
```

## Environment Variables

- `PORT`: HTTP server port (default: 8080)
- `ENVIRONMENT`: Application environment (default: development)
- `DEBUG`: Enable debug mode (default: false)

## CI/CD

The project uses GitHub Actions for continuous integration:

- Runs on push to main and pull requests
- Builds the application
- Runs tests
- Performs linting checks

## License

[MIT](LICENSE)

## Database Setup

The application uses PostgreSQL as the database. By default, it will connect to:

- Host: localhost
- Port: 5432
- User: postgres
- Password: postgres
- Database name: velo

### Setup PostgreSQL

1. Install PostgreSQL if you haven't already
2. Create a database called "velo"

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE velo;

# Verify database was created
\l
```

### Environment Variables

You can customize the database connection and other settings by using environment variables.

The simplest way is to create a `.env` file in the backend directory:

1. Copy the example file: `cp .env.example .env`
2. Edit the `.env` file and set your values

These are the available environment variables:

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=velo

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=24  # hours

# Server
PORT=8080
ENVIRONMENT=development
DEBUG=true
```

You can also set these variables directly in your shell environment.

## Running the Application

```bash
# From the backend directory
go run cmd/api/main.go
```

The server will start on port 8080 (or the port specified in the PORT environment variable).

## API Documentation

See the API documentation and Postman collection in the project root directory.
