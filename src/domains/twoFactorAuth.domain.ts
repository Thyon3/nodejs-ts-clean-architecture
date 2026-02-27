// Two-factor authentication domain interface
interface ITwoFactorAuthDomain {
  userId: string;
  secret: string;
  backupCodes: string[];
  isEnabled: boolean;
  createdAt: Date;
}

// Two-factor authentication domain class
class TwoFactorAuthDomain implements ITwoFactorAuthDomain {
  userId: string;
  secret: string;
  backupCodes: string[];
  isEnabled: boolean;
  createdAt: Date;

  constructor(userId: string, secret: string, backupCodes: string[]) {
    this.userId = userId;
    this.secret = secret;
    this.backupCodes = backupCodes;
    this.isEnabled = false;
    this.createdAt = new Date();
  }

  // Enable 2FA
  enable(): void {
    this.isEnabled = true;
  }

  // Disable 2FA
  disable(): void {
    this.isEnabled = false;
  }

  // Check if backup code is valid
  isBackupCodeValid(code: string): boolean {
    return this.backupCodes.includes(code);
  }

  // Remove used backup code
  removeBackupCode(code: string): void {
    const index = this.backupCodes.indexOf(code);
    if (index > -1) {
      this.backupCodes.splice(index, 1);
    }
  }

  // Generate backup codes
  static generateBackupCodes(): string[] {
    const crypto = require('crypto');
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      codes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
    }
    return codes;
  }
}

export { ITwoFactorAuthDomain, TwoFactorAuthDomain };
