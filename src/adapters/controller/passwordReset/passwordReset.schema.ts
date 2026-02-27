// Module import
import Joi from 'joi';

// Schema for sending password reset
const sendPasswordResetSchema = Joi.object({
  email: Joi.string().email().required(),
}).required();

// Schema for resetting password
const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
}).required();

export { sendPasswordResetSchema, resetPasswordSchema };
