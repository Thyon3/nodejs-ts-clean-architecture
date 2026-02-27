import { UserProfileDomain } from '../../../domains/userProfile.domain';

// User profile repository interface
export interface IUserProfileRepository {
  createProfile(profile: UserProfileDomain): Promise<void>;
  findByUserId(userId: string): Promise<UserProfileDomain | null>;
  updateProfile(profile: UserProfileDomain): Promise<void>;
  deleteProfile(userId: string): Promise<void>;
  findIncompleteProfiles(): Promise<UserProfileDomain[]>;
}

// Dependency injection type
export const USER_PROFILE_REPOSITORY_TYPE = {
  UserProfileRepository: Symbol.for('UserProfileRepository'),
};
