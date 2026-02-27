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
import { IEnableTwoFactorAuthRequest } from './enableTwoFactorAuth.interface';
import { IEnableTwoFactorAuth } from './enableTwoFactorAuth.interface';
// Repository import
import {
  ITwoFactorAuthRepository,
  TWO_FACTOR_AUTH_REPOSITORY_TYPE,
} from '../../../adapters/repositories/twoFactorAuth/twoFactorAuth.repository.interface';
import {
  IUserRepository,
  USER_REPOSITORY_TYPE,
} from '../../../adapters/repositories/user/user.repository.interface';
// Util import
import { verifyTOTPToken } from '../../../adapters/util/totp.util';
// Response import
import { enableTwoFactorAuthResponse } from './enableTwoFactorAuth.response';

@injectable()
class EnableTwoFactorAuth implements IEnableTwoFactorAuth {
  constructor(
    @inject(LOGGER_TYPE.Logger) private readonly _logger: ILogger,
    @inject(USER_REPOSITORY_TYPE.UserRepository)
    private readonly _userRepository: IUserRepository,
    @inject(TWO_FACTOR_AUTH_REPOSITORY_TYPE.TwoFactorAuthRepository)
    private readonly _twoFactorAuthRepository: ITwoFactorAuthRepository
  ) {}

  public async execute(
    request: IEnableTwoFactorAuthRequest
  ): Promise<ResponseDomain<any> | ResponseErrorDomain> {
    const { userId, token } = request;

    // Check if user exists
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new ResponseErrorDomain({
        name: ErrorNames.NotFoundError,
        error: enableTwoFactorAuthResponse.USER_NOT_FOUND.error,
        message: enableTwoFactorAuthResponse.USER_NOT_FOUND.message,
        code: enableTwoFactorAuthResponse.USER_NOT_FOUND.code,
      });
    }

    // Check if 2FA is set up for user
    const twoFactorAuth = await this._twoFactorAuthRepository.findByUserId(userId);
    if (!twoFactorAuth) {
      throw new ResponseErrorDomain({
        name: ErrorNames.BadRequestError,
        error: enableTwoFactorAuthResponse.NOT_SETUP.error,
        message: enableTwoFactorAuthResponse.NOT_SETUP.message,
        code: enableTwoFactorAuthResponse.NOT_SETUP.code,
      });
    }

    // Check if 2FA is already enabled
    if (twoFactorAuth.isEnabled) {
      throw new ResponseErrorDomain({
        name: ErrorNames.ConflictError,
        error: enableTwoFactorAuthResponse.ALREADY_ENABLED.error,
        message: enableTwoFactorAuthResponse.ALREADY_ENABLED.message,
        code: enableTwoFactorAuthResponse.ALREADY_ENABLED.code,
      });
    }

    // Verify TOTP token
    const isValidToken = verifyTOTPToken(token, twoFactorAuth.secret);
    if (!isValidToken) {
      throw new ResponseErrorDomain({
        name: ErrorNames.BadRequestError,
        error: enableTwoFactorAuthResponse.INVALID_TOKEN.error,
        message: enableTwoFactorAuthResponse.INVALID_TOKEN.message,
        code: enableTwoFactorAuthResponse.INVALID_TOKEN.code,
      });
    }

    // Enable 2FA
    twoFactorAuth.enable();
    await this._twoFactorAuthRepository.updateTwoFactorAuth(twoFactorAuth);

    this._logger.info(`Two-factor authentication enabled`, {
      userId,
      email: user.email,
    });

    const responseData = {
      isEnabled: true,
      backupCodes: twoFactorAuth.backupCodes,
    };

    return new ResponseDomain(enableTwoFactorAuthResponse.ENABLED, responseData);
  }
}

export { EnableTwoFactorAuth };
