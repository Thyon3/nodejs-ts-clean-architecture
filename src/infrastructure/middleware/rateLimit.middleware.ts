import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS_CODES } from 'http-status-codes';

export interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
  message?: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: (req: Request) => string;
}

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

export class RateLimitMiddleware {
  private static stores = new Map<string, RateLimitRecord>();

  /**
   * Create rate limiting middleware
   * @param options - Rate limiting options
   * @returns Express middleware function
   */
  static rateLimit(options: RateLimitOptions) {
    const {
      windowMs,
      maxRequests,
      message = 'Too many requests, please try again later',
      skipSuccessfulRequests = false,
      skipFailedRequests = false,
      keyGenerator = (req) => this.getDefaultKey(req),
    } = options;

    return (req: Request, res: Response, next: NextFunction): void => {
      const key = keyGenerator(req);
      const now = Date.now();
      const record = this.stores.get(key);

      if (!record || now > record.resetTime) {
        // Create new record or reset expired record
        this.stores.set(key, {
          count: 1,
          resetTime: now + windowMs,
        });
        return next();
      }

      // Increment request count
      record.count++;

      // Check if limit exceeded
      if (record.count > maxRequests) {
        res.status(HTTP_STATUS_CODES.TOO_MANY_REQUESTS).json({
          success: false,
          message,
          retryAfter: Math.ceil((record.resetTime - now) / 1000),
        });
        return;
      }

      // Set rate limit headers
      res.set({
        'X-RateLimit-Limit': maxRequests.toString(),
        'X-RateLimit-Remaining': Math.max(0, maxRequests - record.count).toString(),
        'X-RateLimit-Reset': new Date(record.resetTime).toISOString(),
      });

      // Handle response completion for skip options
      if (skipSuccessfulRequests || skipFailedRequests) {
        const originalSend = res.send;
        res.send = function (data) {
          if ((skipSuccessfulRequests && res.statusCode < 400) ||
              (skipFailedRequests && res.statusCode >= 400)) {
            const record = RateLimitMiddleware.stores.get(key);
            if (record) {
              record.count--;
            }
          }
          return originalSend.call(this, data);
        };
      }

      next();
    };
  }

  /**
   * Default key generator using IP address
   * @param req - Express request object
   * @returns string - Rate limit key
   */
  private static getDefaultKey(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'];
    const ip = forwarded ? (forwarded as string).split(',')[0] : req.ip;
    return ip || 'unknown';
  }

  /**
   * Create rate limiter for API endpoints
   * @param maxRequests - Maximum requests per window
   * @param windowMs - Window size in milliseconds
   * @returns Express middleware function
   */
  static createApiLimiter(maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) {
    return this.rateLimit({
      windowMs,
      maxRequests,
      message: 'Too many API requests, please try again later',
    });
  }

  /**
   * Create rate limiter for authentication endpoints
   * @param maxRequests - Maximum requests per window
   * @param windowMs - Window size in milliseconds
   * @returns Express middleware function
   */
  static createAuthLimiter(maxRequests: number = 5, windowMs: number = 15 * 60 * 1000) {
    return this.rateLimit({
      windowMs,
      maxRequests,
      message: 'Too many authentication attempts, please try again later',
      skipSuccessfulRequests: true,
    });
  }

  /**
   * Create rate limiter for password reset endpoints
   * @param maxRequests - Maximum requests per window
   * @param windowMs - Window size in milliseconds
   * @returns Express middleware function
   */
  static createPasswordResetLimiter(maxRequests: number = 3, windowMs: number = 60 * 60 * 1000) {
    return this.rateLimit({
      windowMs,
      maxRequests,
      message: 'Too many password reset attempts, please try again later',
    });
  }

  /**
   * Clean up expired records
   */
  static cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.stores.entries()) {
      if (now > record.resetTime) {
        this.stores.delete(key);
      }
    }
  }
}
