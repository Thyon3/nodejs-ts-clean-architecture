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
import { IResetPasswordRequest } from './resetPassword.interface';
import { IResetPassword } from './resetPassword.interface';
// Repository import
import {
  IPasswordResetRepository,
  PASSWORD_RESET_REPOSITORY_TYPE,
} from '../../../adapters/repositories/passwordReset/passwordReset.repository.interface';
import {
  IUserRepository,
  USER_REPOSITORY_TYPE,
} from '../../../adapters/repositories/user/user.repository.interface';
// Util import
import CryptoUtil from '../../../adapters/util/crypto.util';
// Response import
import { resetPasswordResponse } from './resetPassword.response';

@injectable()
class ResetPassword implements IResetPassword {
  constructor(
    @inject(LOGGER_TYPE.Logger) private readonly _logger: ILogger,
    @inject(PASSWORD_RESET_REPOSITORY_TYPE.PasswordResetRepository)
    private readonly _passwordResetRepository: IPasswordResetRepository,
    @inject(USER_REPOSITORY_TYPE.UserRepository)
    private readonly _userRepository: IUserRepository
  ) { }

  public async execute(
    request: IResetPasswordRequest
  ): Promise<ResponseDomain<string> | ResponseErrorDomain> {
    const { token, newPassword } = request;

    // Find password reset by token
    const passwordReset = await this._passwordResetRepository.findByToken(token);
    if (!passwordReset) {
      throw new ResponseErrorDomain({
        name: ErrorNames.BadRequestError,
        error: resetPasswordResponse.INVALID_TOKEN.error,
        message: resetPasswordResponse.INVALID_TOKEN.message,
        code: resetPasswordResponse.INVALID_TOKEN.code,
      });
    }

    // Check if token is expired
    if (passwordReset.isTokenExpired()) {
      throw new ResponseErrorDomain({
        name: ErrorNames.BadRequestError,
        error: resetPasswordResponse.TOKEN_EXPIRED.error,
        message: resetPasswordResponse.TOKEN_EXPIRED.message,
        code: resetPasswordResponse.TOKEN_EXPIRED.code,
      });
    }

    // Check if token is already used
    if (passwordReset.isUsed) {
      throw new ResponseErrorDomain({
        name: ErrorNames.BadRequestError,
        error: resetPasswordResponse.INVALID_TOKEN.error,
        message: 'RESET_TOKEN_ALREADY_USED',
        code: resetPasswordResponse.INVALID_TOKEN.code,
      });
    }

    // Mark token as used
    await this._passwordResetRepository.markAsUsed(token);
    passwordReset.markAsUsed();

    // Update user password
    const hashedPassword = CryptoUtil.createHmac(newPassword, process.env.JWT_SECRET || 'default');
    await this._userRepository.updatePassword(passwordReset.userId, hashedPassword);

    this._logger.info(`Password reset successfully for user: ${passwordReset.userId}`, {
      userId: passwordReset.userId,
      email: passwordReset.email,
    });

    return new ResponseDomain(resetPasswordResponse.PASSWORD_RESET, 'Password reset successfully');
  }
}

export { ResetPassword };
