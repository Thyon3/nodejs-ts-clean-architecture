import { injectable } from 'inversify';
import { Repository } from 'typeorm';
import { TwoFactorAuthEntity } from './twoFactorAuth.repository.entity';
import { TwoFactorAuthDomain } from '../../../domains/twoFactorAuth.domain';
import { 
  ITwoFactorAuthRepository, 
  TWO_FACTOR_AUTH_REPOSITORY_TYPE 
} from './twoFactorAuth.repository.interface';
import { 
  ILogger,
  LOGGER_TYPE 
} from '../../../infrastructure/logging/logger.interface';
import { inject } from 'inversify';

@injectable()
class TwoFactorAuthRepository implements ITwoFactorAuthRepository {
  constructor(
    @inject(LOGGER_TYPE.Logger) private readonly _logger: ILogger,
    // Note: This would be injected via TypeORM in a real implementation
    private readonly _repository: Repository<TwoFactorAuthEntity>
  ) {}

  public async createTwoFactorAuth(twoFactorAuth: TwoFactorAuthDomain): Promise<void> {
    try {
      const entity = new TwoFactorAuthEntity();
      entity.userId = twoFactorAuth.userId;
      entity.secret = twoFactorAuth.secret;
      entity.backupCodes = twoFactorAuth.backupCodes;
      entity.isEnabled = twoFactorAuth.isEnabled;
      entity.createdAt = twoFactorAuth.createdAt;

      await this._repository.save(entity);
      
      this._logger.info(`Two-factor auth created for user: ${twoFactorAuth.userId}`, {
        userId: twoFactorAuth.userId,
      });
    } catch (error) {
      this._logger.error('Failed to create two-factor auth', { error });
      throw error;
    }
  }

  public async findByUserId(userId: string): Promise<TwoFactorAuthDomain | null> {
    try {
      const entity = await this._repository.findOne({ where: { userId } });
      
      if (!entity) {
        return null;
      }

      const twoFactorAuth = new TwoFactorAuthDomain(
        entity.userId,
        entity.secret,
        entity.backupCodes
      );
      
      if (entity.isEnabled) {
        twoFactorAuth.enable();
      }

      return twoFactorAuth;
    } catch (error) {
      this._logger.error('Failed to find two-factor auth by user ID', { error, userId });
      throw error;
    }
  }

  public async updateTwoFactorAuth(twoFactorAuth: TwoFactorAuthDomain): Promise<void> {
    try {
      await this._repository.update({ userId: twoFactorAuth.userId }, {
        isEnabled: twoFactorAuth.isEnabled,
        backupCodes: twoFactorAuth.backupCodes,
      });
      
      this._logger.info(`Two-factor auth updated for user: ${twoFactorAuth.userId}`, {
        userId: twoFactorAuth.userId,
        isEnabled: twoFactorAuth.isEnabled,
      });
    } catch (error) {
      this._logger.error('Failed to update two-factor auth', { error, userId: twoFactorAuth.userId });
      throw error;
    }
  }

  public async deleteByUserId(userId: string): Promise<void> {
    try {
      await this._repository.delete({ userId });
      
      this._logger.info(`Two-factor auth deleted for user: ${userId}`, {
        userId,
      });
    } catch (error) {
      this._logger.error('Failed to delete two-factor auth', { error, userId });
      throw error;
    }
  }
}

export { TwoFactorAuthRepository };
