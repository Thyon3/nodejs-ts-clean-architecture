import jwt from 'jsonwebtoken';
import { AuthUtil } from './auth.util';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export class JWTUtil {
  private static readonly ACCESS_TOKEN_EXPIRY = '15m';
  private static readonly REFRESH_TOKEN_EXPIRY = '7d';
  private static readonly ALGORITHM = 'HS256';

  /**
   * Generate access token
   * @param payload - JWT payload
   * @param secret - JWT secret key
   * @returns string - Access token
   */
  static generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>, secret: string): string {
    return jwt.sign(payload, secret, {
      expiresIn: this.ACCESS_TOKEN_EXPIRY,
      algorithm: this.ALGORITHM,
    });
  }

  /**
   * Generate refresh token
   * @param userId - User ID
   * @param secret - JWT secret key
   * @returns string - Refresh token
   */
  static generateRefreshToken(userId: string, secret: string): string {
    const payload = {
      userId,
      type: 'refresh',
      token: AuthUtil.generateToken(64),
    };

    return jwt.sign(payload, secret, {
      expiresIn: this.REFRESH_TOKEN_EXPIRY,
      algorithm: this.ALGORITHM,
    });
  }

  /**
   * Generate token pair (access and refresh)
   * @param payload - JWT payload
   * @param secret - JWT secret key
   * @returns TokenPair - Access and refresh tokens
   */
  static generateTokenPair(payload: Omit<JWTPayload, 'iat' | 'exp'>, secret: string): TokenPair {
    return {
      accessToken: this.generateAccessToken(payload, secret),
      refreshToken: this.generateRefreshToken(payload.userId, secret),
    };
  }

  /**
   * Verify access token
   * @param token - Access token
   * @param secret - JWT secret key
   * @returns JWTPayload - Decoded payload
   */
  static verifyAccessToken(token: string, secret: string): JWTPayload {
    return jwt.verify(token, secret, { algorithms: [this.ALGORITHM] }) as JWTPayload;
  }

  /**
   * Verify refresh token
   * @param token - Refresh token
   * @param secret - JWT secret key
   * @returns any - Decoded payload
   */
  static verifyRefreshToken(token: string, secret: string): any {
    return jwt.verify(token, secret, { algorithms: [this.ALGORITHM] });
  }

  /**
   * Decode token without verification
   * @param token - JWT token
   * @returns JWTPayload | null - Decoded payload or null
   */
  static decodeToken(token: string): JWTPayload | null {
    try {
      return jwt.decode(token) as JWTPayload;
    } catch {
      return null;
    }
  }

  /**
   * Check if token is expired
   * @param token - JWT token
   * @returns boolean - True if expired
   */
  static isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) {
      return true;
    }

    return Date.now() >= decoded.exp * 1000;
  }
}
