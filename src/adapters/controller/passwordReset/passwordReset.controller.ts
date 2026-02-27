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
  SEND_PASSWORD_RESET_TYPE,
  ISendPasswordReset,
} from '../../../usecases/passwordReset/sendPasswordReset/sendPasswordReset.interface';
import {
  RESET_PASSWORD_TYPE,
  IResetPassword,
} from '../../../usecases/passwordReset/resetPassword/resetPassword.interface';
// Interface import
import { ISendPasswordResetRequest, IResetPasswordRequest } from './passwordReset.interface';
// Schema import
import { sendPasswordResetSchema, resetPasswordSchema } from './passwordReset.schema';

@controller('/password-reset')
export class PasswordResetController {
  constructor(
    @inject(SEND_PASSWORD_RESET_TYPE.SendPasswordReset)
    private readonly _sendPasswordReset: ISendPasswordReset,
    @inject(RESET_PASSWORD_TYPE.ResetPassword)
    private readonly _resetPassword: IResetPassword
  ) {}

  @httpPost('/send', validate(sendPasswordResetSchema))
  async sendPasswordReset(
    @request() req: Request,
    @response() res: Response
  ): Promise<void> {
    try {
      const request = req.body as unknown as ISendPasswordResetRequest;

      const { error, message, code, data }: IResponseDomain<string> =
        await this._sendPasswordReset.execute(request);

      res.status(code).json({ error, message, data });
    } catch (error) {
      res.status(500).json({
        error: true,
        message: 'INTERNAL_SERVER_ERROR',
      });
    }
  }

  @httpPost('/reset', validate(resetPasswordSchema))
  async resetPassword(
    @request() req: Request,
    @response() res: Response
  ): Promise<void> {
    try {
      const request = req.body as unknown as IResetPasswordRequest;

      const { error, message, code, data }: IResponseDomain<string> =
        await this._resetPassword.execute(request);

      res.status(code).json({ error, message, data });
    } catch (error) {
      res.status(500).json({
        error: true,
        message: 'INTERNAL_SERVER_ERROR',
      });
    }
  }
}
