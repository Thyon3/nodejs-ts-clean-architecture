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

// NOT_FOUND - Profile not found
const PROFILE_NOT_FOUND: IResponseDomain<null> = {
  error: true,
  message: 'USER_PROFILE_NOT_FOUND',
  code: StatusCodes.NOT_FOUND,
};

// OK - Profile updated successfully
const PROFILE_UPDATED: IResponseDomain<null> = {
  error: false,
  message: 'USER_PROFILE_UPDATED',
  code: StatusCodes.OK,
};

export {
  USER_NOT_FOUND,
  PROFILE_NOT_FOUND,
  PROFILE_UPDATED,
};

export const updateUserProfileResponse = {
  USER_NOT_FOUND,
  PROFILE_NOT_FOUND,
  PROFILE_UPDATED,
};
