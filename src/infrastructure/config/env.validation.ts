import Joi from 'joi';

export interface EnvironmentConfig {
  NODE_ENV: string;
  PORT: number;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  DATABASE_HOST: string;
  DATABASE_PORT: number;
  DATABASE_NAME: string;
  DATABASE_USERNAME: string;
  DATABASE_PASSWORD: string;
  LOG_LEVEL: string;
  CORS_ORIGIN: string;
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
}

const environmentSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development')
    .description('Application environment'),
  
  PORT: Joi.number()
    .default(3000)
    .description('Server port'),
  
  JWT_SECRET: Joi.string()
    .required()
    .min(32)
    .description('JWT secret key for access tokens'),
  
  JWT_REFRESH_SECRET: Joi.string()
    .required()
    .min(32)
    .description('JWT secret key for refresh tokens'),
  
  DATABASE_HOST: Joi.string()
    .default('localhost')
    .description('Database host'),
  
  DATABASE_PORT: Joi.number()
    .default(5432)
    .description('Database port'),
  
  DATABASE_NAME: Joi.string()
    .required()
    .description('Database name'),
  
  DATABASE_USERNAME: Joi.string()
    .required()
    .description('Database username'),
  
  DATABASE_PASSWORD: Joi.string()
    .required()
    .description('Database password'),
  
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'debug')
    .default('info')
    .description('Logging level'),
  
  CORS_ORIGIN: Joi.string()
    .default('*')
    .description('CORS allowed origins'),
  
  RATE_LIMIT_WINDOW_MS: Joi.number()
    .default(900000)
    .description('Rate limit window in milliseconds'),
  
  RATE_LIMIT_MAX_REQUESTS: Joi.number()
    .default(100)
    .description('Maximum requests per rate limit window'),
}).unknown(true);

/**
 * Validate environment variables
 */
export class EnvValidation {
  private static validatedConfig: EnvironmentConfig | null = null;

  /**
   * Validate and return environment configuration
   * @returns EnvironmentConfig - Validated environment variables
   * @throws Error - If validation fails
   */
  static validate(): EnvironmentConfig {
    if (this.validatedConfig) {
      return this.validatedConfig;
    }

    const { error, value } = environmentSchema.validate(process.env, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = this.formatValidationError(error);
      throw new Error(`Environment validation failed: ${errorMessage}`);
    }

    this.validatedConfig = value as EnvironmentConfig;
    return this.validatedConfig;
  }

  /**
   * Get specific environment variable with type safety
   * @param key - Environment variable key
   * @returns T - Environment variable value
   */
  static get<T extends keyof EnvironmentConfig>(key: T): EnvironmentConfig[T] {
    const config = this.validate();
    return config[key];
  }

  /**
   * Check if running in development mode
   * @returns boolean - True if in development
   */
  static isDevelopment(): boolean {
    return this.get('NODE_ENV') === 'development';
  }

  /**
   * Check if running in production mode
   * @returns boolean - True if in production
   */
  static isProduction(): boolean {
    return this.get('NODE_ENV') === 'production';
  }

  /**
   * Check if running in test mode
   * @returns boolean - True if in test
   */
  static isTest(): boolean {
    return this.get('NODE_ENV') === 'test';
  }

  /**
   * Get database configuration object
   * @returns object - Database connection config
   */
  static getDatabaseConfig() {
    const config = this.validate();
    return {
      host: config.DATABASE_HOST,
      port: config.DATABASE_PORT,
      database: config.DATABASE_NAME,
      username: config.DATABASE_USERNAME,
      password: config.DATABASE_PASSWORD,
    };
  }

  /**
   * Get JWT configuration object
   * @returns object - JWT configuration
   */
  static getJWTConfig() {
    const config = this.validate();
    return {
      secret: config.JWT_SECRET,
      refreshSecret: config.JWT_REFRESH_SECRET,
    };
  }

  /**
   * Get rate limiting configuration
   * @returns object - Rate limiting config
   */
  static getRateLimitConfig() {
    const config = this.validate();
    return {
      windowMs: config.RATE_LIMIT_WINDOW_MS,
      maxRequests: config.RATE_LIMIT_MAX_REQUESTS,
    };
  }

  /**
   * Format validation error message
   * @param error - Joi validation error
   * @returns string - Formatted error message
   */
  private static formatValidationError(error: Joi.ValidationError): string {
    return error.details
      .map(detail => `${detail.path.join('.')} (${detail.message})`)
      .join(', ');
  }

  /**
   * Reset cached configuration (useful for testing)
   */
  static resetCache(): void {
    this.validatedConfig = null;
  }
}
