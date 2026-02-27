// Request interfaces for password reset controller
export interface ISendPasswordResetRequest {
  email: string;
}

export interface IResetPasswordRequest {
  token: string;
  newPassword: string;
}
