// Module import
import { IResponseDomain } from '../../../domains/response.domain';

// Request interface for creating user profile
export interface ICreateUserProfileRequest {
  userId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  bio?: string;
  timezone?: string;
  language?: string;
  dateOfBirth?: Date;
}

// Response interface for creating user profile
export interface ICreateUserProfileResponse {
  profileId: string;
  isCompleted: boolean;
}

// Service interface
export interface ICreateUserProfile {
  execute(request: ICreateUserProfileRequest): Promise<IResponseDomain<ICreateUserProfileResponse>>;
}

// Dependency injection type
export const CREATE_USER_PROFILE_TYPE = {
  CreateUserProfile: Symbol.for('CreateUserProfile'),
};
