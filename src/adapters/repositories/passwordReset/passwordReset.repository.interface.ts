import { PasswordResetDomain } from '../../../domains/passwordReset.domain';

// Password reset repository interface
export interface IPasswordResetRepository {
  createPasswordReset(passwordReset: PasswordResetDomain): Promise<void>;
  findByToken(token: string): Promise<PasswordResetDomain | null>;
  findByUserId(userId: string): Promise<PasswordResetDomain | null>;
  deleteByUserId(userId: string): Promise<void>;
  markAsUsed(token: string): Promise<void>;
}

// Dependency injection type
export const PASSWORD_RESET_REPOSITORY_TYPE = {
  PasswordResetRepository: Symbol.for('PasswordResetRepository'),
};
