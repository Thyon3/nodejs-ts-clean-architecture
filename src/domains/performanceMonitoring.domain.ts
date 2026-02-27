// Performance monitoring domain interface
interface IPerformanceMonitoringDomain {
  id: string;
  endpoint: string;
  method: string;
  responseTime: number;
  statusCode: number;
  timestamp: Date;
  userId?: string;
  userAgent?: string;
  ipAddress?: string;
  memoryUsage?: number;
  cpuUsage?: number;
}

// Performance monitoring domain class
class PerformanceMonitoringDomain implements IPerformanceMonitoringDomain {
  id: string;
  endpoint: string;
  method: string;
  responseTime: number;
  statusCode: number;
  timestamp: Date;
  userId?: string;
  userAgent?: string;
  ipAddress?: string;
  memoryUsage?: number;
  cpuUsage?: number;

  constructor(
    endpoint: string,
    method: string,
    responseTime: number,
    statusCode: number,
    userId?: string,
    userAgent?: string,
    ipAddress?: string
  ) {
    const crypto = require('crypto');
    this.id = crypto.randomUUID();
    this.endpoint = endpoint;
    this.method = method;
    this.responseTime = responseTime;
    this.statusCode = statusCode;
    this.timestamp = new Date();
    this.userId = userId;
    this.userAgent = userAgent;
    this.ipAddress = ipAddress;
  }

  // Check if request is slow
  isSlow(): boolean {
    return this.responseTime > 1000; // 1 second threshold
  }

  // Check if request failed
  isFailed(): boolean {
    return this.statusCode >= 400;
  }

  // Check if request is critical (very slow or server error)
  isCritical(): boolean {
    return this.responseTime > 5000 || this.statusCode >= 500;
  }

  // Get performance grade
  getPerformanceGrade(): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (this.isCritical()) return 'F';
    if (this.isFailed()) return 'D';
    if (this.isSlow()) return 'C';
    if (this.responseTime > 500) return 'B';
    return 'A';
  }
}

export { IPerformanceMonitoringDomain, PerformanceMonitoringDomain };
