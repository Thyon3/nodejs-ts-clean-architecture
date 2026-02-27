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
import { IDisableTwoFactorAuthRequest } from './disableTwoFactorAuth.interface';
import { IDisableTwoFactorAuth } from './disableTwoFactorAuth.interface';
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
import CryptoUtil from '../../../adapters/util/crypto.util';
// Response import
import { disableTwoFactorAuthResponse } from './disableTwoFactorAuth.response';

@injectable()
class DisableTwoFactorAuth implements IDisableTwoFactorAuth {
  constructor(
    @inject(LOGGER_TYPE.Logger) private readonly _logger: ILogger,
    @inject(USER_REPOSITORY_TYPE.UserRepository)
    private readonly _userRepository: IUserRepository,
    @inject(TWO_FACTOR_AUTH_REPOSITORY_TYPE.TwoFactorAuthRepository)
    private readonly _twoFactorAuthRepository: ITwoFactorAuthRepository
  ) { }

  public async execute(
    request: IDisableTwoFactorAuthRequest
  ): Promise<ResponseDomain<any> | ResponseErrorDomain> {
    const { userId, password } = request;

    // Check if user exists
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new ResponseErrorDomain({
        name: ErrorNames.NotFoundError,
        error: disableTwoFactorAuthResponse.USER_NOT_FOUND.error,
        message: disableTwoFactorAuthResponse.USER_NOT_FOUND.message,
        code: disableTwoFactorAuthResponse.USER_NOT_FOUND.code,
      });
    }

    // Verify password
    const hashedPassword = CryptoUtil.createHmac(password, process.env.JWT_SECRET || 'default');
    const isPasswordValid = CryptoUtil.verifyHmac(hashedPassword, user.password);
    if (!isPasswordValid) {
      throw new ResponseErrorDomain({
        name: ErrorNames.BadRequestError,
        error: disableTwoFactorAuthResponse.INVALID_PASSWORD.error,
        message: disableTwoFactorAuthResponse.INVALID_PASSWORD.message,
        code: disableTwoFactorAuthResponse.INVALID_PASSWORD.code,
      });
    }

    // Check if 2FA is set up for user
    const twoFactorAuth = await this._twoFactorAuthRepository.findByUserId(userId);
    if (!twoFactorAuth || !twoFactorAuth.isEnabled) {
      throw new ResponseErrorDomain({
        name: ErrorNames.BadRequestError,
        error: disableTwoFactorAuthResponse.NOT_ENABLED.error,
        message: disableTwoFactorAuthResponse.NOT_ENABLED.message,
        code: disableTwoFactorAuthResponse.NOT_ENABLED.code,
      });
    }

    // Disable 2FA
    twoFactorAuth.disable();
    await this._twoFactorAuthRepository.updateTwoFactorAuth(twoFactorAuth);

    this._logger.info(`Two-factor authentication disabled`, {
      userId,
      email: user.email,
    });

    const responseData = {
      isEnabled: false,
    };

    return new ResponseDomain(disableTwoFactorAuthResponse.DISABLED, responseData);
  }
}

export { DisableTwoFactorAuth };
