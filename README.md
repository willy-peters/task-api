# Task Management API

A professional RESTful API for managing user tasks with secure authentication, MongoDB persistence, and Swagger-based API documentation.

## Overview

This project provides a backend service for task management with user registration, login, and protected task operations. It is built with Node.js and Express and uses MongoDB for storage. The API includes validation, JWT-based authorization, and a structured error-handling layer.

## Features

- User registration and login
- JWT authentication for protected routes
- Task creation, listing, retrieval, updating, and deletion
- Status filtering for tasks
- Input validation using Joi
- MongoDB integration with Mongoose
- Swagger/OpenAPI documentation
- Structured API error handling and security middleware

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT for authentication
- Joi for validation
- Swagger UI / Swagger JSDoc
- dotenv for environment configuration
- Helmet, CORS, and Morgan for security and logging

## Project Structure

```text
src/
├── app.js
├── server.js
├── config/
│   ├── db.js
│   ├── env.js
│   └── swagger.js
├── controllers/
│   ├── auth.controller.js
│   └── task.controller.js
├── docs/
│   ├── auth.docs.js
│   ├── components.js
│   ├── health.docs.js
│   └── tasks.docs.js
├── middleware/
│   ├── auth.js
│   ├── errorHandler.js
│   ├── validate.js
│   └── validateObjectId.js
├── models/
│   ├── Task.js
│   └── User.js
├── routes/
│   ├── auth.routes.js
│   ├── index.js
│   └── task.routes.js
├── utils/
│   ├── ApiError.js
│   └── generateToken.js
├── validators/
│   ├── auth.validator.js
│   └── task.validator.js
└──
```

## Prerequisites

Before running the application, ensure you have the following installed:

- Node.js v20 or later
- MongoDB instance or MongoDB Atlas connection
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd task-api
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root and configure the required values:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/task-api
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=1d
CORS_ORIGIN=http://localhost:3000
```

## Running the Application

Start the server in development mode:

```bash
npm run dev
```

Or run the production-style start command:

```bash
npm start
```

The API will be available at:

- http://localhost:3000
- Swagger documentation: http://localhost:3000/api-docs
- OpenAPI JSON: http://localhost:3000/api-docs.json

## API Reference

### Endpoint summary

| Method | Endpoint | Auth | Description | Success |
|---|---|---|---|---|
| GET | `/health` | No | Service health check | 200 |
| POST | `/auth/register` | No | Register a new user | 201 |
| POST | `/auth/login` | No | Log in and receive a JWT | 200 |
| GET | `/auth/me` | Yes | Get the current user | 200 |
| POST | `/tasks` | Yes | Create a task | 201 |
| GET | `/tasks` | Yes | List your tasks (optional `?status=`) | 200 |
| GET | `/tasks/:id` | Yes | Get one of your tasks | 200 |
| PUT | `/tasks/:id` | Yes | Update a task (only the fields you send) | 200 |
| DELETE | `/tasks/:id` | Yes | Delete a task | 200 |

### Data models

**Task**

| Field | Type | Rules | Notes |
|---|---|---|---|
| `_id` | string | generated | MongoDB ObjectId |
| `title` | string | required, 3-100 chars, trimmed | |
| `description` | string | optional, max 500 chars | defaults to `""` |
| `status` | string | one of `pending`, `in-progress`, `completed` | defaults to `pending` |
| `user` | string | set by the server | Owner's user id, taken from the token |
| `createdAt` | date | set once by the server | |
| `updatedAt` | date | updated on every change | |

**User**

| Field | Type | Rules |
|---|---|---|
| `_id` | string | generated |
| `name` | string | required, 2-50 chars |
| `email` | string | required, valid email, unique, stored lowercase |
| `password` | string | required, 8-72 chars, stored as a bcrypt hash, never returned |
| `createdAt`, `updatedAt` | date | set by the server |

### Health

#### `GET /health`

Checks that the API is running. No authentication required.

**Response `200 OK`**

```json
{
  "success": true,
  "message": "API is running",
  "uptime": 123.45,
  "timestamp": "2026-10-23T10:15:30.000Z"
}
```

### Authentication

#### `POST /auth/register`

Creates a user and returns a JWT.

**Request body**

| Field | Type | Required | Rules |
|---|---|---|---|
| `name` | string | yes | 2-50 characters |
| `email` | string | yes | valid email |
| `password` | string | yes | 8-72 characters |

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "password": "password123"
}
```

**Response `201 Created`**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "6718c0aaa3b4c5d6e7f80001",
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "createdAt": "2026-10-23T10:00:00.000Z",
    "updatedAt": "2026-10-23T10:00:00.000Z"
  }
}
```

**Errors:** `400` validation failed, `409` email already registered.

#### `POST /auth/login`

Verifies credentials and returns a JWT.

**Request body**

| Field | Type | Required |
|---|---|---|
| `email` | string | yes |
| `password` | string | yes |

```json
{
  "email": "ada@example.com",
  "password": "password123"
}
```

**Response `200 OK`**: same shape as register (`success`, `token`, `user`).

**Errors:** `400` validation failed, `401` invalid email or password (the same message is used for an unknown email and a wrong password, to prevent user enumeration).

#### `GET /auth/me`

Returns the currently authenticated user. **Requires a token.**

**Response `200 OK`**

```json
{
  "success": true,
  "user": {
    "_id": "6718c0aaa3b4c5d6e7f80001",
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "createdAt": "2026-10-23T10:00:00.000Z",
    "updatedAt": "2026-10-23T10:00:00.000Z"
  }
}
```

**Errors:** `401` missing, invalid, or expired token.

### Tasks

All task endpoints **require a token** and only operate on the authenticated user's tasks. Requesting another user's task returns `404`, so the existence of other users' data is not revealed.

#### `POST /tasks`

Creates a task.

**Request body**

| Field | Type | Required | Rules |
|---|---|---|---|
| `title` | string | yes | 3-100 characters |
| `description` | string | no | up to 500 characters |
| `status` | string | no | `pending` (default), `in-progress`, `completed` |

```json
{
  "title": "Learn Express",
  "description": "Finish the tutorial",
  "status": "pending"
}
```

**Response `201 Created`**

```json
{
  "success": true,
  "data": {
    "_id": "6718c1f2a3b4c5d6e7f80912",
    "title": "Learn Express",
    "description": "Finish the tutorial",
    "status": "pending",
    "user": "6718c0aaa3b4c5d6e7f80001",
    "createdAt": "2026-10-23T10:10:00.000Z",
    "updatedAt": "2026-10-23T10:10:00.000Z"
  }
}
```

**Errors:** `400` validation failed, `401` not authenticated.

#### `GET /tasks`

Lists your tasks, newest first.

**Query parameters**

| Parameter | Required | Description |
|---|---|---|
| `status` | no | Filter by `pending`, `in-progress`, or `completed` |

**Response `200 OK`**

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "6718c1f2a3b4c5d6e7f80912",
      "title": "Learn Express",
      "description": "Finish the tutorial",
      "status": "pending",
      "user": "6718c0aaa3b4c5d6e7f80001",
      "createdAt": "2026-10-23T10:10:00.000Z",
      "updatedAt": "2026-10-23T10:10:00.000Z"
    }
  ]
}
```

**Errors:** `400` invalid status filter, `401` not authenticated.

#### `GET /tasks/:id`

Returns one task.

**Response `200 OK`**

```json
{
  "success": true,
  "data": {
    "_id": "6718c1f2a3b4c5d6e7f80912",
    "title": "Learn Express",
    "description": "Finish the tutorial",
    "status": "pending",
    "user": "6718c0aaa3b4c5d6e7f80001",
    "createdAt": "2026-10-23T10:10:00.000Z",
    "updatedAt": "2026-10-23T10:10:00.000Z"
  }
}
```

**Errors:** `400` invalid id format, `401` not authenticated, `404` task not found.

#### `PUT /tasks/:id`

Updates a task. Send only the fields you want to change; at least one field is required.

**Request body**

| Field | Type | Rules |
|---|---|---|
| `title` | string | 3-100 characters |
| `description` | string | up to 500 characters |
| `status` | string | `pending`, `in-progress`, `completed` |

```json
{ "status": "completed" }
```

**Response `200 OK`**: the updated task (same shape as `GET /tasks/:id`). `updatedAt` changes; `createdAt` does not.

**Errors:** `400` validation failed or invalid id, `401` not authenticated, `404` task not found.

#### `DELETE /tasks/:id`

Deletes a task.

**Response `200 OK`**

```json
{
  "success": true,
  "message": "Task deleted"
}
```

**Errors:** `400` invalid id, `401` not authenticated, `404` task not found.

## Error Handling

All errors use the same JSON shape:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "title", "message": "title is not allowed to be empty" },
    { "field": "status", "message": "status must be one of [pending, in-progress, completed]" }
  ]
}
```

### Status codes

| Code | Meaning | When it happens |
|---|---|---|
| `200` | OK | Successful read, update, delete, login |
| `201` | Created | Successful register or task creation |
| `400` | Bad Request | Validation failed, malformed JSON, invalid id, invalid status filter |
| `401` | Unauthorized | Missing, invalid, or expired token; wrong login credentials |
| `404` | Not Found | Unknown route, or task not found (including tasks owned by someone else) |
| `409` | Conflict | Email already registered |
| `413` | Payload Too Large | Request body larger than 10 KB |
| `500` | Internal Server Error | Unexpected server error (details hidden when `NODE_ENV=production`) |

## Swagger Documentation

The project includes Swagger/OpenAPI documentation for all available endpoints. The docs are available at:

```text
http://localhost:3000/api-docs
```

This is a convenient way to explore the API, test endpoints, and review request/response models.

## Notes

- Task ownership is enforced so each user can only access their own tasks.
- The API validates request payloads before processing to reduce invalid data.
- Passwords are hashed before storage using bcrypt.

## License

This project is licensed under the ISC License.

## Author

This API was developed as a task management backend service for practical application and learning purposes.
