import { AuthenticateUser } from './authenticateUser';
import { AuthenticateUserRequest } from './authenticateUser.interface';
import { IUserRepository } from '../../../adapters/repositories/user/user.repository.interface';
import { QueryUserDto } from '../../../adapters/repositories/user/dto/queryUser.dto';
import { AuthUtil } from '../../../adapters/util/auth.util';
import { JWTUtil } from '../../../adapters/util/jwt.util';
import { LoggerConfig } from '../../../infrastructure/logging/logger.config';
import { EnvValidation } from '../../../infrastructure/config/env.validation';

// Mock dependencies
jest.mock('../../../adapters/util/auth.util');
jest.mock('../../../adapters/util/jwt.util');
jest.mock('../../../infrastructure/logging/logger.config');
jest.mock('../../../infrastructure/config/env.validation');

describe('AuthenticateUser', () => {
  let authenticateUser: AuthenticateUser;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockAuthUtil: jest.Mocked<typeof AuthUtil>;
  let mockJWTUtil: jest.Mocked<typeof JWTUtil>;
  let mockLoggerConfig: jest.Mocked<typeof LoggerConfig>;
  let mockEnvValidation: jest.Mocked<typeof EnvValidation>;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Create mock repository
    mockUserRepository = {
      createUser: jest.fn(),
      findUser: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
    } as any;

    // Create service instance
    authenticateUser = new AuthenticateUser(mockUserRepository);

    // Get mocked utilities
    mockAuthUtil = AuthUtil as jest.Mocked<typeof AuthUtil>;
    mockJWTUtil = JWTUtil as jest.Mocked<typeof JWTUtil>;
    mockLoggerConfig = LoggerConfig as jest.Mocked<typeof LoggerConfig>;
    mockEnvValidation = EnvValidation as jest.Mocked<typeof EnvValidation>;

    // Setup default mock implementations
    mockEnvValidation.getJWTConfig.mockReturnValue({
      secret: 'test-secret',
      refreshSecret: 'test-refresh-secret',
    });
  });

  describe('execute', () => {
    const validRequest: AuthenticateUserRequest = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should authenticate user successfully with valid credentials', async () => {
      // Arrange
      const mockUser: QueryUserDto = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed-password',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockAuthUtil.comparePassword.mockResolvedValue(true);
      mockJWTUtil.generateTokenPair.mockReturnValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });

      // Act
      const result = await authenticateUser.execute(validRequest);

      // Assert
      expect(result.success).toBe(true);
      expect(result.user).toEqual({
        id: '1',
        email: 'test@example.com',
        role: 'user',
      });
      expect(result.tokens).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockAuthUtil.comparePassword).toHaveBeenCalledWith('password123', 'hashed-password');
      expect(mockJWTUtil.generateTokenPair).toHaveBeenCalledWith(
        {
          userId: '1',
          email: 'test@example.com',
          role: 'user',
        },
        'test-secret'
      );
      expect(mockLoggerConfig.logAuth).toHaveBeenCalledWith('login_success', {
        userId: '1',
        email: 'test@example.com',
      });
    });

    it('should fail authentication when user does not exist', async () => {
      // Arrange
      mockUserRepository.findByEmail.mockResolvedValue(null);

      // Act
      const result = await authenticateUser.execute(validRequest);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials');
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockAuthUtil.comparePassword).not.toHaveBeenCalled();
      expect(mockLoggerConfig.logAuth).toHaveBeenCalledWith('login_failed', {
        email: 'test@example.com',
        reason: 'user_not_found',
      });
    });

    it('should fail authentication when password is incorrect', async () => {
      // Arrange
      const mockUser: QueryUserDto = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed-password',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockAuthUtil.comparePassword.mockResolvedValue(false);

      // Act
      const result = await authenticateUser.execute(validRequest);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials');
      expect(mockAuthUtil.comparePassword).toHaveBeenCalledWith('password123', 'hashed-password');
      expect(mockJWTUtil.generateTokenPair).not.toHaveBeenCalled();
      expect(mockLoggerConfig.logAuth).toHaveBeenCalledWith('login_failed', {
        userId: '1',
        email: 'test@example.com',
        reason: 'invalid_password',
      });
    });

    it('should handle repository errors gracefully', async () => {
      // Arrange
      const repositoryError = new Error('Database connection failed');
      mockUserRepository.findByEmail.mockRejectedValue(repositoryError);

      // Act
      const result = await authenticateUser.execute(validRequest);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Authentication failed');
      expect(mockLoggerConfig.error).toHaveBeenCalledWith('Authentication failed', {
        email: 'test@example.com',
        error: repositoryError,
      });
    });

    it('should handle JWT token generation errors', async () => {
      // Arrange
      const mockUser: QueryUserDto = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed-password',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockAuthUtil.comparePassword.mockResolvedValue(true);
      mockJWTUtil.generateTokenPair.mockImplementation(() => {
        throw new Error('JWT generation failed');
      });

      // Act
      const result = await authenticateUser.execute(validRequest);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Authentication failed');
      expect(mockLoggerConfig.error).toHaveBeenCalledWith('Authentication failed', {
        email: 'test@example.com',
        error: expect.any(Error),
      });
    });
  });

  describe('refreshToken', () => {
    const validRefreshToken = 'valid-refresh-token';

    it('should refresh token successfully with valid refresh token', async () => {
      // Arrange
      const mockUser: QueryUserDto = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed-password',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockDecodedToken = { userId: '1' };

      mockJWTUtil.verifyRefreshToken.mockReturnValue(mockDecodedToken);
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockJWTUtil.generateTokenPair.mockReturnValue({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      });

      // Act
      const result = await authenticateUser.refreshToken(validRefreshToken);

      // Assert
      expect(result.success).toBe(true);
      expect(result.user).toEqual({
        id: '1',
        email: 'test@example.com',
        role: 'user',
      });
      expect(result.tokens).toEqual({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      });
      expect(mockJWTUtil.verifyRefreshToken).toHaveBeenCalledWith(validRefreshToken, 'test-refresh-secret');
      expect(mockUserRepository.findById).toHaveBeenCalledWith('1');
      expect(mockJWTUtil.generateTokenPair).toHaveBeenCalledWith(
        {
          userId: '1',
          email: 'test@example.com',
          role: 'user',
        },
        'test-secret'
      );
      expect(mockLoggerConfig.logAuth).toHaveBeenCalledWith('token_refreshed', {
        userId: '1',
        email: 'test@example.com',
      });
    });

    it('should fail token refresh when refresh token is invalid', async () => {
      // Arrange
      mockJWTUtil.verifyRefreshToken.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // Act
      const result = await authenticateUser.refreshToken(validRefreshToken);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid refresh token');
      expect(mockJWTUtil.verifyRefreshToken).toHaveBeenCalledWith(validRefreshToken, 'test-refresh-secret');
      expect(mockUserRepository.findById).not.toHaveBeenCalled();
      expect(mockLoggerConfig.logSecurity).toHaveBeenCalledWith('invalid_refresh_token', {
        error: expect.any(Error),
      });
    });

    it('should fail token refresh when user does not exist', async () => {
      // Arrange
      const mockDecodedToken = { userId: '1' };

      mockJWTUtil.verifyRefreshToken.mockReturnValue(mockDecodedToken);
      mockUserRepository.findById.mockResolvedValue(null);

      // Act
      const result = await authenticateUser.refreshToken(validRefreshToken);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('User not found');
      expect(mockUserRepository.findById).toHaveBeenCalledWith('1');
      expect(mockJWTUtil.generateTokenPair).not.toHaveBeenCalled();
    });

    it('should fail token refresh when decoded token has no userId', async () => {
      // Arrange
      const mockDecodedToken = {};

      mockJWTUtil.verifyRefreshToken.mockReturnValue(mockDecodedToken);

      // Act
      const result = await authenticateUser.refreshToken(validRefreshToken);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid refresh token');
      expect(mockUserRepository.findById).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    const userId = '1';

    it('should logout user successfully', async () => {
      // Act
      const result = await authenticateUser.logout(userId);

      // Assert
      expect(result).toBe(true);
      expect(mockLoggerConfig.logAuth).toHaveBeenCalledWith('logout', {
        userId: '1',
      });
    });

    it('should handle logout errors gracefully', async () => {
      // Arrange
      mockLoggerConfig.logAuth.mockImplementation(() => {
        throw new Error('Logging failed');
      });

      // Act
      const result = await authenticateUser.logout(userId);

      // Assert
      expect(result).toBe(false);
      expect(mockLoggerConfig.error).toHaveBeenCalledWith('Logout failed', {
        userId: '1',
        error: expect.any(Error),
      });
    });
  });
});
