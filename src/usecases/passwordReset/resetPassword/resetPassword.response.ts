// Module import
import { StatusCodes } from 'http-status-codes';
// Domain import
import { IResponseDomain } from '../../../domains/response.domain';

const INVALID_TOKEN: IResponseDomain<null> = {
  error: true,
  message: 'INVALID_RESET_TOKEN',
  code: StatusCodes.BAD_REQUEST,
};

const TOKEN_EXPIRED: IResponseDomain<null> = {
  error: true,
  message: 'RESET_TOKEN_EXPIRED',
  code: StatusCodes.BAD_REQUEST,
};

const PASSWORD_RESET: IResponseDomain<null> = {
  error: false,
  message: 'PASSWORD_RESET_SUCCESSFULLY',
  code: StatusCodes.OK,
};

export { INVALID_TOKEN, TOKEN_EXPIRED, PASSWORD_RESET };

export const resetPasswordResponse = {
  INVALID_TOKEN,
  TOKEN_EXPIRED,
  PASSWORD_RESET,
};
