import winston from 'winston';
import { EnvValidation } from '../config/env.validation';

export interface LogContext {
  userId?: string;
  requestId?: string;
  method?: string;
  url?: string;
  statusCode?: number;
  duration?: number;
  error?: Error;
  [key: string]: any;
}

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

/**
 * Logger configuration utility
 */
export class LoggerConfig {
  private static logger: winston.Logger | null = null;

  /**
   * Get configured Winston logger instance
   * @returns winston.Logger - Configured logger
   */
  static getLogger(): winston.Logger {
    if (this.logger) {
      return this.logger;
    }

    this.logger = this.createLogger();
    return this.logger;
  }

  /**
   * Create and configure Winston logger
   * @returns winston.Logger - New logger instance
   */
  private static createLogger(): winston.Logger {
    const logLevel = EnvValidation.get('LOG_LEVEL');
    const isDevelopment = EnvValidation.isDevelopment();

    const formats = [
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      winston.format.json(),
    ];

    if (isDevelopment) {
      formats.push(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          const metaString = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
          return `${timestamp} [${level}]: ${message} ${metaString}`;
        })
      );
    }

    const transports: winston.transport[] = [
      new winston.transports.Console({
        level: logLevel,
        format: winston.format.combine(...formats),
      }),
    ];

    // Add file logging in production
    if (EnvValidation.isProduction()) {
      transports.push(
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          ),
        }),
        new winston.transports.File({
          filename: 'logs/combined.log',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          ),
        })
      );
    }

    return winston.createLogger({
      level: logLevel,
      transports,
      exitOnError: false,
      handleExceptions: true,
      handleRejections: true,
    });
  }

  /**
   * Log error with context
   * @param message - Error message
   * @param context - Additional context
   */
  static error(message: string, context: LogContext = {}): void {
    this.getLogger().error(message, context);
  }

  /**
   * Log warning with context
   * @param message - Warning message
   * @param context - Additional context
   */
  static warn(message: string, context: LogContext = {}): void {
    this.getLogger().warn(message, context);
  }

  /**
   * Log info with context
   * @param message - Info message
   * @param context - Additional context
   */
  static info(message: string, context: LogContext = {}): void {
    this.getLogger().info(message, context);
  }

  /**
   * Log debug with context
   * @param message - Debug message
   * @param context - Additional context
   */
  static debug(message: string, context: LogContext = {}): void {
    this.getLogger().debug(message, context);
  }

  /**
   * Log HTTP request
   * @param context - Request context
   */
  static logRequest(context: LogContext): void {
    const { method, url, statusCode, duration, userId, requestId } = context;
    
    const message = `${method} ${url} ${statusCode} - ${duration}ms`;
    
    this.info(message, {
      type: 'http_request',
      method,
      url,
      statusCode,
      duration,
      userId,
      requestId,
    });
  }

  /**
   * Log HTTP response
   * @param context - Response context
   */
  static logResponse(context: LogContext): void {
    const { method, url, statusCode, duration, userId, requestId } = context;
    
    const message = `${method} ${url} ${statusCode} - ${duration}ms`;
    
    this.info(message, {
      type: 'http_response',
      method,
      url,
      statusCode,
      duration,
      userId,
      requestId,
    });
  }

  /**
   * Log authentication event
   * @param event - Authentication event type
   * @param context - Additional context
   */
  static logAuth(event: string, context: LogContext = {}): void {
    this.info(`Auth: ${event}`, {
      type: 'auth',
      event,
      ...context,
    });
  }

  /**
   * Log database operation
   * @param operation - Database operation type
   * @param context - Additional context
   */
  static logDatabase(operation: string, context: LogContext = {}): void {
    this.debug(`DB: ${operation}`, {
      type: 'database',
      operation,
      ...context,
    });
  }

  /**
   * Log security event
   * @param event - Security event type
   * @param context - Additional context
   */
  static logSecurity(event: string, context: LogContext = {}): void {
    this.warn(`Security: ${event}`, {
      type: 'security',
      event,
      ...context,
    });
  }

  /**
   * Create child logger with additional context
   * @param context - Default context for child logger
   * @returns winston.Logger - Child logger instance
   */
  static child(context: LogContext): winston.Logger {
    return this.getLogger().child(context);
  }

  /**
   * Reset logger instance (useful for testing)
   */
  static reset(): void {
    this.logger = null;
  }
}
