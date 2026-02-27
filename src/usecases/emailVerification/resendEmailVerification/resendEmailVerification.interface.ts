// Module import
import { IResponseDomain } from '../../../domains/response.domain';

// Request interface for resending email verification
export interface IResendEmailVerificationRequest {
  email: string;
}

// Response interface for resending email verification
export interface IResendEmailVerificationResponse {
  token: string;
}

// Service interface
export interface IResendEmailVerification {
  execute(request: IResendEmailVerificationRequest): Promise<IResponseDomain<string>>;
}

// Dependency injection type
export const RESEND_EMAIL_VERIFICATION_TYPE = {
  ResendEmailVerification: Symbol.for('ResendEmailVerification'),
};
