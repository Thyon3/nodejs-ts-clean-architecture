// Module import
import { inject, injectable } from 'inversify';
// Domain import
import { ResponseErrorDomain, ErrorNames } from '../../../domains/error.domain';
import { ResponseDomain } from '../../../domains/response.domain';
// Infrastructure import
import {
  ILogger,
  LOGGER_TYPE,
} from '../../../infrastructure/logging/logger.interface';
// Interface import
import { IUpdateUserProfileRequest } from './updateUserProfile.interface';
import { IUpdateUserProfile } from './updateUserProfile.interface';
// Repository import
import {
  IUserProfileRepository,
  USER_PROFILE_REPOSITORY_TYPE,
} from '../../../adapters/repositories/userProfile/userProfile.repository.interface';
import {
  IUserRepository,
  USER_REPOSITORY_TYPE,
} from '../../../adapters/repositories/user/user.repository.interface';
// Response import
import { updateUserProfileResponse } from './updateUserProfile.response';

@injectable()
class UpdateUserProfile implements IUpdateUserProfile {
  constructor(
    @inject(LOGGER_TYPE.Logger) private readonly _logger: ILogger,
    @inject(USER_REPOSITORY_TYPE.UserRepository)
    private readonly _userRepository: IUserRepository,
    @inject(USER_PROFILE_REPOSITORY_TYPE.UserProfileRepository)
    private readonly _userProfileRepository: IUserProfileRepository
  ) {}

  public async execute(
    request: IUpdateUserProfileRequest
  ): Promise<ResponseDomain<any> | ResponseErrorDomain> {
    const { userId, ...updates } = request;

    // Check if user exists
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new ResponseErrorDomain({
        name: ErrorNames.NotFoundError,
        error: updateUserProfileResponse.USER_NOT_FOUND.error,
        message: updateUserProfileResponse.USER_NOT_FOUND.message,
        code: updateUserProfileResponse.USER_NOT_FOUND.code,
      });
    }

    // Check if profile exists
    const profile = await this._userProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new ResponseErrorDomain({
        name: ErrorNames.NotFoundError,
        error: updateUserProfileResponse.PROFILE_NOT_FOUND.error,
        message: updateUserProfileResponse.PROFILE_NOT_FOUND.message,
        code: updateUserProfileResponse.PROFILE_NOT_FOUND.code,
      });
    }

    // Update profile
    profile.updateProfile(updates);

    // Save updated profile
    await this._userProfileRepository.updateProfile(profile);

    this._logger.info(`User profile updated`, {
      userId,
      profileId: profile.id,
      fullName: profile.getFullName(),
    });

    const responseData = {
      profileId: profile.id,
      isCompleted: profile.isCompleted,
    };

    return new ResponseDomain(updateUserProfileResponse.PROFILE_UPDATED, responseData);
  }
}

export { UpdateUserProfile };
