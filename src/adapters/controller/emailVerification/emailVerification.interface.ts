// Request interfaces for email verification controller
export interface ISendEmailVerificationRequest {
  userId: string;
  email: string;
}

export interface IVerifyEmailRequest {
  token: string;
}
