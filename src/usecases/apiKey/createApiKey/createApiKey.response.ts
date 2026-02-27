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

// BAD_REQUEST - Invalid permissions
const INVALID_PERMISSIONS: IResponseDomain<null> = {
  error: true,
  message: 'INVALID_PERMISSIONS',
  code: StatusCodes.BAD_REQUEST,
};

// CONFLICT - API key name already exists
const KEY_NAME_EXISTS: IResponseDomain<null> = {
  error: true,
  message: 'API_KEY_NAME_ALREADY_EXISTS',
  code: StatusCodes.CONFLICT,
};

// CREATED - API key created successfully
const KEY_CREATED: IResponseDomain<null> = {
  error: false,
  message: 'API_KEY_CREATED',
  code: StatusCodes.CREATED,
};

export {
  USER_NOT_FOUND,
  INVALID_PERMISSIONS,
  KEY_NAME_EXISTS,
  KEY_CREATED,
};

export const createApiKeyResponse = {
  USER_NOT_FOUND,
  INVALID_PERMISSIONS,
  KEY_NAME_EXISTS,
  KEY_CREATED,
};
