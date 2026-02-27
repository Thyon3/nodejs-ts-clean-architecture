// Notification system domain interface
interface INotificationDomain {
  id: string;
  userId: string;
  type: 'EMAIL' | 'SMS' | 'PUSH' | 'IN_APP';
  category: 'SECURITY' | 'SYSTEM' | 'MARKETING' | 'USER_ACTION' | 'REMINDER';
  title: string;
  message: string;
  data?: Record<string, any>;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED' | 'READ';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  scheduledAt?: Date;
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  expiresAt?: Date;
  retryCount: number;
  maxRetries: number;
  createdAt: Date;
  updatedAt: Date;
}

// Notification system domain class
class NotificationDomain implements INotificationDomain {
  id: string;
  userId: string;
  type: 'EMAIL' | 'SMS' | 'PUSH' | 'IN_APP';
  category: 'SECURITY' | 'SYSTEM' | 'MARKETING' | 'USER_ACTION' | 'REMINDER';
  title: string;
  message: string;
  data?: Record<string, any>;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED' | 'READ';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  scheduledAt?: Date;
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  expiresAt?: Date;
  retryCount: number;
  maxRetries: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    userId: string,
    type: INotificationDomain['type'],
    category: INotificationDomain['category'],
    title: string,
    message: string,
    priority: INotificationDomain['priority'] = 'MEDIUM',
    data?: Record<string, any>,
    scheduledAt?: Date
  ) {
    const crypto = require('crypto');
    this.id = crypto.randomUUID();
    this.userId = userId;
    this.type = type;
    this.category = category;
    this.title = title;
    this.message = message;
    this.data = data;
    this.status = 'PENDING';
    this.priority = priority;
    this.scheduledAt = scheduledAt;
    this.retryCount = 0;
    this.maxRetries = this.getDefaultMaxRetries();
    this.createdAt = new Date();
    this.updatedAt = new Date();
    
    // Set expiration based on priority
    this.setExpiration();
  }

  // Get default max retries based on notification type
  private getDefaultMaxRetries(): number {
    switch (this.type) {
      case 'EMAIL':
        return 3;
      case 'SMS':
        return 2;
      case 'PUSH':
        return 3;
      case 'IN_APP':
        return 0; // No retries for in-app notifications
      default:
        return 2;
    }
  }

  // Set expiration based on priority
  private setExpiration(): void {
    const now = new Date();
    switch (this.priority) {
      case 'URGENT':
        this.expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
        break;
      case 'HIGH':
        this.expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
        break;
      case 'MEDIUM':
        this.expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
        break;
      case 'LOW':
        this.expiresAt = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000); // 90 days
        break;
    }
  }

  // Check if notification is ready to send
  isReadyToSend(): boolean {
    if (this.status !== 'PENDING') return false;
    if (this.scheduledAt && new Date() < this.scheduledAt) return false;
    if (this.expiresAt && new Date() > this.expiresAt) return false;
    return true;
  }

  // Check if notification can be retried
  canRetry(): boolean {
    return this.status === 'FAILED' && this.retryCount < this.maxRetries;
  }

  // Mark as sent
  markAsSent(): void {
    this.status = 'SENT';
    this.sentAt = new Date();
    this.updatedAt = new Date();
  }

  // Mark as delivered
  markAsDelivered(): void {
    this.status = 'DELIVERED';
    this.deliveredAt = new Date();
    this.updatedAt = new Date();
  }

  // Mark as failed
  markAsFailed(): void {
    this.status = 'FAILED';
    this.retryCount++;
    this.updatedAt = new Date();
  }

  // Mark as read
  markAsRead(): void {
    this.status = 'READ';
    this.readAt = new Date();
    this.updatedAt = new Date();
  }

  // Check if notification is expired
  isExpired(): boolean {
    return this.expiresAt ? new Date() > this.expiresAt : false;
  }

  // Check if notification is urgent
  isUrgent(): boolean {
    return this.priority === 'URGENT';
  }

  // Get delivery status
  getDeliveryStatus(): 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'EXPIRED' {
    if (this.isExpired()) return 'EXPIRED';
    if (this.status === 'READ' || this.status === 'DELIVERED') return 'COMPLETED';
    if (this.status === 'SENT') return 'IN_PROGRESS';
    if (this.status === 'FAILED' && !this.canRetry()) return 'FAILED';
    return 'PENDING';
  }
}

export { INotificationDomain, NotificationDomain };
