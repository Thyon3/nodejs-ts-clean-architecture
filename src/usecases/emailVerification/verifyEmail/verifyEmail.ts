// Module import
import { inject, injectable } from 'inversify';
// Domain import
import { ResponseErrorDomain } from '../../../domains/error.domain';
import { ResponseDomain } from '../../../domains/response.domain';
// Infrastructure import
import {
  ILogger,
  LOGGER_TYPE,
} from '../../../infrastructure/logging/logger.interface';
// Interface import
import { IVerifyEmailRequest } from './verifyEmail.interface';
import { IVerifyEmail } from './verifyEmail.interface';
// Repository import
import {
  IEmailVerificationRepository,
  EMAIL_VERIFICATION_REPOSITORY_TYPE,
} from '../../../adapters/repositories/emailVerification/emailVerification.repository.interface';
import {
  IUserRepository,
  USER_REPOSITORY_TYPE,
} from '../../../adapters/repositories/user/user.repository.interface';
// Response import
import { verifyEmailResponse } from './verifyEmail.response';

@injectable()
class VerifyEmail implements IVerifyEmail {
  constructor(
    @inject(LOGGER_TYPE.Logger) private readonly _logger: ILogger,
    @inject(EMAIL_VERIFICATION_REPOSITORY_TYPE.EmailVerificationRepository)
    private readonly _emailVerificationRepository: IEmailVerificationRepository,
    @inject(USER_REPOSITORY_TYPE.UserRepository)
    private readonly _userRepository: IUserRepository
  ) {}

  public async execute(
    request: IVerifyEmailRequest
  ): Promise<ResponseDomain<string> | ResponseErrorDomain> {
    const { token } = request;

    // Find email verification by token
    const emailVerification = await this._emailVerificationRepository.findByToken(token);
    if (!emailVerification) {
      throw new ResponseErrorDomain(verifyEmailResponse.INVALID_TOKEN);
    }

    // Check if token is expired
    if (emailVerification.isTokenExpired()) {
      throw new ResponseErrorDomain(verifyEmailResponse.TOKEN_EXPIRED);
    }

    // Check if already verified
    if (emailVerification.isVerified) {
      throw new ResponseErrorDomain(verifyEmailResponse.ALREADY_VERIFIED);
    }

    // Mark as verified
    await this._emailVerificationRepository.markAsVerified(token);
    emailVerification.markAsVerified();

    // Update user email verification status
    await this._userRepository.updateEmailVerificationStatus(emailVerification.userId, true);

    this._logger.info(`Email verified successfully for user: ${emailVerification.userId}`, {
      userId: emailVerification.userId,
      email: emailVerification.email,
    });

    return new ResponseDomain(verifyEmailResponse.VERIFIED, 'Email verified successfully');
  }
}

export { VerifyEmail };
