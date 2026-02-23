import { Request, Response } from 'express';
import { HTTP_STATUS_CODES } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { controller, httpPost } from 'inversify-express-utils';
import { AuthenticateUser } from '../../../usecases/user/authenticateUser/authenticateUser';
import { AuthenticateUserRequest } from '../../../usecases/user/authenticateUser/authenticateUser.interface';
import { AuthMiddleware } from '../../../infrastructure/middleware/auth.middleware';
import { RateLimitMiddleware } from '../../../infrastructure/middleware/rateLimit.middleware';
import { LoggerConfig } from '../../../infrastructure/logging/logger.config';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: {
      id: string;
      email: string;
      role: string;
    };
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

@controller('/auth')
@injectable()
export class AuthController {
  constructor(
    @inject(AuthenticateUser) private authenticateUser: AuthenticateUser
  ) { }

  /**
   * User login endpoint
   */
  @httpPost('/login', RateLimitMiddleware.createAuthLimiter())
  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body as LoginRequest;

      // Basic validation
      if (!email || !password) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: 'Email and password are required',
        } as AuthResponse);
        return;
      }

      const result = await this.authenticateUser.execute({ email, password });

      if (result.success) {
        res.status(HTTP_STATUS_CODES.OK).json({
          success: true,
          message: 'Login successful',
          data: result,
        } as AuthResponse);
      } else {
        res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
          success: false,
          message: result.error || 'Authentication failed',
        } as AuthResponse);
      }
    } catch (error) {
      LoggerConfig.error('Login endpoint error', {
        error: error as Error,
        body: req.body,
      });

      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal server error',
      } as AuthResponse);
    }
  }

  /**
   * Refresh access token endpoint
   */
  @httpPost('/refresh', RateLimitMiddleware.createApiLimiter(20, 60000))
  public async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body as RefreshTokenRequest;

      if (!refreshToken) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: 'Refresh token is required',
        } as AuthResponse);
        return;
      }

      const result = await this.authenticateUser.refreshToken(refreshToken);

      if (result.success) {
        res.status(HTTP_STATUS_CODES.OK).json({
          success: true,
          message: 'Token refreshed successfully',
          data: result,
        } as AuthResponse);
      } else {
        res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
          success: false,
          message: result.error || 'Token refresh failed',
        } as AuthResponse);
      }
    } catch (error) {
      LoggerConfig.error('Refresh token endpoint error', {
        error: error as Error,
      });

      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal server error',
      } as AuthResponse);
    }
  }

  /**
   * User logout endpoint
   */
  @httpPost('/logout', AuthMiddleware.requireAuth())
  public async logout(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;

      if (!user || !user.userId) {
        res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
          success: false,
          message: 'User not authenticated',
        } as AuthResponse);
        return;
      }

      const logoutSuccess = await this.authenticateUser.logout(user.userId);

      if (logoutSuccess) {
        res.status(HTTP_STATUS_CODES.OK).json({
          success: true,
          message: 'Logout successful',
        } as AuthResponse);
      } else {
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: 'Logout failed',
        } as AuthResponse);
      }
    } catch (error) {
      LoggerConfig.error('Logout endpoint error', {
        error: error as Error,
        user: (req as any).user,
      });

      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal server error',
      } as AuthResponse);
    }
  }

  /**
   * Get current user profile
   */
  @httpPost('/profile', AuthMiddleware.requireAuth())
  public async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;

      if (!user) {
        res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
          success: false,
          message: 'User not authenticated',
        } as AuthResponse);
        return;
      }

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: 'Profile retrieved successfully',
        data: {
          user: {
            id: user.userId,
            email: user.email,
            role: user.role,
          },
        },
      } as AuthResponse);
    } catch (error) {
      LoggerConfig.error('Profile endpoint error', {
        error: error as Error,
        user: (req as any).user,
      });

      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal server error',
      } as AuthResponse);
    }
  }
}
