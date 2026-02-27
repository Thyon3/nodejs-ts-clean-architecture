// Security audit domain interface
interface ISecurityAuditDomain {
  id: string;
  userId?: string;
  eventType: 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'LOGOUT' | 'PASSWORD_CHANGE' | '2FA_ENABLED' | '2FA_DISABLED' | 'EMAIL_VERIFIED' | 'SECURITY_ALERT';
  eventDescription: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  metadata?: Record<string, any>;
}

// Security audit domain class
class SecurityAuditDomain implements ISecurityAuditDomain {
  id: string;
  userId?: string;
  eventType: 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'LOGOUT' | 'PASSWORD_CHANGE' | '2FA_ENABLED' | '2FA_DISABLED' | 'EMAIL_VERIFIED' | 'SECURITY_ALERT';
  eventDescription: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  metadata?: Record<string, any>;

  constructor(
    eventType: ISecurityAuditDomain['eventType'],
    eventDescription: string,
    ipAddress: string,
    userAgent: string,
    severity: ISecurityAuditDomain['severity'] = 'LOW',
    userId?: string,
    metadata?: Record<string, any>
  ) {
    const crypto = require('crypto');
    this.id = crypto.randomUUID();
    this.eventType = eventType;
    this.eventDescription = eventDescription;
    this.ipAddress = ipAddress;
    this.userAgent = userAgent;
    this.timestamp = new Date();
    this.severity = severity;
    this.userId = userId;
    this.metadata = metadata;
  }

  // Check if event is high priority
  isHighPriority(): boolean {
    return this.severity === 'HIGH' || this.severity === 'CRITICAL';
  }

  // Check if event is recent (within last 24 hours)
  isRecent(): boolean {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
    return this.timestamp > twentyFourHoursAgo;
  }
}

export { ISecurityAuditDomain, SecurityAuditDomain };
