import bcrypt from 'bcrypt';

export class AuthUtil {
  private static readonly SALT_ROUNDS = 12;

  /**
   * Hash a password using bcrypt
   * @param password - Plain text password
   * @returns Promise<string> - Hashed password
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Compare a plain text password with a hashed password
   * @param password - Plain text password
   * @param hashedPassword - Hashed password
   * @returns Promise<boolean> - True if passwords match
   */
  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  /**
   * Generate a random token
   * @param length - Length of the token (default: 32)
   * @returns string - Random token
   */
  static generateToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
