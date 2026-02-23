import swaggerJsdoc from 'swagger-jsdoc';
import { SwaggerDefinition } from 'swagger-jsdoc';

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Node.js TypeScript Clean Architecture API',
    version: '1.0.0',
    description: 'A robust Node.js API following Clean Architecture principles with TypeScript',
    contact: {
      name: 'API Support',
      email: 'support@example.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
    {
      url: 'https://api.example.com',
      description: 'Production server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT access token',
      },
    },
    schemas: {
      User: {
        type: 'object',
        required: ['id', 'email', 'role'],
        properties: {
          id: {
            type: 'string',
            description: 'User unique identifier',
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address',
          },
          role: {
            type: 'string',
            enum: ['user', 'admin'],
            description: 'User role',
          },
        },
      },
      CreateUserRequest: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: {
            type: 'string',
            minLength: 2,
            maxLength: 100,
            description: 'User full name',
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address',
          },
          password: {
            type: 'string',
            minLength: 8,
            description: 'User password (min 8 characters)',
          },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address',
          },
          password: {
            type: 'string',
            description: 'User password',
          },
        },
      },
      RefreshTokenRequest: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
          refreshToken: {
            type: 'string',
            description: 'JWT refresh token',
          },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            description: 'Request success status',
          },
          message: {
            type: 'string',
            description: 'Response message',
          },
          data: {
            type: 'object',
            properties: {
              user: {
                $ref: '#/components/schemas/User',
              },
              tokens: {
                type: 'object',
                properties: {
                  accessToken: {
                    type: 'string',
                    description: 'JWT access token',
                  },
                  refreshToken: {
                    type: 'string',
                    description: 'JWT refresh token',
                  },
                },
              },
            },
          },
        },
      },
      HealthCheckResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            description: 'Health check success status',
          },
          data: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                enum: ['healthy', 'unhealthy'],
                description: 'Service health status',
              },
              timestamp: {
                type: 'string',
                format: 'date-time',
                description: 'Health check timestamp',
              },
              uptime: {
                type: 'number',
                description: 'Service uptime in milliseconds',
              },
              version: {
                type: 'string',
                description: 'Application version',
              },
              services: {
                type: 'object',
                properties: {
                  database: {
                    type: 'string',
                    enum: ['connected', 'disconnected'],
                    description: 'Database connection status',
                  },
                  memory: {
                    type: 'object',
                    properties: {
                      used: {
                        type: 'number',
                        description: 'Memory used in MB',
                      },
                      total: {
                        type: 'number',
                        description: 'Total memory in MB',
                      },
                      percentage: {
                        type: 'number',
                        description: 'Memory usage percentage',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
            description: 'Request success status',
          },
          message: {
            type: 'string',
            description: 'Error message',
          },
          error: {
            type: 'string',
            description: 'Detailed error information',
          },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  tags: [
    {
      name: 'Authentication',
      description: 'User authentication and token management',
    },
    {
      name: 'Users',
      description: 'User management operations',
    },
    {
      name: 'Health',
      description: 'Health check and monitoring endpoints',
    },
  ],
};

const options = {
  definition: swaggerDefinition,
  apis: [
    './src/adapters/controller/**/*.ts',
    './src/usecases/**/*.ts',
    './src/domains/**/*.ts',
  ],
};

export const swaggerSpec = swaggerJsdoc(options);

/**
 * Swagger configuration utility
 */
export class SwaggerConfig {
  /**
   * Get Swagger specification
   * @returns Swagger specification object
   */
  static getSpec() {
    return swaggerSpec;
  }

  /**
   * Get Swagger UI options
   * @returns Swagger UI configuration options
   */
  static getUiOptions() {
    return {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Node.js TypeScript Clean Architecture API',
      swaggerOptions: {
        persistAuthorization: true,
      },
    };
  }

  /**
   * Get API documentation in JSON format
   * @returns JSON object containing API documentation
   */
  static getJsonSpec() {
    return JSON.stringify(swaggerSpec, null, 2);
  }
}
