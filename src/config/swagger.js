import swaggerJSDoc from 'swagger-jsdoc';
import components from '../docs/components.js';

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Task Management API',
      version: '1.0.0',
      description:
        'RESTful Task Management API with JWT authentication.\n\n' +
        '**How to authorize:** call `POST /auth/register` or `POST /auth/login`, ' +
        'copy the `token` from the response, click **Authorize** (top right), ' +
        'and paste the token (without the word "Bearer").',
    },
    // Relative URL: works on localhost and in production without changes
    servers: [{ url: '/api/v1', description: 'Current server' }],
    tags: [
      { name: 'Health', description: 'Service status' },
      { name: 'Auth', description: 'Registration and login' },
      { name: 'Tasks', description: 'Task CRUD (requires authentication)' },
    ],
    components,
  },
  // Files containing @openapi comment blocks (run the server from the project root)
  apis: ['./src/docs/*.docs.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;