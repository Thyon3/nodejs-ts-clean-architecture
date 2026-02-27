import { injectable } from 'inversify';
import { Repository } from 'typeorm';
import { PasswordResetEntity } from './passwordReset.repository.entity';
import { PasswordResetDomain } from '../../../domains/passwordReset.domain';
import { 
  IPasswordResetRepository, 
  PASSWORD_RESET_REPOSITORY_TYPE 
} from './passwordReset.repository.interface';
import { 
  ILogger,
  LOGGER_TYPE 
} from '../../../infrastructure/logging/logger.interface';
import { inject } from 'inversify';

@injectable()
class PasswordResetRepository implements IPasswordResetRepository {
  constructor(
    @inject(LOGGER_TYPE.Logger) private readonly _logger: ILogger,
    // Note: This would be injected via TypeORM in a real implementation
    private readonly _repository: Repository<PasswordResetEntity>
  ) {}

  public async createPasswordReset(passwordReset: PasswordResetDomain): Promise<void> {
    try {
      const entity = new PasswordResetEntity();
      entity.userId = passwordReset.userId;
      entity.email = passwordReset.email;
      entity.token = passwordReset.token;
      entity.expiresAt = passwordReset.expiresAt;
      entity.isUsed = passwordReset.isUsed;

      await this._repository.save(entity);
      
      this._logger.info(`Password reset created for user: ${passwordReset.userId}`, {
        userId: passwordReset.userId,
        email: passwordReset.email,
      });
    } catch (error) {
      this._logger.error('Failed to create password reset', { error });
      throw error;
    }
  }

  public async findByToken(token: string): Promise<PasswordResetDomain | null> {
    try {
      const entity = await this._repository.findOne({ where: { token } });
      
      if (!entity) {
        return null;
      }

      const passwordReset = new PasswordResetDomain(
        entity.userId,
        entity.email,
        entity.token,
        entity.expiresAt
      );
      
      if (entity.isUsed) {
        passwordReset.markAsUsed();
      }

      return passwordReset;
    } catch (error) {
      this._logger.error('Failed to find password reset by token', { error, token: token.substring(0, 8) + '...' });
      throw error;
    }
  }

  public async findByUserId(userId: string): Promise<PasswordResetDomain | null> {
    try {
      const entity = await this._repository.findOne({ where: { userId } });
      
      if (!entity) {
        return null;
      }

      const passwordReset = new PasswordResetDomain(
        entity.userId,
        entity.email,
        entity.token,
        entity.expiresAt
      );
      
      if (entity.isUsed) {
        passwordReset.markAsUsed();
      }

      return passwordReset;
    } catch (error) {
      this._logger.error('Failed to find password reset by user ID', { error, userId });
      throw error;
    }
  }

  public async deleteByUserId(userId: string): Promise<void> {
    try {
      await this._repository.delete({ userId });
      
      this._logger.info(`Password reset deleted for user: ${userId}`, {
        userId,
      });
    } catch (error) {
      this._logger.error('Failed to delete password reset', { error, userId });
      throw error;
    }
  }

  public async markAsUsed(token: string): Promise<void> {
    try {
      await this._repository.update({ token }, { isUsed: true });
      
      this._logger.info(`Password reset marked as used`, {
        token: token.substring(0, 8) + '...',
      });
    } catch (error) {
      this._logger.error('Failed to mark password reset as used', { error, token: token.substring(0, 8) + '...' });
      throw error;
    }
  }
}

export { PasswordResetRepository };
