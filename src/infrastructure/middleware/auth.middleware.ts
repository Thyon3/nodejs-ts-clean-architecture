import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS_CODES } from 'http-status-codes';
import { JWTUtil, JWTPayload } from '../../adapters/util/jwt.util';

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

export interface AuthenticationOptions {
  required?: boolean;
  roles?: string[];
}

/**
 * Authentication middleware for JWT tokens
 */
export class AuthMiddleware {
  /**
   * Middleware to authenticate requests using JWT tokens
   * @param options - Authentication options
   * @returns Express middleware function
   */
  static authenticate(options: AuthenticationOptions = {}) {
    const { required = true, roles = [] } = options;

    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
      const token = this.extractToken(req);

      if (!token) {
        if (required) {
          res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
            success: false,
            message: 'Access token is required',
          });
          return;
        }
        return next();
      }

      try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
          throw new Error('JWT_SECRET environment variable is not set');
        }

        const payload = JWTUtil.verifyAccessToken(token, secret);
        req.user = payload;

        // Check role-based access control
        if (roles.length > 0 && !roles.includes(payload.role)) {
          res.status(HTTP_STATUS_CODES.FORBIDDEN).json({
            success: false,
            message: 'Insufficient permissions',
          });
          return;
        }

        next();
      } catch (error) {
        res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
          success: false,
          message: 'Invalid or expired token',
        });
      }
    };
  }

  /**
   * Middleware to require authentication
   * @returns Express middleware function
   */
  static requireAuth() {
    return this.authenticate({ required: true });
  }

  /**
   * Middleware to require specific roles
   * @param roles - Array of allowed roles
   * @returns Express middleware function
   */
  static requireRoles(...roles: string[]) {
    return this.authenticate({ required: true, roles });
  }

  /**
   * Optional authentication middleware
   * @returns Express middleware function
   */
  static optionalAuth() {
    return this.authenticate({ required: false });
  }

  /**
   * Extract JWT token from request headers
   * @param req - Express request object
   * @returns string | null - JWT token or null
   */
  private static extractToken(req: Request): string | null {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    return null;
  }
}
