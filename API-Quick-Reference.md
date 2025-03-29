# Velo API Quick Reference

## Authentication Endpoints

| Endpoint                    | Method | Description                 | Auth Required |
| --------------------------- | ------ | --------------------------- | ------------- |
| `/api/auth/register`        | POST   | Register a new user         | No            |
| `/api/auth/login`           | POST   | Login and get access token  | No            |
| `/api/auth/logout`          | POST   | Logout and invalidate token | No            |
| `/api/auth/forgot-password` | POST   | Request password reset      | No            |
| `/api/auth/reset-password`  | POST   | Reset password with token   | No            |

## User Endpoints

| Endpoint       | Method | Description              | Auth Required |
| -------------- | ------ | ------------------------ | ------------- |
| `/api/profile` | GET    | Get current user profile | Yes           |

## Request/Response Examples

### Register

**Request:**

```json
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "securepassword",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response:**

```json
Status: 201 Created
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

### Login

**Request:**

```json
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**

```json
Status: 200 OK
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

_Note: Authentication token is set as HTTP-only cookie_

### Get Profile

**Request:**

```
GET /api/profile
Authorization: Bearer <token>
```

**Response:**

```json
Status: 200 OK
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

### Forgot Password

**Request:**

```json
POST /api/auth/forgot-password
{
  "email": "user@example.com"
}
```

**Response:**

```json
Status: 200 OK
{
  "message": "If your email is registered, you will receive reset instructions shortly"
}
```

### Reset Password

**Request:**

```json
POST /api/auth/reset-password
{
  "token": "EXAMPLE_TOKEN_REPLACE_ME",
  "new_password": "newsecurepassword"
}
```

**Response:**

```json
Status: 200 OK
{
  "message": "Password reset successfully"
}
```

## Common Error Responses

| Status Code | Meaning                                           |
| ----------- | ------------------------------------------------- |
| 400         | Bad Request - Invalid input or request            |
| 401         | Unauthorized - Missing or invalid authentication  |
| 500         | Server Error - Something went wrong on the server |

**Sample Error Response:**

```json
{
  "error": "Description of what went wrong"
}
```
