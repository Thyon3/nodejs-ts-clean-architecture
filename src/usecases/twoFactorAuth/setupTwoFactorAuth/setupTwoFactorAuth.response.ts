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

// CONFLICT - 2FA already enabled
const ALREADY_ENABLED: IResponseDomain<null> = {
  error: true,
  message: 'TWO_FACTOR_AUTH_ALREADY_ENABLED',
  code: StatusCodes.CONFLICT,
};

// OK - 2FA setup successful
const SETUP_SUCCESS: IResponseDomain<null> = {
  error: false,
  message: 'TWO_FACTOR_AUTH_SETUP_SUCCESS',
  code: StatusCodes.OK,
};

export {
  USER_NOT_FOUND,
  ALREADY_ENABLED,
  SETUP_SUCCESS,
};

export const setupTwoFactorAuthResponse = {
  USER_NOT_FOUND,
  ALREADY_ENABLED,
  SETUP_SUCCESS,
};
