// Module import
import { IResponseDomain } from '../../../domains/response.domain';

// Request interface for sending password reset
export interface ISendPasswordResetRequest {
  email: string;
}

// Response interface for sending password reset
export interface ISendPasswordResetResponse {
  token: string;
}

// Service interface
export interface ISendPasswordReset {
  execute(request: ISendPasswordResetRequest): Promise<IResponseDomain<string>>;
}

// Dependency injection type
export const SEND_PASSWORD_RESET_TYPE = {
  SendPasswordReset: Symbol.for('SendPasswordReset'),
};
