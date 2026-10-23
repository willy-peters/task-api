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

## API Endpoints

### Health

- `GET /api/v1/health` — Check whether the API is running

### Authentication

- `POST /api/v1/auth/register` — Register a new user
- `POST /api/v1/auth/login` — Login and receive a JWT
- `GET /api/v1/auth/me` — Get the authenticated user's profile

### Tasks

- `GET /api/v1/tasks` — List tasks for the authenticated user
- `POST /api/v1/tasks` — Create a new task
- `GET /api/v1/tasks/:id` — Retrieve a specific task
- `PUT /api/v1/tasks/:id` — Update a task
- `DELETE /api/v1/tasks/:id` — Delete a task

## Authentication

Protected routes require a valid JWT token in the `Authorization` header:

```http
Authorization: Bearer <token>
```

## Example Requests

### Register User

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Task

```bash
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Learn Express",
    "description": "Finish the tutorial",
    "status": "pending"
  }'
```

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
