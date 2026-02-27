// Module import
import { StatusCodes } from 'http-status-codes';
// Domain import
import { IResponseDomain } from '../../../domains/response.domain';

/*
 * NOT_FOUND - User not found
 */
const USER_NOT_FOUND: IResponseDomain<null> = {
  error: true,
  message: 'USER_NOT_FOUND',
  code: StatusCodes.NOT_FOUND,
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
  message: 'PASSWORD_RESET_EMAIL_SENT',
  code: StatusCodes.OK,
};

export {
  USER_NOT_FOUND,
  EMAIL_SEND_FAILED,
  EMAIL_SENT,
};

// Export as object for consistency with existing patterns
export const sendPasswordResetResponse = {
  USER_NOT_FOUND,
  EMAIL_SEND_FAILED,
  EMAIL_SENT,
};
