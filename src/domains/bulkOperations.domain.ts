// Bulk operations domain interface
interface IBulkOperationsDomain {
  id: string;
  operationType: 'BULK_CREATE' | 'BULK_UPDATE' | 'BULK_DELETE' | 'BULK_EXPORT' | 'BULK_IMPORT';
  entityType: 'USER' | 'ROLE' | 'API_KEY' | 'AUDIT_LOG';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  totalItems: number;
  processedItems: number;
  failedItems: number;
  successItems: number;
  errors?: Array<{ index: number; error: string; item?: any }>;
  filePath?: string;
  filters?: Record<string, any>;
  data?: any[];
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  estimatedCompletion?: Date;
  progressPercentage: number;
}

// Bulk operations domain class
class BulkOperationsDomain implements IBulkOperationsDomain {
  id: string;
  operationType: 'BULK_CREATE' | 'BULK_UPDATE' | 'BULK_DELETE' | 'BULK_EXPORT' | 'BULK_IMPORT';
  entityType: 'USER' | 'ROLE' | 'API_KEY' | 'AUDIT_LOG';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  totalItems: number;
  processedItems: number;
  failedItems: number;
  successItems: number;
  errors?: Array<{ index: number; error: string; item?: any }>;
  filePath?: string;
  filters?: Record<string, any>;
  data?: any[];
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  estimatedCompletion?: Date;
  progressPercentage: number;

  constructor(
    operationType: IBulkOperationsDomain['operationType'],
    entityType: IBulkOperationsDomain['entityType'],
    totalItems: number,
    data?: any[],
    filters?: Record<string, any>
  ) {
    const crypto = require('crypto');
    this.id = crypto.randomUUID();
    this.operationType = operationType;
    this.entityType = entityType;
    this.status = 'PENDING';
    this.totalItems = totalItems;
    this.processedItems = 0;
    this.failedItems = 0;
    this.successItems = 0;
    this.data = data;
    this.filters = filters;
    this.createdAt = new Date();
    this.progressPercentage = 0;
  }

  // Start processing
  startProcessing(): void {
    this.status = 'PROCESSING';
    this.startedAt = new Date();
    this.calculateEstimatedCompletion();
  }

  // Complete operation
  complete(): void {
    this.status = 'COMPLETED';
    this.completedAt = new Date();
    this.progressPercentage = 100;
  }

  // Fail operation
  fail(error?: string): void {
    this.status = 'FAILED';
    this.completedAt = new Date();
    if (error && !this.errors) {
      this.errors = [{ index: 0, error }];
    }
  }

  // Cancel operation
  cancel(): void {
    this.status = 'CANCELLED';
    this.completedAt = new Date();
  }

  // Update progress
  updateProgress(processed: number, success: number, failed: number): void {
    this.processedItems = processed;
    this.successItems = success;
    this.failedItems = failed;
    this.progressPercentage = (processed / this.totalItems) * 100;
    this.calculateEstimatedCompletion();
  }

  // Add error
  addError(index: number, error: string, item?: any): void {
    if (!this.errors) {
      this.errors = [];
    }
    this.errors.push({ index, error, item });
  }

  // Calculate estimated completion time
  private calculateEstimatedCompletion(): void {
    if (!this.startedAt || this.processedItems === 0) {
      return;
    }

    const elapsed = new Date().getTime() - this.startedAt.getTime();
    const avgTimePerItem = elapsed / this.processedItems;
    const remainingItems = this.totalItems - this.processedItems;
    const estimatedRemainingTime = remainingItems * avgTimePerItem;
    
    this.estimatedCompletion = new Date();
    this.estimatedCompletion.setTime(this.estimatedCompletion.getTime() + estimatedRemainingTime);
  }

  // Check if operation is active
  isActive(): boolean {
    return this.status === 'PENDING' || this.status === 'PROCESSING';
  }

  // Check if operation is finished
  isFinished(): boolean {
    return ['COMPLETED', 'FAILED', 'CANCELLED'].includes(this.status);
  }

  // Get success rate
  getSuccessRate(): number {
    if (this.processedItems === 0) return 0;
    return (this.successItems / this.processedItems) * 100;
  }

  // Get error rate
  getErrorRate(): number {
    if (this.processedItems === 0) return 0;
    return (this.failedItems / this.processedItems) * 100;
  }
}

export { IBulkOperationsDomain, BulkOperationsDomain };
