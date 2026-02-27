// Module import
import { IResponseDomain } from '../../../domains/response.domain';

// Request interface for verifying email
export interface IVerifyEmailRequest {
  token: string;
}

// Response interface for verifying email
export interface IVerifyEmailResponse {
  message: string;
}

// Service interface
export interface IVerifyEmail {
  execute(request: IVerifyEmailRequest): Promise<IResponseDomain<string>>;
}

// Dependency injection type
export const VERIFY_EMAIL_TYPE = {
  VerifyEmail: Symbol.for('VerifyEmail'),
};
