// Module import
import { inject, injectable } from 'inversify';
// Domain import
import { ResponseErrorDomain } from '../../../domains/error.domain';
import { ResponseDomain } from '../../../domains/response.domain';
import { EmailVerificationDomain } from '../../../domains/emailVerification.domain';
// Infrastructure import
import {
  ILogger,
  LOGGER_TYPE,
} from '../../../infrastructure/logging/logger.interface';
// Interface import
import { IResendEmailVerificationRequest } from './resendEmailVerification.interface';
import { IResendEmailVerification } from './resendEmailVerification.interface';
// Repository import
import {
  IEmailVerificationRepository,
  EMAIL_VERIFICATION_REPOSITORY_TYPE,
} from '../../../adapters/repositories/emailVerification/emailVerification.repository.interface';
import {
  IUserRepository,
  USER_REPOSITORY_TYPE,
} from '../../../adapters/repositories/user/user.repository.interface';
// Util import
import { generateVerificationToken } from '../../../adapters/util/token.util';
// Response import
import { resendEmailVerificationResponse } from './resendEmailVerification.response';

@injectable()
class ResendEmailVerification implements IResendEmailVerification {
  constructor(
    @inject(LOGGER_TYPE.Logger) private readonly _logger: ILogger,
    @inject(USER_REPOSITORY_TYPE.UserRepository)
    private readonly _userRepository: IUserRepository,
    @inject(EMAIL_VERIFICATION_REPOSITORY_TYPE.EmailVerificationRepository)
    private readonly _emailVerificationRepository: IEmailVerificationRepository
  ) { }

  public async execute(
    request: IResendEmailVerificationRequest
  ): Promise<ResponseDomain<string> | ResponseErrorDomain> {
    const { email } = request;

    // Check if user exists
    const user = await this._userRepository.findByEmail(email);
    if (!user) {
      throw new ResponseErrorDomain(resendEmailVerificationResponse.USER_NOT_FOUND);
    }

    // Check if user is already verified
    if (user.emailVerified) {
      throw new ResponseErrorDomain(resendEmailVerificationResponse.ALREADY_VERIFIED);
    }

    // Delete existing verification tokens
    await this._emailVerificationRepository.deleteByUserId(user.id.toString());

    // Generate new verification token
    const token = generateVerificationToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Token expires in 24 hours

    // Create new email verification domain
    const emailVerification = new EmailVerificationDomain(
      user.id.toString(),
      email,
      token,
      expiresAt
    );

    // Save verification token
    await this._emailVerificationRepository.createEmailVerification(emailVerification);

    // TODO: Send email with verification link
    // This would integrate with an email service like SendGrid, Nodemailer, etc.
    this._logger.info(`Email verification resent to ${email}`, {
      userId: user.id,
      email,
      token: token.substring(0, 8) + '...', // Log partial token for security
    });

    return new ResponseDomain(resendEmailVerificationResponse.EMAIL_SENT, token);
  }
}

export { ResendEmailVerification };
