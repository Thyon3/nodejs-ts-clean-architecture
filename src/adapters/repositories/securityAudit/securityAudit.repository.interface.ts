import { SecurityAuditDomain } from '../../../domains/securityAudit.domain';

// Security audit repository interface
export interface ISecurityAuditRepository {
  createAuditLog(auditLog: SecurityAuditDomain): Promise<void>;
  findByUserId(userId: string, limit?: number): Promise<SecurityAuditDomain[]>;
  findByEventType(eventType: string, limit?: number): Promise<SecurityAuditDomain[]>;
  findHighPriorityEvents(limit?: number): Promise<SecurityAuditDomain[]>;
  findRecentEvents(hours: number, limit?: number): Promise<SecurityAuditDomain[]>;
  deleteOldLogs(daysToKeep: number): Promise<void>;
}

// Dependency injection type
export const SECURITY_AUDIT_REPOSITORY_TYPE = {
  SecurityAuditRepository: Symbol.for('SecurityAuditRepository'),
};
