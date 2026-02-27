// Request interfaces for two-factor authentication controller
export interface ISetupTwoFactorAuthRequest {
  userId: string;
}

export interface IVerifyTwoFactorAuthRequest {
  userId: string;
  token: string;
}

export interface IEnableTwoFactorAuthRequest {
  userId: string;
  token: string;
}

export interface IDisableTwoFactorAuthRequest {
  userId: string;
  password: string;
}
