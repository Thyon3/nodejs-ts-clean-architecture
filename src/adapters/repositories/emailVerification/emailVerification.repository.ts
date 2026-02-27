import { injectable } from 'inversify';
import { Repository } from 'typeorm';
import { EmailVerificationEntity } from './emailVerification.repository.entity';
import { EmailVerificationDomain } from '../../../domains/emailVerification.domain';
import { 
  IEmailVerificationRepository, 
  EMAIL_VERIFICATION_REPOSITORY_TYPE 
} from './emailVerification.repository.interface';
import { 
  ILogger,
  LOGGER_TYPE 
} from '../../../infrastructure/logging/logger.interface';
import { inject } from 'inversify';

@injectable()
class EmailVerificationRepository implements IEmailVerificationRepository {
  constructor(
    @inject(LOGGER_TYPE.Logger) private readonly _logger: ILogger,
    // Note: This would be injected via TypeORM in a real implementation
    private readonly _repository: Repository<EmailVerificationEntity>
  ) {}

  public async createEmailVerification(emailVerification: EmailVerificationDomain): Promise<void> {
    try {
      const entity = new EmailVerificationEntity();
      entity.userId = emailVerification.userId;
      entity.email = emailVerification.email;
      entity.token = emailVerification.token;
      entity.expiresAt = emailVerification.expiresAt;
      entity.isVerified = emailVerification.isVerified;

      await this._repository.save(entity);
      
      this._logger.info(`Email verification created for user: ${emailVerification.userId}`, {
        userId: emailVerification.userId,
        email: emailVerification.email,
      });
    } catch (error) {
      this._logger.error('Failed to create email verification', { error });
      throw error;
    }
  }

  public async findByToken(token: string): Promise<EmailVerificationDomain | null> {
    try {
      const entity = await this._repository.findOne({ where: { token } });
      
      if (!entity) {
        return null;
      }

      const emailVerification = new EmailVerificationDomain(
        entity.userId,
        entity.email,
        entity.token,
        entity.expiresAt
      );
      
      if (entity.isVerified) {
        emailVerification.markAsVerified();
      }

      return emailVerification;
    } catch (error) {
      this._logger.error('Failed to find email verification by token', { error, token: token.substring(0, 8) + '...' });
      throw error;
    }
  }

  public async findByUserId(userId: string): Promise<EmailVerificationDomain | null> {
    try {
      const entity = await this._repository.findOne({ where: { userId } });
      
      if (!entity) {
        return null;
      }

      const emailVerification = new EmailVerificationDomain(
        entity.userId,
        entity.email,
        entity.token,
        entity.expiresAt
      );
      
      if (entity.isVerified) {
        emailVerification.markAsVerified();
      }

      return emailVerification;
    } catch (error) {
      this._logger.error('Failed to find email verification by user ID', { error, userId });
      throw error;
    }
  }

  public async deleteByUserId(userId: string): Promise<void> {
    try {
      await this._repository.delete({ userId });
      
      this._logger.info(`Email verification deleted for user: ${userId}`, {
        userId,
      });
    } catch (error) {
      this._logger.error('Failed to delete email verification', { error, userId });
      throw error;
    }
  }

  public async markAsVerified(token: string): Promise<void> {
    try {
      await this._repository.update({ token }, { isVerified: true });
      
      this._logger.info(`Email verification marked as verified`, {
        token: token.substring(0, 8) + '...',
      });
    } catch (error) {
      this._logger.error('Failed to mark email verification as verified', { error, token: token.substring(0, 8) + '...' });
      throw error;
    }
  }
}

export { EmailVerificationRepository };
