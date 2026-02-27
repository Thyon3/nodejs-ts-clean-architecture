// Module import
import { StatusCodes } from 'http-status-codes';
// Domain import
import { IResponseDomain } from '../../../domains/response.domain';

// NOT_FOUND - User not found
const USER_NOT_FOUND: IResponseDomain<null> = {
  error: true,
  message: 'USER_NOT_FOUND',
  code: StatusCodes.NOT_FOUND,
};

// BAD_REQUEST - Invalid password
const INVALID_PASSWORD: IResponseDomain<null> = {
  error: true,
  message: 'INVALID_PASSWORD',
  code: StatusCodes.BAD_REQUEST,
};

// BAD_REQUEST - 2FA not enabled
const NOT_ENABLED: IResponseDomain<null> = {
  error: true,
  message: 'TWO_FACTOR_NOT_ENABLED',
  code: StatusCodes.BAD_REQUEST,
};

// OK - 2FA disabled successfully
const DISABLED: IResponseDomain<null> = {
  error: false,
  message: 'TWO_FACTOR_DISABLED',
  code: StatusCodes.OK,
};

export {
  USER_NOT_FOUND,
  INVALID_PASSWORD,
  NOT_ENABLED,
  DISABLED,
};

export const disableTwoFactorAuthResponse = {
  USER_NOT_FOUND,
  INVALID_PASSWORD,
  NOT_ENABLED,
  DISABLED,
};
