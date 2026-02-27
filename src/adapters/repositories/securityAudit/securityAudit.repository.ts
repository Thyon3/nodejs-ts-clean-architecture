import { injectable } from 'inversify';
import { Repository } from 'typeorm';
import { SecurityAuditEntity } from './securityAudit.repository.entity';
import { SecurityAuditDomain } from '../../../domains/securityAudit.domain';
import {
  ISecurityAuditRepository,
  SECURITY_AUDIT_REPOSITORY_TYPE
} from './securityAudit.repository.interface';
import {
  ILogger,
  LOGGER_TYPE
} from '../../../infrastructure/logging/logger.interface';
import { inject } from 'inversify';

@injectable()
class SecurityAuditRepository implements ISecurityAuditRepository {
  constructor(
    @inject(LOGGER_TYPE.Logger) private readonly _logger: ILogger,
    // Note: This would be injected via TypeORM in a real implementation
    private readonly _repository: Repository<SecurityAuditEntity>
  ) { }

  public async createAuditLog(auditLog: SecurityAuditDomain): Promise<void> {
    try {
      const entity = new SecurityAuditEntity();
      entity.id = auditLog.id;
      entity.userId = auditLog.userId || null;
      entity.eventType = auditLog.eventType;
      entity.eventDescription = auditLog.eventDescription;
      entity.ipAddress = auditLog.ipAddress;
      entity.userAgent = auditLog.userAgent;
      entity.timestamp = auditLog.timestamp;
      entity.severity = auditLog.severity;
      entity.metadata = auditLog.metadata || null;

      await this._repository.save(entity);

      this._logger.info(`Security audit log created: ${auditLog.eventType}`, {
        auditId: auditLog.id,
        eventType: auditLog.eventType,
        userId: auditLog.userId,
        severity: auditLog.severity,
      });
    } catch (error) {
      this._logger.error('Failed to create security audit log', { error });
      throw error;
    }
  }

  public async findByUserId(userId: string, limit: number = 100): Promise<SecurityAuditDomain[]> {
    try {
      const entities = await this._repository.find({
        where: { userId },
        order: { timestamp: 'DESC' },
        take: limit
      });

      return entities.map(entity => this.mapEntityToDomain(entity));
    } catch (error) {
      this._logger.error('Failed to find audit logs by user ID', { error, userId });
      throw error;
    }
  }

  public async findByEventType(eventType: string, limit: number = 100): Promise<SecurityAuditDomain[]> {
    try {
      const entities = await this._repository.find({
        where: { eventType },
        order: { timestamp: 'DESC' },
        take: limit
      });

      return entities.map(entity => this.mapEntityToDomain(entity));
    } catch (error) {
      this._logger.error('Failed to find audit logs by event type', { error, eventType });
      throw error;
    }
  }

  public async findHighPriorityEvents(limit: number = 50): Promise<SecurityAuditDomain[]> {
    try {
      const entities = await this._repository.find({
        where: { severity: 'HIGH' },
        order: { timestamp: 'DESC' },
        take: limit
      });

      return entities.map(entity => this.mapEntityToDomain(entity));
    } catch (error) {
      this._logger.error('Failed to find high priority audit events', { error });
      throw error;
    }
  }

  public async findRecentEvents(hours: number, limit: number = 100): Promise<SecurityAuditDomain[]> {
    try {
      const cutoffTime = new Date();
      cutoffTime.setHours(cutoffTime.getHours() - hours);

      const entities = await this._repository.find({
        where: { timestamp: { $gte: cutoffTime } },
        order: { timestamp: 'DESC' },
        take: limit
      });

      return entities.map(entity => this.mapEntityToDomain(entity));
    } catch (error) {
      this._logger.error('Failed to find recent audit events', { error, hours });
      throw error;
    }
  }

  public async deleteOldLogs(daysToKeep: number): Promise<void> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const result = await this._repository.delete({
        timestamp: { $lt: cutoffDate }
      });

      this._logger.info(`Deleted old security audit logs`, {
        deletedCount: result.affected,
        cutoffDate,
      });
    } catch (error) {
      this._logger.error('Failed to delete old audit logs', { error, daysToKeep });
      throw error;
    }
  }

  private mapEntityToDomain(entity: SecurityAuditEntity): SecurityAuditDomain {
    const auditLog = new SecurityAuditDomain(
      entity.eventType as any,
      entity.eventDescription,
      entity.ipAddress,
      entity.userAgent,
      entity.severity as any,
      entity.userId || undefined,
      entity.metadata || undefined
    );

    auditLog.id = entity.id;
    auditLog.timestamp = entity.timestamp;

    return auditLog;
  }
}

export { SecurityAuditRepository };
