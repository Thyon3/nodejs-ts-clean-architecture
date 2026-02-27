// Module import
import { IResponseDomain } from '../../../domains/response.domain';

// Request interface for updating user profile
export interface IUpdateUserProfileRequest {
  userId: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  timezone?: string;
  language?: string;
  dateOfBirth?: Date;
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
}

// Response interface for updating user profile
export interface IUpdateUserProfileResponse {
  profileId: string;
  isCompleted: boolean;
}

// Service interface
export interface IUpdateUserProfile {
  execute(request: IUpdateUserProfileRequest): Promise<IResponseDomain<IUpdateUserProfileResponse>>;
}

// Dependency injection type
export const UPDATE_USER_PROFILE_TYPE = {
  UpdateUserProfile: Symbol.for('UpdateUserProfile'),
};
