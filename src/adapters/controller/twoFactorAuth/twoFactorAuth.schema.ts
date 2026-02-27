// Module import
import Joi from 'joi';

// Schema for setting up 2FA
const setupTwoFactorAuthSchema = Joi.object({
  userId: Joi.string().required(),
}).required();

// Schema for verifying 2FA
const verifyTwoFactorAuthSchema = Joi.object({
  userId: Joi.string().required(),
  token: Joi.string().length(6).pattern(/^\d+$/).required(),
}).required();

// Schema for enabling 2FA
const enableTwoFactorAuthSchema = Joi.object({
  userId: Joi.string().required(),
  token: Joi.string().length(6).pattern(/^\d+$/).required(),
}).required();

// Schema for disabling 2FA
const disableTwoFactorAuthSchema = Joi.object({
  userId: Joi.string().required(),
  password: Joi.string().min(8).required(),
}).required();

export { 
  setupTwoFactorAuthSchema, 
  verifyTwoFactorAuthSchema,
  enableTwoFactorAuthSchema,
  disableTwoFactorAuthSchema 
};
