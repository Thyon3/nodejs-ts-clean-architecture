import { inject, injectable } from 'inversify';
import { AuthenticateUserRequest, AuthenticateUserResponse } from './authenticateUser.interface';
import { IUserRepository } from '../../../adapters/repositories/user/user.repository.interface';
import { AuthUtil } from '../../../adapters/util/auth.util';
import { JWTUtil } from '../../../adapters/util/jwt.util';
import { LoggerConfig } from '../../../infrastructure/logging/logger.config';
import { EnvValidation } from '../../../infrastructure/config/env.validation';

@injectable()
export class AuthenticateUser {
  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository
  ) { }

  /**
   * Authenticate user with email and password
   * @param request - Authentication request
   * @returns Promise<AuthenticateUserResponse> - Authentication result
   */
  async execute(request: AuthenticateUserRequest): Promise<AuthenticateUserResponse> {
    const { email, password } = request;

    try {
      // Find user by email
      const user = await this.userRepository.findByEmail(email);

      if (!user) {
        LoggerConfig.logAuth('login_failed', {
          email,
          reason: 'user_not_found',
        });

        return {
          success: false,
          error: 'Invalid credentials',
        };
      }

      // Verify password
      const isPasswordValid = await AuthUtil.comparePassword(password, user.password);

      if (!isPasswordValid) {
        LoggerConfig.logAuth('login_failed', {
          userId: user.id.toString(),
          email,
          reason: 'invalid_password',
        });

        return {
          success: false,
          error: 'Invalid credentials',
        };
      }

      // Generate JWT tokens
      const jwtConfig = EnvValidation.getJWTConfig();
      const tokens = JWTUtil.generateTokenPair(
        {
          userId: user.id.toString(),
          email: user.email,
          role: user.role || 'user',
        },
        jwtConfig.secret
      );

      LoggerConfig.logAuth('login_success', {
        userId: user.id.toString(),
        email,
      });

      return {
        success: true,
        user: {
          id: user.id.toString(),
          email: user.email,
          role: user.role || 'user',
        },
        tokens,
      };
    } catch (error) {
      LoggerConfig.error('Authentication failed', {
        email,
        error: error as Error,
      });

      return {
        success: false,
        error: 'Authentication failed',
      };
    }
  }

  /**
   * Refresh access token using refresh token
   * @param refreshToken - Refresh token
   * @returns Promise<AuthenticateUserResponse> - Token refresh result
   */
  async refreshToken(refreshToken: string): Promise<AuthenticateUserResponse> {
    try {
      const jwtConfig = EnvValidation.getJWTConfig();
      const decoded = JWTUtil.verifyRefreshToken(refreshToken, jwtConfig.refreshSecret);

      if (!decoded.userId) {
        return {
          success: false,
          error: 'Invalid refresh token',
        };
      }

      // Find user
      const user = await this.userRepository.findById(decoded.userId.toString());

      if (!user) {
        return {
          success: false,
          error: 'User not found',
        };
      }

      // Generate new tokens
      const tokens = JWTUtil.generateTokenPair(
        {
          userId: user.id.toString(),
          email: user.email,
          role: user.role || 'user',
        },
        jwtConfig.secret
      );

      LoggerConfig.logAuth('token_refreshed', {
        userId: user.id.toString(),
        email: user.email,
      });

      return {
        success: true,
        user: {
          id: user.id.toString(),
          email: user.email,
          role: user.role || 'user',
        },
        tokens,
      };
    } catch (error) {
      LoggerConfig.logSecurity('invalid_refresh_token', {
        error: error as Error,
      });

      return {
        success: false,
        error: 'Invalid refresh token',
      };
    }
  }

  /**
   * Logout user (invalidate tokens)
   * @param userId - User ID
   * @returns Promise<boolean> - Logout success
   */
  async logout(userId: string): Promise<boolean> {
    try {
      // In a real implementation, you might want to:
      // 1. Add the token to a blacklist
      // 2. Remove the refresh token from database
      // 3. Log the logout event

      LoggerConfig.logAuth('logout', {
        userId,
      });

      return true;
    } catch (error) {
      LoggerConfig.error('Logout failed', {
        userId,
        error: error as Error,
      });

      return false;
    }
  }
}
