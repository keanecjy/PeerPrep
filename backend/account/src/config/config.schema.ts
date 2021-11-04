import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string().default('production'),
  DATABASE_URL: Joi.string().required(),
  CLIENT_URL: Joi.string().required(),
  DB_AUTOLOADENTITIES: Joi.boolean().default(true),
  DB_SYNCHRONIZE: Joi.boolean().default(false),

  JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().default(2400), // 40min in seconds
  JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
  JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().default(1209600), // 2wk in seconds
  JWT_MAIL_VERIFY_SECRET: Joi.string().required(),
  JWT_MAIL_VERIFY_EXPIRATION_TIME: Joi.string().default(3600), // 1h in seconds
  JWT_PASSWORD_RESET_SECRET: Joi.string().required(),
  JWT_PASSWORD_RESET_EXPIRATION_TIME: Joi.string().default(1200), // 20min in seconds

  EMAIL_FROM: Joi.string().default('noreply@peerprep.com'),
  EMAIL_HOST: Joi.string().default('smtp.gmail.com'), // smtp.office365.com
  EMAIL_PORT: Joi.number().default(587), // 587
  EMAIL_ID: Joi.string().required(), // user@outlook.com
  EMAIL_PASS: Joi.string().required(), // password
});
