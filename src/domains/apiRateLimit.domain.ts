// API rate limiting domain interface
interface IApiRateLimitDomain {
  id: string;
  userId: string;
  endpoint: string;
  requestCount: number;
  windowStart: Date;
  windowEnd: Date;
  limit: number;
  windowMs: number;
}

// API rate limiting domain class
class ApiRateLimitDomain implements IApiRateLimitDomain {
  id: string;
  userId: string;
  endpoint: string;
  requestCount: number;
  windowStart: Date;
  windowEnd: Date;
  limit: number;
  windowMs: number;

  constructor(userId: string, endpoint: string, limit: number, windowMs: number) {
    const crypto = require('crypto');
    this.id = crypto.randomUUID();
    this.userId = userId;
    this.endpoint = endpoint;
    this.requestCount = 0;
    this.limit = limit;
    this.windowMs = windowMs;
    this.resetWindow();
  }

  // Reset the time window
  resetWindow(): void {
    this.windowStart = new Date();
    this.windowEnd = new Date(this.windowStart.getTime() + this.windowMs);
    this.requestCount = 0;
  }

  // Check if the window has expired
  isWindowExpired(): boolean {
    return new Date() > this.windowEnd;
  }

  // Check if the user has exceeded the rate limit
  isLimitExceeded(): boolean {
    if (this.isWindowExpired()) {
      this.resetWindow();
      return false;
    }
    return this.requestCount >= this.limit;
  }

  // Increment the request count
  incrementRequest(): void {
    if (this.isWindowExpired()) {
      this.resetWindow();
    }
    this.requestCount++;
  }

  // Get remaining requests
  getRemainingRequests(): number {
    if (this.isWindowExpired()) {
      return this.limit;
    }
    return Math.max(0, this.limit - this.requestCount);
  }

  // Get time until window reset in milliseconds
  getTimeUntilReset(): number {
    if (this.isWindowExpired()) {
      return 0;
    }
    return this.windowEnd.getTime() - new Date().getTime();
  }
}

export { IApiRateLimitDomain, ApiRateLimitDomain };
