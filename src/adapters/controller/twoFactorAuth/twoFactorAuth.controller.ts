// Module import
import { Request, Response } from 'express';
import { inject } from 'inversify';
import {
  controller,
  httpPost,
  httpGet,
  request,
  response,
} from 'inversify-express-utils';
// Domain import
import { IResponseDomain } from '../../../domains/response.domain';
// Middleware import
import { validate } from '../../../infrastructure/middleware/validate.middleware';
import { AuthMiddleware } from '../../../infrastructure/middleware/auth.middleware';
// Use case import
import {
  SETUP_TWO_FACTOR_AUTH_TYPE,
  ISetupTwoFactorAuth,
} from '../../../usecases/twoFactorAuth/setupTwoFactorAuth/setupTwoFactorAuth.interface';
import {
  VERIFY_TWO_FACTOR_AUTH_TYPE,
  IVerifyTwoFactorAuth,
} from '../../../usecases/twoFactorAuth/verifyTwoFactorAuth/verifyTwoFactorAuth.interface';
import {
  ENABLE_TWO_FACTOR_AUTH_TYPE,
  IEnableTwoFactorAuth,
} from '../../../usecases/twoFactorAuth/enableTwoFactorAuth/enableTwoFactorAuth.interface';
import {
  DISABLE_TWO_FACTOR_AUTH_TYPE,
  IDisableTwoFactorAuth,
} from '../../../usecases/twoFactorAuth/disableTwoFactorAuth/disableTwoFactorAuth.interface';
// Interface import
import { 
  ISetupTwoFactorAuthRequest, 
  IVerifyTwoFactorAuthRequest,
  IEnableTwoFactorAuthRequest,
  IDisableTwoFactorAuthRequest 
} from './twoFactorAuth.interface';
// Schema import
import { 
  setupTwoFactorAuthSchema, 
  verifyTwoFactorAuthSchema,
  enableTwoFactorAuthSchema,
  disableTwoFactorAuthSchema 
} from './twoFactorAuth.schema';

@controller('/two-factor-auth')
export class TwoFactorAuthController {
  constructor(
    @inject(SETUP_TWO_FACTOR_AUTH_TYPE.SetupTwoFactorAuth)
    private readonly _setupTwoFactorAuth: ISetupTwoFactorAuth,
    @inject(VERIFY_TWO_FACTOR_AUTH_TYPE.VerifyTwoFactorAuth)
    private readonly _verifyTwoFactorAuth: IVerifyTwoFactorAuth,
    @inject(ENABLE_TWO_FACTOR_AUTH_TYPE.EnableTwoFactorAuth)
    private readonly _enableTwoFactorAuth: IEnableTwoFactorAuth,
    @inject(DISABLE_TWO_FACTOR_AUTH_TYPE.DisableTwoFactorAuth)
    private readonly _disableTwoFactorAuth: IDisableTwoFactorAuth
  ) {}

  @httpPost('/setup', AuthMiddleware, validate(setupTwoFactorAuthSchema))
  async setupTwoFactorAuth(
    @request() req: Request,
    @response() res: Response
  ): Promise<void> {
    try {
      const request = req.body as unknown as ISetupTwoFactorAuthRequest;
      request.userId = (req as any).user.id; // Get user ID from auth middleware

      const { error, message, code, data }: IResponseDomain<any> =
        await this._setupTwoFactorAuth.execute(request);

      res.status(code).json({ error, message, data });
    } catch (error) {
      res.status(500).json({
        error: true,
        message: 'INTERNAL_SERVER_ERROR',
      });
    }
  }

  @httpPost('/verify', AuthMiddleware, validate(verifyTwoFactorAuthSchema))
  async verifyTwoFactorAuth(
    @request() req: Request,
    @response() res: Response
  ): Promise<void> {
    try {
      const request = req.body as unknown as IVerifyTwoFactorAuthRequest;
      request.userId = (req as any).user.id; // Get user ID from auth middleware

      const { error, message, code, data }: IResponseDomain<any> =
        await this._verifyTwoFactorAuth.execute(request);

      res.status(code).json({ error, message, data });
    } catch (error) {
      res.status(500).json({
        error: true,
        message: 'INTERNAL_SERVER_ERROR',
      });
    }
  }

  @httpPost('/enable', AuthMiddleware, validate(enableTwoFactorAuthSchema))
  async enableTwoFactorAuth(
    @request() req: Request,
    @response() res: Response
  ): Promise<void> {
    try {
      const request = req.body as unknown as IEnableTwoFactorAuthRequest;
      request.userId = (req as any).user.id; // Get user ID from auth middleware

      const { error, message, code, data }: IResponseDomain<any> =
        await this._enableTwoFactorAuth.execute(request);

      res.status(code).json({ error, message, data });
    } catch (error) {
      res.status(500).json({
        error: true,
        message: 'INTERNAL_SERVER_ERROR',
      });
    }
  }

  @httpPost('/disable', AuthMiddleware, validate(disableTwoFactorAuthSchema))
  async disableTwoFactorAuth(
    @request() req: Request,
    @response() res: Response
  ): Promise<void> {
    try {
      const request = req.body as unknown as IDisableTwoFactorAuthRequest;
      request.userId = (req as any).user.id; // Get user ID from auth middleware

      const { error, message, code, data }: IResponseDomain<any> =
        await this._disableTwoFactorAuth.execute(request);

      res.status(code).json({ error, message, data });
    } catch (error) {
      res.status(500).json({
        error: true,
        message: 'INTERNAL_SERVER_ERROR',
      });
    }
  }
}
