// Module import
import { inject, injectable } from 'inversify';
// Domain import
import { SecurityAuditDomain } from '../../../domains/securityAudit.domain';
// Infrastructure import
import {
  ILogger,
  LOGGER_TYPE,
} from '../../../infrastructure/logging/logger.interface';
// Repository import
import {
  ISecurityAuditRepository,
  SECURITY_AUDIT_REPOSITORY_TYPE,
} from '../../../adapters/repositories/securityAudit/securityAudit.repository.interface';

// Service interface
export interface ISecurityAuditService {
  logLoginSuccess(userId: string, ipAddress: string, userAgent: string): Promise<void>;
  logLoginFailed(email: string, ipAddress: string, userAgent: string, reason?: string): Promise<void>;
  logLogout(userId: string, ipAddress: string, userAgent: string): Promise<void>;
  logPasswordChange(userId: string, ipAddress: string, userAgent: string): Promise<void>;
  log2FAEnabled(userId: string, ipAddress: string, userAgent: string): Promise<void>;
  log2FADisabled(userId: string, ipAddress: string, userAgent: string): Promise<void>;
  logEmailVerified(userId: string, ipAddress: string, userAgent: string): Promise<void>;
  logSecurityAlert(description: string, ipAddress: string, userAgent: string, severity?: 'MEDIUM' | 'HIGH' | 'CRITICAL', userId?: string): Promise<void>;
}

// Dependency injection type
export const SECURITY_AUDIT_SERVICE_TYPE = {
  SecurityAuditService: Symbol.for('SecurityAuditService'),
};

@injectable()
class SecurityAuditService implements ISecurityAuditService {
  constructor(
    @inject(LOGGER_TYPE.Logger) private readonly _logger: ILogger,
    @inject(SECURITY_AUDIT_REPOSITORY_TYPE.SecurityAuditRepository)
    private readonly _auditRepository: ISecurityAuditRepository
  ) {}

  public async logLoginSuccess(userId: string, ipAddress: string, userAgent: string): Promise<void> {
    const auditLog = new SecurityAuditDomain(
      'LOGIN_SUCCESS',
      'User logged in successfully',
      ipAddress,
      userAgent,
      'LOW',
      userId
    );

    await this._auditRepository.createAuditLog(auditLog);
  }

  public async logLoginFailed(email: string, ipAddress: string, userAgent: string, reason?: string): Promise<void> {
    const description = reason ? `Login failed for ${email}: ${reason}` : `Login failed for ${email}`;
    const auditLog = new SecurityAuditDomain(
      'LOGIN_FAILED',
      description,
      ipAddress,
      userAgent,
      'MEDIUM',
      undefined,
      { email, reason }
    );

    await this._auditRepository.createAuditLog(auditLog);
  }

  public async logLogout(userId: string, ipAddress: string, userAgent: string): Promise<void> {
    const auditLog = new SecurityAuditDomain(
      'LOGOUT',
      'User logged out',
      ipAddress,
      userAgent,
      'LOW',
      userId
    );

    await this._auditRepository.createAuditLog(auditLog);
  }

  public async logPasswordChange(userId: string, ipAddress: string, userAgent: string): Promise<void> {
    const auditLog = new SecurityAuditDomain(
      'PASSWORD_CHANGE',
      'User password changed',
      ipAddress,
      userAgent,
      'HIGH',
      userId
    );

    await this._auditRepository.createAuditLog(auditLog);
  }

  public async log2FAEnabled(userId: string, ipAddress: string, userAgent: string): Promise<void> {
    const auditLog = new SecurityAuditDomain(
      '2FA_ENABLED',
      'Two-factor authentication enabled',
      ipAddress,
      userAgent,
      'MEDIUM',
      userId
    );

    await this._auditRepository.createAuditLog(auditLog);
  }

  public async log2FADisabled(userId: string, ipAddress: string, userAgent: string): Promise<void> {
    const auditLog = new SecurityAuditDomain(
      '2FA_DISABLED',
      'Two-factor authentication disabled',
      ipAddress,
      userAgent,
      'HIGH',
      userId
    );

    await this._auditRepository.createAuditLog(auditLog);
  }

  public async logEmailVerified(userId: string, ipAddress: string, userAgent: string): Promise<void> {
    const auditLog = new SecurityAuditDomain(
      'EMAIL_VERIFIED',
      'User email verified',
      ipAddress,
      userAgent,
      'LOW',
      userId
    );

    await this._auditRepository.createAuditLog(auditLog);
  }

  public async logSecurityAlert(
    description: string, 
    ipAddress: string, 
    userAgent: string, 
    severity: 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM',
    userId?: string
  ): Promise<void> {
    const auditLog = new SecurityAuditDomain(
      'SECURITY_ALERT',
      description,
      ipAddress,
      userAgent,
      severity,
      userId
    );

    await this._auditRepository.createAuditLog(auditLog);
  }
}

export { SecurityAuditService };
