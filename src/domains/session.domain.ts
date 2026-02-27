// Session domain interface
interface ISessionDomain {
  sessionId: string;
  userId: string;
  deviceInfo: string;
  ipAddress: string;
  userAgent: string;
  isActive: boolean;
  createdAt: Date;
  expiresAt: Date;
  lastAccessedAt: Date;
}

// Session domain class
class SessionDomain implements ISessionDomain {
  sessionId: string;
  userId: string;
  deviceInfo: string;
  ipAddress: string;
  userAgent: string;
  isActive: boolean;
  createdAt: Date;
  expiresAt: Date;
  lastAccessedAt: Date;

  constructor(
    sessionId: string,
    userId: string,
    deviceInfo: string,
    ipAddress: string,
    userAgent: string,
    expiresAt: Date
  ) {
    this.sessionId = sessionId;
    this.userId = userId;
    this.deviceInfo = deviceInfo;
    this.ipAddress = ipAddress;
    this.userAgent = userAgent;
    this.isActive = true;
    this.createdAt = new Date();
    this.expiresAt = expiresAt;
    this.lastAccessedAt = new Date();
  }

  // Check if session is expired
  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  // Deactivate session
  deactivate(): void {
    this.isActive = false;
  }

  // Update last accessed time
  updateLastAccessed(): void {
    this.lastAccessedAt = new Date();
  }

  // Extend session expiration
  extendSession(hours: number): void {
    const newExpiresAt = new Date();
    newExpiresAt.setHours(newExpiresAt.getHours() + hours);
    this.expiresAt = newExpiresAt;
  }
}

export { ISessionDomain, SessionDomain };
