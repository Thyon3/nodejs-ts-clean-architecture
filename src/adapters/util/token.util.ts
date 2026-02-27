import crypto, { BinaryToTextEncoding } from 'crypto';

/**
 * Generate a secure verification token
 * @returns {string} A random 32-character hex string
 */
export function generateVerificationToken(): string {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Generate a secure password reset token
 * @returns {string} A random 32-character hex string
 */
export function generatePasswordResetToken(): string {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Hash a token for secure storage
 * @param {string} token - The token to hash
 * @returns {string} The hashed token
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Verify a token against its hash
 * @param {string} token - The token to verify
 * @param {string} hashedToken - The stored hash
 * @returns {boolean} Whether the token matches
 */
export function verifyToken(token: string, hashedToken: string): boolean {
  const tokenHash = hashToken(token);
  return tokenHash === hashedToken;
}
