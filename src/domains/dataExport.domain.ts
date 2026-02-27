// Data export domain interface
interface IDataExportDomain {
  id: string;
  userId: string;
  exportType: 'USER_DATA' | 'AUDIT_LOGS' | 'METRICS' | 'REPORTS';
  format: 'JSON' | 'CSV' | 'XML' | 'PDF';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  filePath?: string;
  fileSize?: number;
  filters?: Record<string, any>;
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
  createdAt: Date;
  completedAt?: Date;
  expiresAt: Date;
}

// Data export domain class
class DataExportDomain implements IDataExportDomain {
  id: string;
  userId: string;
  exportType: 'USER_DATA' | 'AUDIT_LOGS' | 'METRICS' | 'REPORTS';
  format: 'JSON' | 'CSV' | 'XML' | 'PDF';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  filePath?: string;
  fileSize?: number;
  filters?: Record<string, any>;
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
  createdAt: Date;
  completedAt?: Date;
  expiresAt: Date;

  constructor(
    userId: string,
    exportType: IDataExportDomain['exportType'],
    format: IDataExportDomain['format'],
    filters?: Record<string, any>,
    dateRange?: { startDate: Date; endDate: Date }
  ) {
    const crypto = require('crypto');
    this.id = crypto.randomUUID();
    this.userId = userId;
    this.exportType = exportType;
    this.format = format;
    this.status = 'PENDING';
    this.filters = filters;
    this.dateRange = dateRange;
    this.createdAt = new Date();
    this.expiresAt = new Date();
    this.expiresAt.setDate(this.expiresAt.getDate() + 7); // Expires in 7 days
  }

  // Start processing
  startProcessing(): void {
    this.status = 'PROCESSING';
  }

  // Complete export
  completeExport(filePath: string, fileSize: number): void {
    this.status = 'COMPLETED';
    this.filePath = filePath;
    this.fileSize = fileSize;
    this.completedAt = new Date();
  }

  // Fail export
  failExport(): void {
    this.status = 'FAILED';
    this.completedAt = new Date();
  }

  // Check if export is expired
  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  // Check if export can be downloaded
  canDownload(): boolean {
    return this.status === 'COMPLETED' && !this.isExpired();
  }

  // Get download URL
  getDownloadUrl(baseUrl: string): string {
    if (!this.canDownload() || !this.filePath) {
      throw new Error('Export not available for download');
    }
    return `${baseUrl}/exports/${this.id}/download`;
  }

  // Extend expiration
  extendExpiration(days: number): void {
    this.expiresAt = new Date();
    this.expiresAt.setDate(this.expiresAt.getDate() + days);
  }
}

export { IDataExportDomain, DataExportDomain };
