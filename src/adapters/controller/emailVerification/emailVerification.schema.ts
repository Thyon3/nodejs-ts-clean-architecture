// Module import
import Joi from 'joi';

// Schema for sending email verification
const sendEmailVerificationSchema = Joi.object({
  userId: Joi.string().required(),
  email: Joi.string().email().required(),
}).required();

// Schema for verifying email
const verifyEmailSchema = Joi.object({
  token: Joi.string().required(),
}).required();

export { sendEmailVerificationSchema, verifyEmailSchema };
