# Velo API Documentation

This document provides detailed information about the Velo API endpoints, including authentication flows, request/response formats, and error handling.

## Base URL

The base URL for all API endpoints is:

```
http://localhost:8080
```

In production, this would be replaced with your domain.

## Authentication

The API uses JWT (JSON Web Token) for authentication. Most endpoints require authentication via a Bearer token in the Authorization header:

```
Authorization: Bearer {your-token}
```

The token is obtained during login and stored in an HTTP-only cookie for web applications, but should be sent in the header for non-browser clients.

## Error Handling

All API errors return a JSON response with an `error` field containing a descriptive message:

```json
{
  "error": "Description of what went wrong"
}
```

HTTP status codes are used appropriately:

- 200-299: Successful operations
- 400: Bad request (invalid input)
- 401: Unauthorized (missing or invalid authentication)
- 403: Forbidden (authenticated but not allowed)
- 404: Resource not found
- 500-599: Server errors

## API Endpoints

### Authentication

#### Register a New User

Creates a new user account.

- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Authentication**: None required
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword",
    "first_name": "John",
    "last_name": "Doe"
  }
  ```
- **Success Response**:
  - **Code**: 201 Created
  - **Content**:
    ```json
    {
      "user": {
        "id": 1,
        "email": "user@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "created_at": "2023-07-15T12:34:56Z"
      }
    }
    ```
- **Error Responses**:
  - **Code**: 400 Bad Request
    ```json
    {
      "error": "Email already exists"
    }
    ```
  - **Code**: 400 Bad Request
    ```json
    {
      "error": "Email and password are required"
    }
    ```

#### Login

Authenticates a user and provides an access token.

- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Authentication**: None required
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "user": {
        "id": 1,
        "email": "user@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "created_at": "2023-07-15T12:34:56Z"
      }
    }
    ```
  - **Note**: The JWT token is returned in an HTTP-only cookie
- **Error Responses**:
  - **Code**: 401 Unauthorized
    ```json
    {
      "error": "Invalid email or password"
    }
    ```
  - **Code**: 400 Bad Request
    ```json
    {
      "error": "Email and password are required"
    }
    ```

#### Logout

Logs out the current user by invalidating their token.

- **URL**: `/api/auth/logout`
- **Method**: `POST`
- **Authentication**: Optional
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "message": "Logged out successfully"
    }
    ```
  - **Note**: This endpoint clears the auth cookie

#### Forgot Password

Requests a password reset token to be sent to the user's email.

- **URL**: `/api/auth/forgot-password`
- **Method**: `POST`
- **Authentication**: None required
- **Request Body**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "message": "If your email is registered, you will receive reset instructions shortly"
    }
    ```
  - **Note**: In development mode, the response may include the token for testing purposes

#### Reset Password

Resets a user's password using a token.

- **URL**: `/api/auth/reset-password`
- **Method**: `POST`
- **Authentication**: None required
- **Request Body**:
  ```json
  {
    "token": "a1b2c3d4e5f6g7h8i9j0",
    "new_password": "newsecurepassword"
  }
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "message": "Password reset successfully"
    }
    ```
- **Error Responses**:
  - **Code**: 400 Bad Request
    ```json
    {
      "error": "Invalid reset token"
    }
    ```
  - **Code**: 400 Bad Request
    ```json
    {
      "error": "Reset token has expired"
    }
    ```
  - **Code**: 400 Bad Request
    ```json
    {
      "error": "Reset token has already been used"
    }
    ```
  - **Code**: 400 Bad Request
    ```json
    {
      "error": "Token and new password are required"
    }
    ```

### User

#### Get Profile

Retrieves the current user's profile information.

- **URL**: `/api/profile`
- **Method**: `GET`
- **Authentication**: Required
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "user": {
        "id": 1,
        "email": "user@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "created_at": "2023-07-15T12:34:56Z"
      }
    }
    ```
- **Error Response**:
  - **Code**: 401 Unauthorized
    ```json
    {
      "error": "Unauthorized"
    }
    ```

## Data Models

### User

```typescript
{
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  created_at: string; // ISO 8601 format
}
```

## Development Setup

To test this API locally:

1. Start the backend server (runs on port 8080 by default)
2. Use the provided Postman collection to test endpoints
3. For JWT authentication in Postman:
   - After login, copy the token value from the cookie
   - Set it as the `token` variable in Postman
   - Or use the Authorization header directly with "Bearer {token}"

## Security Considerations

- Passwords are securely hashed using bcrypt
- JWT tokens expire after 24 hours
- Password reset tokens expire after 24 hours and can only be used once
- All authentication endpoints use appropriate HTTP status codes for security concerns
- HTTP-only cookies are used to prevent client-side JavaScript access to tokens
