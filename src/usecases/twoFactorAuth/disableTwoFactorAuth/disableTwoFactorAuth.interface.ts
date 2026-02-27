// Module import
import { IResponseDomain } from '../../../domains/response.domain';

// Request interface for disabling 2FA
export interface IDisableTwoFactorAuthRequest {
  userId: string;
  password: string;
}

// Response interface for disabling 2FA
export interface IDisableTwoFactorAuthResponse {
  isEnabled: boolean;
}

// Service interface
export interface IDisableTwoFactorAuth {
  execute(request: IDisableTwoFactorAuthRequest): Promise<IResponseDomain<IDisableTwoFactorAuthResponse>>;
}

// Dependency injection type
export const DISABLE_TWO_FACTOR_AUTH_TYPE = {
  DisableTwoFactorAuth: Symbol.for('DisableTwoFactorAuth'),
};
