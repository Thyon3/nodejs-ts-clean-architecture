// User analytics domain interface
interface IUserAnalyticsDomain {
  id: string;
  userId: string;
  eventType: 'LOGIN' | 'LOGOUT' | 'PAGE_VIEW' | 'FEATURE_USE' | 'ERROR' | 'CONVERSION';
  eventName: string;
  properties?: Record<string, any>;
  timestamp: Date;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
}

// User analytics domain class
class UserAnalyticsDomain implements IUserAnalyticsDomain {
  id: string;
  userId: string;
  eventType: 'LOGIN' | 'LOGOUT' | 'PAGE_VIEW' | 'FEATURE_USE' | 'ERROR' | 'CONVERSION';
  eventName: string;
  properties?: Record<string, any>;
  timestamp: Date;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;

  constructor(
    userId: string,
    eventType: IUserAnalyticsDomain['eventType'],
    eventName: string,
    properties?: Record<string, any>,
    sessionId?: string,
    ipAddress?: string,
    userAgent?: string,
    referrer?: string
  ) {
    const crypto = require('crypto');
    this.id = crypto.randomUUID();
    this.userId = userId;
    this.eventType = eventType;
    this.eventName = eventName;
    this.properties = properties;
    this.timestamp = new Date();
    this.sessionId = sessionId;
    this.ipAddress = ipAddress;
    this.userAgent = userAgent;
    this.referrer = referrer;
  }

  // Check if event is recent (within last hour)
  isRecent(): boolean {
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    return this.timestamp > oneHourAgo;
  }

  // Check if event is a conversion event
  isConversion(): boolean {
    return this.eventType === 'CONVERSION';
  }

  // Check if event is an error
  isError(): boolean {
    return this.eventType === 'ERROR';
  }

  // Get event category
  getCategory(): string {
    switch (this.eventType) {
      case 'LOGIN':
      case 'LOGOUT':
        return 'Authentication';
      case 'PAGE_VIEW':
        return 'Navigation';
      case 'FEATURE_USE':
        return 'Engagement';
      case 'ERROR':
        return 'Error';
      case 'CONVERSION':
        return 'Conversion';
      default:
        return 'Other';
    }
  }
}

export { IUserAnalyticsDomain, UserAnalyticsDomain };
