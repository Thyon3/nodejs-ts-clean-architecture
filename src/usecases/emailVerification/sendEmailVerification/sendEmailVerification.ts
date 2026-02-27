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
import { ISendEmailVerificationRequest } from './sendEmailVerification.interface';
import { ISendEmailVerification } from './sendEmailVerification.interface';
// Repository import
import {
  IUserRepository,
  USER_REPOSITORY_TYPE,
} from '../../../adapters/repositories/user/user.repository.interface';
import {
  IEmailVerificationRepository,
  EMAIL_VERIFICATION_REPOSITORY_TYPE,
} from '../../../adapters/repositories/emailVerification/emailVerification.repository.interface';
// Util import
import { generateVerificationToken } from '../../../adapters/util/token.util';
// Response import
import { sendEmailVerificationResponse } from './sendEmailVerification.response';

@injectable()
class SendEmailVerification implements ISendEmailVerification {
  constructor(
    @inject(LOGGER_TYPE.Logger) private readonly _logger: ILogger,
    @inject(USER_REPOSITORY_TYPE.UserRepository)
    private readonly _userRepository: IUserRepository,
    @inject(EMAIL_VERIFICATION_REPOSITORY_TYPE.EmailVerificationRepository)
    private readonly _emailVerificationRepository: IEmailVerificationRepository
  ) {}

  public async execute(
    request: ISendEmailVerificationRequest
  ): Promise<ResponseDomain<string> | ResponseErrorDomain> {
    const { userId, email } = request;

    // Check if user exists
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new ResponseErrorDomain(sendEmailVerificationResponse.USER_NOT_FOUND);
    }

    // Generate verification token
    const token = generateVerificationToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Token expires in 24 hours

    // Create email verification domain
    const emailVerification = new EmailVerificationDomain(
      userId,
      email,
      token,
      expiresAt
    );

    // Save verification token
    await this._emailVerificationRepository.createEmailVerification(emailVerification);

    // TODO: Send email with verification link
    // This would integrate with an email service like SendGrid, Nodemailer, etc.
    this._logger.info(`Email verification sent to ${email}`, {
      userId,
      email,
      token: token.substring(0, 8) + '...', // Log partial token for security
    });

    return new ResponseDomain(sendEmailVerificationResponse.EMAIL_SENT, token);
  }
}

export { SendEmailVerification };
