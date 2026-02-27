// Module import
import { StatusCodes } from 'http-status-codes';
// Domain import
import { IResponseDomain } from '../../../domains/response.domain';

/*
 * BAD_REQUEST - User not found
 */
const USER_NOT_FOUND: IResponseDomain<null> = {
  error: true,
  message: 'USER_NOT_FOUND',
  code: StatusCodes.NOT_FOUND,
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
 * INTERNAL_SERVER_ERROR - Failed to send email
 */
const EMAIL_SEND_FAILED: IResponseDomain<null> = {
  error: true,
  message: 'EMAIL_SEND_FAILED',
  code: StatusCodes.INTERNAL_SERVER_ERROR,
};

/*
 * OK - Email sent successfully
 */
const EMAIL_SENT: IResponseDomain<null> = {
  error: false,
  message: 'EMAIL_VERIFICATION_SENT',
  code: StatusCodes.OK,
};

export {
  USER_NOT_FOUND,
  ALREADY_VERIFIED,
  EMAIL_SEND_FAILED,
  EMAIL_SENT,
};

// Export as object for consistency with existing patterns
export const sendEmailVerificationResponse = {
  USER_NOT_FOUND,
  ALREADY_VERIFIED,
  EMAIL_SEND_FAILED,
  EMAIL_SENT,
};
