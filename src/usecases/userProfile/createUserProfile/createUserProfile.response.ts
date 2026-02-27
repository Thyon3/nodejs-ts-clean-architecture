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

// CONFLICT - Profile already exists
const PROFILE_EXISTS: IResponseDomain<null> = {
  error: true,
  message: 'USER_PROFILE_ALREADY_EXISTS',
  code: StatusCodes.CONFLICT,
};

// OK - Profile created successfully
const PROFILE_CREATED: IResponseDomain<null> = {
  error: false,
  message: 'USER_PROFILE_CREATED',
  code: StatusCodes.CREATED,
};

export {
  USER_NOT_FOUND,
  PROFILE_EXISTS,
  PROFILE_CREATED,
};

export const createUserProfileResponse = {
  USER_NOT_FOUND,
  PROFILE_EXISTS,
  PROFILE_CREATED,
};
