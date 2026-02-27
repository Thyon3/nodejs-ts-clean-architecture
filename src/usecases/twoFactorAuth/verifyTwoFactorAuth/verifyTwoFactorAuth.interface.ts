// Module import
import { IResponseDomain } from '../../../domains/response.domain';

// Request interface for verifying 2FA
export interface IVerifyTwoFactorAuthRequest {
  userId: string;
  token: string;
}

// Response interface for verifying 2FA
export interface IVerifyTwoFactorAuthResponse {
  isEnabled: boolean;
}

// Service interface
export interface IVerifyTwoFactorAuth {
  execute(request: IVerifyTwoFactorAuthRequest): Promise<IResponseDomain<IVerifyTwoFactorAuthResponse>>;
}

// Dependency injection type
export const VERIFY_TWO_FACTOR_AUTH_TYPE = {
  VerifyTwoFactorAuth: Symbol.for('VerifyTwoFactorAuth'),
};
