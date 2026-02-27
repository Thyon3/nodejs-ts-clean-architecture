import { injectable } from 'inversify';
import { Repository } from 'typeorm';
import { SessionEntity } from './session.repository.entity';
import { SessionDomain } from '../../../domains/session.domain';
import { 
  ISessionRepository, 
  SESSION_REPOSITORY_TYPE 
} from './session.repository.interface';
import { 
  ILogger,
  LOGGER_TYPE 
} from '../../../infrastructure/logging/logger.interface';
import { inject } from 'inversify';

@injectable()
class SessionRepository implements ISessionRepository {
  constructor(
    @inject(LOGGER_TYPE.Logger) private readonly _logger: ILogger,
    // Note: This would be injected via TypeORM in a real implementation
    private readonly _repository: Repository<SessionEntity>
  ) {}

  public async createSession(session: SessionDomain): Promise<void> {
    try {
      const entity = new SessionEntity();
      entity.sessionId = session.sessionId;
      entity.userId = session.userId;
      entity.deviceInfo = session.deviceInfo;
      entity.ipAddress = session.ipAddress;
      entity.userAgent = session.userAgent;
      entity.isActive = session.isActive;
      entity.createdAt = session.createdAt;
      entity.expiresAt = session.expiresAt;
      entity.lastAccessedAt = session.lastAccessedAt;

      await this._repository.save(entity);
      
      this._logger.info(`Session created for user: ${session.userId}`, {
        sessionId: session.sessionId,
        userId: session.userId,
      });
    } catch (error) {
      this._logger.error('Failed to create session', { error });
      throw error;
    }
  }

  public async findBySessionId(sessionId: string): Promise<SessionDomain | null> {
    try {
      const entity = await this._repository.findOne({ where: { sessionId } });
      
      if (!entity) {
        return null;
      }

      const session = new SessionDomain(
        entity.sessionId,
        entity.userId,
        entity.deviceInfo,
        entity.ipAddress,
        entity.userAgent,
        entity.expiresAt
      );
      
      session.createdAt = entity.createdAt;
      session.lastAccessedAt = entity.lastAccessedAt;
      
      if (!entity.isActive) {
        session.deactivate();
      }

      return session;
    } catch (error) {
      this._logger.error('Failed to find session by ID', { error, sessionId: sessionId.substring(0, 8) + '...' });
      throw error;
    }
  }

  public async findByUserId(userId: string): Promise<SessionDomain[]> {
    try {
      const entities = await this._repository.find({ where: { userId } });
      
      return entities.map(entity => {
        const session = new SessionDomain(
          entity.sessionId,
          entity.userId,
          entity.deviceInfo,
          entity.ipAddress,
          entity.userAgent,
          entity.expiresAt
        );
        
        session.createdAt = entity.createdAt;
        session.lastAccessedAt = entity.lastAccessedAt;
        
        if (!entity.isActive) {
          session.deactivate();
        }
        
        return session;
      });
    } catch (error) {
      this._logger.error('Failed to find sessions by user ID', { error, userId });
      throw error;
    }
  }

  public async updateSession(session: SessionDomain): Promise<void> {
    try {
      await this._repository.update({ sessionId: session.sessionId }, {
        isActive: session.isActive,
        lastAccessedAt: session.lastAccessedAt,
        expiresAt: session.expiresAt,
      });
      
      this._logger.info(`Session updated: ${session.sessionId}`, {
        sessionId: session.sessionId,
        isActive: session.isActive,
      });
    } catch (error) {
      this._logger.error('Failed to update session', { error, sessionId: session.sessionId });
      throw error;
    }
  }

  public async deleteBySessionId(sessionId: string): Promise<void> {
    try {
      await this._repository.delete({ sessionId });
      
      this._logger.info(`Session deleted: ${sessionId}`, {
        sessionId: sessionId.substring(0, 8) + '...',
      });
    } catch (error) {
      this._logger.error('Failed to delete session', { error, sessionId: sessionId.substring(0, 8) + '...' });
      throw error;
    }
  }

  public async deleteByUserId(userId: string): Promise<void> {
    try {
      await this._repository.delete({ userId });
      
      this._logger.info(`All sessions deleted for user: ${userId}`, {
        userId,
      });
    } catch (error) {
      this._logger.error('Failed to delete user sessions', { error, userId });
      throw error;
    }
  }

  public async deactivateExpiredSessions(): Promise<void> {
    try {
      await this._repository
        .createQueryBuilder()
        .update(SessionEntity)
        .set({ isActive: false })
        .where('expires_at < :now', { now: new Date() })
        .execute();
      
      this._logger.info('Expired sessions deactivated');
    } catch (error) {
      this._logger.error('Failed to deactivate expired sessions', { error });
      throw error;
    }
  }
}

export { SessionRepository };
