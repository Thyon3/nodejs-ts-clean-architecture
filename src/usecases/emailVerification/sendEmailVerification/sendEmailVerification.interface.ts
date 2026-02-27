// Module import
import { IResponseDomain } from '../../../domains/response.domain';

// Request interface for sending email verification
export interface ISendEmailVerificationRequest {
  userId: string;
  email: string;
}

// Response interface for sending email verification
export interface ISendEmailVerificationResponse {
  token: string;
}

// Service interface
export interface ISendEmailVerification {
  execute(request: ISendEmailVerificationRequest): Promise<IResponseDomain<string>>;
}

// Dependency injection type
export const SEND_EMAIL_VERIFICATION_TYPE = {
  SendEmailVerification: Symbol.for('SendEmailVerification'),
};
