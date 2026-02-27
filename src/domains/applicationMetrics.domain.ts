// Application metrics domain interface
interface IApplicationMetricsDomain {
  id: string;
  metricType: 'REQUEST_COUNT' | 'RESPONSE_TIME' | 'ERROR_RATE' | 'CPU_USAGE' | 'MEMORY_USAGE' | 'DATABASE_CONNECTIONS' | 'ACTIVE_USERS';
  value: number;
  unit: string;
  timestamp: Date;
  tags?: Record<string, string>;
  metadata?: Record<string, any>;
}

// Application metrics domain class
class ApplicationMetricsDomain implements IApplicationMetricsDomain {
  id: string;
  metricType: 'REQUEST_COUNT' | 'RESPONSE_TIME' | 'ERROR_RATE' | 'CPU_USAGE' | 'MEMORY_USAGE' | 'DATABASE_CONNECTIONS' | 'ACTIVE_USERS';
  value: number;
  unit: string;
  timestamp: Date;
  tags?: Record<string, string>;
  metadata?: Record<string, any>;

  constructor(
    metricType: IApplicationMetricsDomain['metricType'],
    value: number,
    unit: string,
    tags?: Record<string, string>,
    metadata?: Record<string, any>
  ) {
    const crypto = require('crypto');
    this.id = crypto.randomUUID();
    this.metricType = metricType;
    this.value = value;
    this.unit = unit;
    this.timestamp = new Date();
    this.tags = tags;
    this.metadata = metadata;
  }

  // Check if metric is recent (within last hour)
  isRecent(): boolean {
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    return this.timestamp > oneHourAgo;
  }

  // Check if metric is critical
  isCritical(): boolean {
    switch (this.metricType) {
      case 'ERROR_RATE':
        return this.value > 5; // 5% error rate
      case 'CPU_USAGE':
        return this.value > 80; // 80% CPU usage
      case 'MEMORY_USAGE':
        return this.value > 85; // 85% memory usage
      case 'RESPONSE_TIME':
        return this.value > 1000; // 1000ms response time
      default:
        return false;
    }
  }

  // Get metric severity
  getSeverity(): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (this.isCritical()) return 'CRITICAL';
    
    switch (this.metricType) {
      case 'ERROR_RATE':
        return this.value > 2 ? 'HIGH' : this.value > 1 ? 'MEDIUM' : 'LOW';
      case 'CPU_USAGE':
        return this.value > 60 ? 'HIGH' : this.value > 40 ? 'MEDIUM' : 'LOW';
      case 'MEMORY_USAGE':
        return this.value > 70 ? 'HIGH' : this.value > 50 ? 'MEDIUM' : 'LOW';
      case 'RESPONSE_TIME':
        return this.value > 500 ? 'HIGH' : this.value > 200 ? 'MEDIUM' : 'LOW';
      default:
        return 'LOW';
    }
  }
}

export { IApplicationMetricsDomain, ApplicationMetricsDomain };
