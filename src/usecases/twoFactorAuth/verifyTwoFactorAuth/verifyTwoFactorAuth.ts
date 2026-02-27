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
import { IVerifyTwoFactorAuthRequest } from './verifyTwoFactorAuth.interface';
import { IVerifyTwoFactorAuth } from './verifyTwoFactorAuth.interface';
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
import { verifyTwoFactorAuthResponse } from './verifyTwoFactorAuth.response';

@injectable()
class VerifyTwoFactorAuth implements IVerifyTwoFactorAuth {
  constructor(
    @inject(LOGGER_TYPE.Logger) private readonly _logger: ILogger,
    @inject(USER_REPOSITORY_TYPE.UserRepository)
    private readonly _userRepository: IUserRepository,
    @inject(TWO_FACTOR_AUTH_REPOSITORY_TYPE.TwoFactorAuthRepository)
    private readonly _twoFactorAuthRepository: ITwoFactorAuthRepository
  ) {}

  public async execute(
    request: IVerifyTwoFactorAuthRequest
  ): Promise<ResponseDomain<any> | ResponseErrorDomain> {
    const { userId, token } = request;

    // Check if user exists
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new ResponseErrorDomain({
        name: ErrorNames.NotFoundError,
        error: verifyTwoFactorAuthResponse.USER_NOT_FOUND.error,
        message: verifyTwoFactorAuthResponse.USER_NOT_FOUND.message,
        code: verifyTwoFactorAuthResponse.USER_NOT_FOUND.code,
      });
    }

    // Check if 2FA is set up for user
    const twoFactorAuth = await this._twoFactorAuthRepository.findByUserId(userId);
    if (!twoFactorAuth) {
      throw new ResponseErrorDomain({
        name: ErrorNames.BadRequestError,
        error: verifyTwoFactorAuthResponse.NOT_SETUP.error,
        message: verifyTwoFactorAuthResponse.NOT_SETUP.message,
        code: verifyTwoFactorAuthResponse.NOT_SETUP.code,
      });
    }

    // Verify TOTP token
    const isValidToken = verifyTOTPToken(token, twoFactorAuth.secret);
    if (!isValidToken) {
      // Check if it's a backup code
      const isBackupCode = twoFactorAuth.isBackupCodeValid(token);
      if (!isBackupCode) {
        throw new ResponseErrorDomain({
          name: ErrorNames.BadRequestError,
          error: verifyTwoFactorAuthResponse.INVALID_TOKEN.error,
          message: verifyTwoFactorAuthResponse.INVALID_TOKEN.message,
          code: verifyTwoFactorAuthResponse.INVALID_TOKEN.code,
        });
      }
      
      // Remove used backup code
      twoFactorAuth.removeBackupCode(token);
      await this._twoFactorAuthRepository.updateTwoFactorAuth(twoFactorAuth);
      
      this._logger.info(`Backup code used for 2FA verification`, {
        userId,
        email: user.email,
      });
    }

    this._logger.info(`Two-factor authentication verified`, {
      userId,
      email: user.email,
      method: isValidToken ? 'TOTP' : 'BACKUP_CODE',
    });

    const responseData = {
      isEnabled: twoFactorAuth.isEnabled,
    };

    return new ResponseDomain(verifyTwoFactorAuthResponse.VERIFIED, responseData);
  }
}

export { VerifyTwoFactorAuth };
