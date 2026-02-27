// Module import
import { IResponseDomain } from '../../../domains/response.domain';

// Request interface for resetting password
export interface IResetPasswordRequest {
  token: string;
  newPassword: string;
}

// Response interface for resetting password
export interface IResetPasswordResponse {
  message: string;
}

// Service interface
export interface IResetPassword {
  execute(request: IResetPasswordRequest): Promise<IResponseDomain<string>>;
}

// Dependency injection type
export const RESET_PASSWORD_TYPE = {
  ResetPassword: Symbol.for('ResetPassword'),
};
