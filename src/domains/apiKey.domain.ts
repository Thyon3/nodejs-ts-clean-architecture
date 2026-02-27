// API key domain interface
interface IApiKeyDomain {
  id: string;
  userId: string;
  name: string;
  key: string;
  keyHash: string;
  permissions: string[];
  isActive: boolean;
  expiresAt?: Date;
  lastUsedAt?: Date;
  usageCount: number;
  rateLimitPerHour: number;
  createdAt: Date;
  updatedAt: Date;
}

// API key domain class
class ApiKeyDomain implements IApiKeyDomain {
  id: string;
  userId: string;
  name: string;
  key: string;
  keyHash: string;
  permissions: string[];
  isActive: boolean;
  expiresAt?: Date;
  lastUsedAt?: Date;
  usageCount: number;
  rateLimitPerHour: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(userId: string, name: string, permissions: string[], rateLimitPerHour: number = 1000) {
    const crypto = require('crypto');
    this.id = crypto.randomUUID();
    this.userId = userId;
    this.name = name;
    this.key = this.generateApiKey();
    this.keyHash = this.hashApiKey(this.key);
    this.permissions = permissions;
    this.isActive = true;
    this.usageCount = 0;
    this.rateLimitPerHour = rateLimitPerHour;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Generate a new API key
  private generateApiKey(): string {
    const crypto = require('crypto');
    const prefix = 'ak_';
    const randomBytes = crypto.randomBytes(32).toString('hex');
    return `${prefix}${randomBytes}`;
  }

  // Hash API key for storage
  private hashApiKey(key: string): string {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(key).digest('hex');
  }

  // Verify API key
  static verifyApiKey(key: string, keyHash: string): boolean {
    const crypto = require('crypto');
    const hash = crypto.createHash('sha256').update(key).digest('hex');
    return hash === keyHash;
  }

  // Check if API key is expired
  isExpired(): boolean {
    if (!this.expiresAt) {
      return false;
    }
    return new Date() > this.expiresAt;
  }

  // Check if API key is valid
  isValid(): boolean {
    return this.isActive && !this.isExpired();
  }

  // Check if API key has permission
  hasPermission(permission: string): boolean {
    return this.permissions.includes(permission);
  }

  // Deactivate API key
  deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  // Activate API key
  activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  // Record usage
  recordUsage(): void {
    this.usageCount++;
    this.lastUsedAt = new Date();
    this.updatedAt = new Date();
  }

  // Set expiration
  setExpiration(date: Date): void {
    this.expiresAt = date;
    this.updatedAt = new Date();
  }

  // Update permissions
  updatePermissions(permissions: string[]): void {
    this.permissions = permissions;
    this.updatedAt = new Date();
  }

  // Update rate limit
  updateRateLimit(limit: number): void {
    this.rateLimitPerHour = limit;
    this.updatedAt = new Date();
  }
}

export { IApiKeyDomain, ApiKeyDomain };
