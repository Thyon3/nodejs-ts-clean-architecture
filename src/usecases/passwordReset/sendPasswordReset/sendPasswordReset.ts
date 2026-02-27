// Module import
import { inject, injectable } from 'inversify';
// Domain import
import { ResponseErrorDomain, ErrorNames } from '../../../domains/error.domain';
import { ResponseDomain } from '../../../domains/response.domain';
import { PasswordResetDomain } from '../../../domains/passwordReset.domain';
// Infrastructure import
import {
  ILogger,
  LOGGER_TYPE,
} from '../../../infrastructure/logging/logger.interface';
// Interface import
import { ISendPasswordResetRequest } from './sendPasswordReset.interface';
import { ISendPasswordReset } from './sendPasswordReset.interface';
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
import { generatePasswordResetToken } from '../../../adapters/util/token.util';
// Response import
import { sendPasswordResetResponse } from './sendPasswordReset.response';

@injectable()
class SendPasswordReset implements ISendPasswordReset {
  constructor(
    @inject(LOGGER_TYPE.Logger) private readonly _logger: ILogger,
    @inject(USER_REPOSITORY_TYPE.UserRepository)
    private readonly _userRepository: IUserRepository,
    @inject(PASSWORD_RESET_REPOSITORY_TYPE.PasswordResetRepository)
    private readonly _passwordResetRepository: IPasswordResetRepository
  ) { }

  public async execute(
    request: ISendPasswordResetRequest
  ): Promise<ResponseDomain<string> | ResponseErrorDomain> {
    const { email } = request;

    // Check if user exists
    const user = await this._userRepository.findByEmail(email);
    if (!user) {
      throw new ResponseErrorDomain({
        name: ErrorNames.NotFoundError,
        error: sendPasswordResetResponse.USER_NOT_FOUND.error,
        message: sendPasswordResetResponse.USER_NOT_FOUND.message,
        code: sendPasswordResetResponse.USER_NOT_FOUND.code,
      });
    }

    // Delete existing password reset tokens
    await this._passwordResetRepository.deleteByUserId(user.id.toString());

    // Generate new password reset token
    const token = generatePasswordResetToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Token expires in 1 hour

    // Create new password reset domain
    const passwordReset = new PasswordResetDomain(
      user.id.toString(),
      email,
      token,
      expiresAt
    );

    // Save password reset token
    await this._passwordResetRepository.createPasswordReset(passwordReset);

    // TODO: Send email with password reset link
    // This would integrate with an email service like SendGrid, Nodemailer, etc.
    this._logger.info(`Password reset email sent to ${email}`, {
      userId: user.id,
      email,
      token: token.substring(0, 8) + '...', // Log partial token for security
    });

    return new ResponseDomain(sendPasswordResetResponse.EMAIL_SENT, token);
  }
}

export { SendPasswordReset };
