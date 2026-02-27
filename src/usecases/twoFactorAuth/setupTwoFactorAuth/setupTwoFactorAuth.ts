// Module import
import { inject, injectable } from 'inversify';
// Domain import
import { ResponseErrorDomain, ErrorNames } from '../../../domains/error.domain';
import { ResponseDomain } from '../../../domains/response.domain';
import { TwoFactorAuthDomain } from '../../../domains/twoFactorAuth.domain';
// Infrastructure import
import {
  ILogger,
  LOGGER_TYPE,
} from '../../../infrastructure/logging/logger.interface';
// Interface import
import { ISetupTwoFactorAuthRequest } from './setupTwoFactorAuth.interface';
import { ISetupTwoFactorAuth } from './setupTwoFactorAuth.interface';
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
import { generateTOTPSecret } from '../../../adapters/util/totp.util';
// Response import
import { setupTwoFactorAuthResponse } from './setupTwoFactorAuth.response';

@injectable()
class SetupTwoFactorAuth implements ISetupTwoFactorAuth {
  constructor(
    @inject(LOGGER_TYPE.Logger) private readonly _logger: ILogger,
    @inject(USER_REPOSITORY_TYPE.UserRepository)
    private readonly _userRepository: IUserRepository,
    @inject(TWO_FACTOR_AUTH_REPOSITORY_TYPE.TwoFactorAuthRepository)
    private readonly _twoFactorAuthRepository: ITwoFactorAuthRepository
  ) {}

  public async execute(
    request: ISetupTwoFactorAuthRequest
  ): Promise<ResponseDomain<any> | ResponseErrorDomain> {
    const { userId } = request;

    // Check if user exists
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new ResponseErrorDomain({
        name: ErrorNames.NotFoundError,
        error: setupTwoFactorAuthResponse.USER_NOT_FOUND.error,
        message: setupTwoFactorAuthResponse.USER_NOT_FOUND.message,
        code: setupTwoFactorAuthResponse.USER_NOT_FOUND.code,
      });
    }

    // Check if 2FA is already enabled
    const existingTwoFactor = await this._twoFactorAuthRepository.findByUserId(userId);
    if (existingTwoFactor && existingTwoFactor.isEnabled) {
      throw new ResponseErrorDomain({
        name: ErrorNames.ConflictError,
        error: setupTwoFactorAuthResponse.ALREADY_ENABLED.error,
        message: setupTwoFactorAuthResponse.ALREADY_ENABLED.message,
        code: setupTwoFactorAuthResponse.ALREADY_ENABLED.code,
      });
    }

    // Generate TOTP secret and backup codes
    const secret = generateTOTPSecret();
    const backupCodes = TwoFactorAuthDomain.generateBackupCodes();

    // Create or update 2FA setup
    const twoFactorAuth = new TwoFactorAuthDomain(userId, secret, backupCodes);
    
    if (existingTwoFactor) {
      await this._twoFactorAuthRepository.updateTwoFactorAuth(twoFactorAuth);
    } else {
      await this._twoFactorAuthRepository.createTwoFactorAuth(twoFactorAuth);
    }

    // Generate QR code (simplified - would use a QR code library in production)
    const qrCode = `otpauth://totp/MyApp:${user.email}?secret=${secret}&issuer=MyApp`;

    this._logger.info(`Two-factor auth setup initiated for user: ${userId}`, {
      userId,
      email: user.email,
    });

    const responseData = {
      secret,
      qrCode,
      backupCodes,
    };

    return new ResponseDomain(setupTwoFactorAuthResponse.SETUP_SUCCESS, responseData);
  }
}

export { SetupTwoFactorAuth };
