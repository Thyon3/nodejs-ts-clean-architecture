// Email verification domain interface
interface IEmailVerificationDomain {
  userId: string;
  email: string;
  token: string;
  expiresAt: Date;
  isVerified: boolean;
}

// Email verification domain class
class EmailVerificationDomain implements IEmailVerificationDomain {
  userId: string;
  email: string;
  token: string;
  expiresAt: Date;
  isVerified: boolean;

  constructor(userId: string, email: string, token: string, expiresAt: Date) {
    this.userId = userId;
    this.email = email;
    this.token = token;
    this.expiresAt = expiresAt;
    this.isVerified = false;
  }

  // Check if token is expired
  isTokenExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  // Mark as verified
  markAsVerified(): void {
    this.isVerified = true;
  }

  // Generate verification URL
  generateVerificationUrl(baseUrl: string): string {
    return `${baseUrl}/auth/verify-email?token=${this.token}`;
  }
}

export { IEmailVerificationDomain, EmailVerificationDomain };
