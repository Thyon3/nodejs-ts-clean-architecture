// Module import
import { IResponseDomain } from '../../../domains/response.domain';

// Request interface for setting up 2FA
export interface ISetupTwoFactorAuthRequest {
  userId: string;
};

// Response interface for setting up 2FA
export interface ISetupTwoFactorAuthResponse {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

// Service interface
export interface ISetupTwoFactorAuth {
  execute(request: ISetupTwoFactorAuthRequest): Promise<IResponseDomain<ISetupTwoFactorAuthResponse>>;
}

// Dependency injection type
export const SETUP_TWO_FACTOR_AUTH_TYPE = {
  SetupTwoFactorAuth: Symbol.for('SetupTwoFactorAuth'),
};
