// Module import
import { inject, injectable } from 'inversify';
// Domain import
import { ResponseErrorDomain, ErrorNames } from '../../../domains/error.domain';
import { ResponseDomain } from '../../../domains/response.domain';
import { UserProfileDomain } from '../../../domains/userProfile.domain';
// Infrastructure import
import {
  ILogger,
  LOGGER_TYPE,
} from '../../../infrastructure/logging/logger.interface';
// Interface import
import { ICreateUserProfileRequest } from './createUserProfile.interface';
import { ICreateUserProfile } from './createUserProfile.interface';
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
import { createUserProfileResponse } from './createUserProfile.response';

@injectable()
class CreateUserProfile implements ICreateUserProfile {
  constructor(
    @inject(LOGGER_TYPE.Logger) private readonly _logger: ILogger,
    @inject(USER_REPOSITORY_TYPE.UserRepository)
    private readonly _userRepository: IUserRepository,
    @inject(USER_PROFILE_REPOSITORY_TYPE.UserProfileRepository)
    private readonly _userProfileRepository: IUserProfileRepository
  ) {}

  public async execute(
    request: ICreateUserProfileRequest
  ): Promise<ResponseDomain<any> | ResponseErrorDomain> {
    const { userId, firstName, lastName, phone, bio, timezone, language, dateOfBirth } = request;

    // Check if user exists
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new ResponseErrorDomain({
        name: ErrorNames.NotFoundError,
        error: createUserProfileResponse.USER_NOT_FOUND.error,
        message: createUserProfileResponse.USER_NOT_FOUND.message,
        code: createUserProfileResponse.USER_NOT_FOUND.code,
      });
    }

    // Check if profile already exists
    const existingProfile = await this._userProfileRepository.findByUserId(userId);
    if (existingProfile) {
      throw new ResponseErrorDomain({
        name: ErrorNames.ConflictError,
        error: createUserProfileResponse.PROFILE_EXISTS.error,
        message: createUserProfileResponse.PROFILE_EXISTS.message,
        code: createUserProfileResponse.PROFILE_EXISTS.code,
      });
    }

    // Create new user profile
    const profile = new UserProfileDomain(userId, firstName, lastName);
    
    if (phone) profile.phone = phone;
    if (bio) profile.bio = bio;
    if (timezone) profile.timezone = timezone;
    if (language) profile.language = language;
    if (dateOfBirth) profile.dateOfBirth = dateOfBirth;

    // Save profile
    await this._userProfileRepository.createProfile(profile);

    this._logger.info(`User profile created`, {
      userId,
      profileId: profile.id,
      fullName: profile.getFullName(),
    });

    const responseData = {
      profileId: profile.id,
      isCompleted: profile.isCompleted,
    };

    return new ResponseDomain(createUserProfileResponse.PROFILE_CREATED, responseData);
  }
}

export { CreateUserProfile };
