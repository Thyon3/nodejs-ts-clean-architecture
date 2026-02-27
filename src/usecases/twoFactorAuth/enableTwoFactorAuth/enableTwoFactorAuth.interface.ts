// Module import
import { IResponseDomain } from '../../../domains/response.domain';

// Request interface for enabling 2FA
export interface IEnableTwoFactorAuthRequest {
  userId: string;
  token: string;
}

// Response interface for enabling 2FA
export interface IEnableTwoFactorAuthResponse {
  isEnabled: boolean;
  backupCodes: string[];
}

// Service interface
export interface IEnableTwoFactorAuth {
  execute(request: IEnableTwoFactorAuthRequest): Promise<IResponseDomain<IEnableTwoFactorAuthResponse>>;
}

// Dependency injection type
export const ENABLE_TWO_FACTOR_AUTH_TYPE = {
  EnableTwoFactorAuth: Symbol.for('EnableTwoFactorAuth'),
};
