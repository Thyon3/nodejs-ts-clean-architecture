// Module import
import { Request, Response } from 'express';
import { inject } from 'inversify';
import {
  controller,
  httpPost,
  request,
  response,
} from 'inversify-express-utils';
// Domain import
import { IResponseDomain } from '../../../domains/response.domain';
// Middleware import
import { validate } from '../../../infrastructure/middleware/validate.middleware';
// Use case import
import {
  SEND_EMAIL_VERIFICATION_TYPE,
  ISendEmailVerification,
} from '../../../usecases/emailVerification/sendEmailVerification/sendEmailVerification.interface';
import {
  VERIFY_EMAIL_TYPE,
  IVerifyEmail,
} from '../../../usecases/emailVerification/verifyEmail/verifyEmail.interface';
// Interface import
import { ISendEmailVerificationRequest, IVerifyEmailRequest } from './emailVerification.interface';
// Schema import
import { sendEmailVerificationSchema, verifyEmailSchema } from './emailVerification.schema';

@controller('/email-verification')
export class EmailVerificationController {
  constructor(
    @inject(SEND_EMAIL_VERIFICATION_TYPE.SendEmailVerification)
    private readonly _sendEmailVerification: ISendEmailVerification,
    @inject(VERIFY_EMAIL_TYPE.VerifyEmail)
    private readonly _verifyEmail: IVerifyEmail
  ) { }

  @httpPost('/send', validate(sendEmailVerificationSchema))
  async sendEmailVerification(
    @request() req: Request,
    @response() res: Response
  ): Promise<void> {
    try {
      const request = req.body as unknown as ISendEmailVerificationRequest;

      const { error, message, code, data }: IResponseDomain<string> =
        await this._sendEmailVerification.execute(request);

      res.status(code).json({ error, message, data });
    } catch (error) {
      res.status(500).json({
        error: true,
        message: 'INTERNAL_SERVER_ERROR',
      });
    }
  }

  @httpPost('/verify', validate(verifyEmailSchema))
  async verifyEmail(
    @request() req: Request,
    @response() res: Response
  ): Promise<void> {
    try {
      const request = req.body as unknown as IVerifyEmailRequest;

      const { error, message, code, data }: IResponseDomain<string> =
        await this._verifyEmail.execute(request);

      res.status(code).json({ error, message, data });
    } catch (error) {
      res.status(500).json({
        error: true,
        message: 'INTERNAL_SERVER_ERROR',
      });
    }
  }
}
