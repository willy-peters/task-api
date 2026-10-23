// Reusable OpenAPI building blocks referenced via $ref in the *.docs.js files

const components = {
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  },

  parameters: {
    TaskId: {
      in: 'path',
      name: 'id',
      required: true,
      description: 'MongoDB ObjectId of the task',
      schema: { type: 'string', example: '6718c1f2a3b4c5d6e7f80912' },
    },
  },

  schemas: {
    Task: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '6718c1f2a3b4c5d6e7f80912' },
        title: { type: 'string', example: 'Learn Express' },
        description: { type: 'string', example: 'Finish the tutorial' },
        status: {
          type: 'string',
          enum: ['pending', 'in-progress', 'completed'],
          example: 'pending',
        },
        user: { type: 'string', example: '6718c0aaa3b4c5d6e7f80001' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
    TaskInput: {
      type: 'object',
      required: ['title'],
      properties: {
        title: { type: 'string', minLength: 3, maxLength: 100, example: 'Learn Express' },
        description: { type: 'string', maxLength: 500, example: 'Finish the tutorial' },
        status: {
          type: 'string',
          enum: ['pending', 'in-progress', 'completed'],
          default: 'pending',
        },
      },
    },
    TaskUpdate: {
      type: 'object',
      minProperties: 1,
      properties: {
        title: { type: 'string', minLength: 3, maxLength: 100 },
        description: { type: 'string', maxLength: 500 },
        status: { type: 'string', enum: ['pending', 'in-progress', 'completed'] },
      },
    },
    TaskResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: { $ref: '#/components/schemas/Task' },
      },
    },
    TaskListResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        count: { type: 'integer', example: 2 },
        data: { type: 'array', items: { $ref: '#/components/schemas/Task' } },
      },
    },
    RegisterInput: {
      type: 'object',
      required: ['name', 'email', 'password'],
      properties: {
        name: { type: 'string', minLength: 2, maxLength: 50, example: 'Ada Lovelace' },
        email: { type: 'string', format: 'email', example: 'ada@example.com' },
        password: { type: 'string', minLength: 8, maxLength: 72, example: 'password123' },
      },
    },
    LoginInput: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', format: 'email', example: 'ada@example.com' },
        password: { type: 'string', example: 'password123' },
      },
    },
    User: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '6718c0aaa3b4c5d6e7f80001' },
        name: { type: 'string', example: 'Ada Lovelace' },
        email: { type: 'string', example: 'ada@example.com' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
    AuthResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        user: { $ref: '#/components/schemas/User' },
      },
    },
    MeResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        user: { $ref: '#/components/schemas/User' },
      },
    },
    MessageResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Task deleted' },
      },
    },
    Error: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Something went wrong' },
        errors: {
          type: 'array',
          description: 'Present only for validation errors',
          items: {
            type: 'object',
            properties: {
              field: { type: 'string', example: 'title' },
              message: { type: 'string', example: 'title is not allowed to be empty' },
            },
          },
        },
      },
    },
  },

  responses: {
    Unauthorized: {
      description: 'Missing, invalid or expired token',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/Error' },
          example: { success: false, message: 'Not authorized: no token provided' },
        },
      },
    },
    NotFound: {
      description: 'Resource not found',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/Error' },
          example: { success: false, message: 'Task not found' },
        },
      },
    },
    ValidationError: {
      description: 'Invalid request data',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/Error' },
          example: {
            success: false,
            message: 'Validation failed',
            errors: [{ field: 'title', message: 'title is not allowed to be empty' }],
          },
        },
      },
    },
  },
};

export default components;