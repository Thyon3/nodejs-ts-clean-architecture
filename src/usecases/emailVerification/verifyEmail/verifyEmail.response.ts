// Module import
import { StatusCodes } from 'http-status-codes';
// Domain import
import { IResponseDomain } from '../../../domains/response.domain';

/*
 * BAD_REQUEST - Invalid token
 */
const INVALID_TOKEN: IResponseDomain<null> = {
  error: true,
  message: 'INVALID_VERIFICATION_TOKEN',
  code: StatusCodes.BAD_REQUEST,
};

/*
 * BAD_REQUEST - Token expired
 */
const TOKEN_EXPIRED: IResponseDomain<null> = {
  error: true,
  message: 'VERIFICATION_TOKEN_EXPIRED',
  code: StatusCodes.BAD_REQUEST,
};

/*
 * BAD_REQUEST - Email already verified
 */
const ALREADY_VERIFIED: IResponseDomain<null> = {
  error: true,
  message: 'EMAIL_ALREADY_VERIFIED',
  code: StatusCodes.BAD_REQUEST,
};

/*
 * OK - Email verified successfully
 */
const VERIFIED: IResponseDomain<null> = {
  error: false,
  message: 'EMAIL_VERIFIED_SUCCESSFULLY',
  code: StatusCodes.OK,
};

export {
  INVALID_TOKEN,
  TOKEN_EXPIRED,
  ALREADY_VERIFIED,
  VERIFIED,
};

// Export as object for consistency with existing patterns
export const verifyEmailResponse = {
  INVALID_TOKEN,
  TOKEN_EXPIRED,
  ALREADY_VERIFIED,
  VERIFIED,
};
