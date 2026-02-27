import { EmailVerificationDomain } from '../../../domains/emailVerification.domain';

// Email verification repository interface
export interface IEmailVerificationRepository {
  createEmailVerification(emailVerification: EmailVerificationDomain): Promise<void>;
  findByToken(token: string): Promise<EmailVerificationDomain | null>;
  findByUserId(userId: string): Promise<EmailVerificationDomain | null>;
  deleteByUserId(userId: string): Promise<void>;
  markAsVerified(token: string): Promise<void>;
}

// Dependency injection type
export const EMAIL_VERIFICATION_REPOSITORY_TYPE = {
  EmailVerificationRepository: Symbol.for('EmailVerificationRepository'),
};
