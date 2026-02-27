// Password reset domain interface
interface IPasswordResetDomain {
  userId: string;
  email: string;
  token: string;
  expiresAt: Date;
  isUsed: boolean;
}

// Password reset domain class
class PasswordResetDomain implements IPasswordResetDomain {
  userId: string;
  email: string;
  token: string;
  expiresAt: Date;
  isUsed: boolean;

  constructor(userId: string, email: string, token: string, expiresAt: Date) {
    this.userId = userId;
    this.email = email;
    this.token = token;
    this.expiresAt = expiresAt;
    this.isUsed = false;
  }

  // Check if token is expired
  isTokenExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  // Mark as used
  markAsUsed(): void {
    this.isUsed = true;
  }

  // Generate reset URL
  generateResetUrl(baseUrl: string): string {
    return `${baseUrl}/auth/reset-password?token=${this.token}`;
  }
}

export { IPasswordResetDomain, PasswordResetDomain };
