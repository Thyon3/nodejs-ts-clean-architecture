import { TwoFactorAuthDomain } from '../../../domains/twoFactorAuth.domain';

// Two-factor authentication repository interface
export interface ITwoFactorAuthRepository {
  createTwoFactorAuth(twoFactorAuth: TwoFactorAuthDomain): Promise<void>;
  findByUserId(userId: string): Promise<TwoFactorAuthDomain | null>;
  updateTwoFactorAuth(twoFactorAuth: TwoFactorAuthDomain): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
}

// Dependency injection type
export const TWO_FACTOR_AUTH_REPOSITORY_TYPE = {
  TwoFactorAuthRepository: Symbol.for('TwoFactorAuthRepository'),
};
