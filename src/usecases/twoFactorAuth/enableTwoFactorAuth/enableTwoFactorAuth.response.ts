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

// BAD_REQUEST - Invalid 2FA token
const INVALID_TOKEN: IResponseDomain<null> = {
  error: true,
  message: 'INVALID_TWO_FACTOR_TOKEN',
  code: StatusCodes.BAD_REQUEST,
};

// BAD_REQUEST - 2FA not set up
const NOT_SETUP: IResponseDomain<null> = {
  error: true,
  message: 'TWO_FACTOR_NOT_SETUP',
  code: StatusCodes.BAD_REQUEST,
};

// CONFLICT - 2FA already enabled
const ALREADY_ENABLED: IResponseDomain<null> = {
  error: true,
  message: 'TWO_FACTOR_ALREADY_ENABLED',
  code: StatusCodes.CONFLICT,
};

// OK - 2FA enabled successfully
const ENABLED: IResponseDomain<null> = {
  error: false,
  message: 'TWO_FACTOR_ENABLED',
  code: StatusCodes.OK,
};

export {
  USER_NOT_FOUND,
  INVALID_TOKEN,
  NOT_SETUP,
  ALREADY_ENABLED,
  ENABLED,
};

export const enableTwoFactorAuthResponse = {
  USER_NOT_FOUND,
  INVALID_TOKEN,
  NOT_SETUP,
  ALREADY_ENABLED,
  ENABLED,
};
