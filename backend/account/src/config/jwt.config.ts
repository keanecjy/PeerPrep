import { Inject, Injectable } from '@nestjs/common';
import { ConfigType, registerAs } from '@nestjs/config';

const env = process.env;

export const jwtConfig = registerAs('jwt', () => ({
  token_secret: env.JWT_ACCESS_TOKEN_SECRET,
  token_expiry: env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  refresh_secret: env.JWT_REFRESH_TOKEN_SECRET,
  refresh_expiry: env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
  mail_verify_secret: env.JWT_MAIL_VERIFY_SECRET,
  mail_verify_expiry: env.JWT_MAIL_VERIFY_EXPIRATION_TIME,
  password_reset_secret: env.JWT_PASSWORD_RESET_SECRET,
  password_reset_expiry: env.JWT_PASSWORD_RESET_EXPIRATION_TIME,
}));

@Injectable()
export class JwtConfigService {
  constructor(
    @Inject(jwtConfig.KEY) private config: ConfigType<typeof jwtConfig>
  ) {}

  public get values() {
    return this.config;
  }

  public get accessTokenOptions() {
    return {
      secret: this.config.token_secret,
      expiry: this.config.token_expiry,
    };
  }

  public get refreshTokenOptions() {
    return {
      secret: this.config.refresh_secret,
      expiry: this.config.refresh_expiry,
    };
  }

  public get mailVerifyTokenOptions() {
    return {
      secret: this.config.mail_verify_secret,
      expiry: this.config.mail_verify_expiry,
    };
  }

  public get passwordResetTokenOptions() {
    return {
      secret: this.config.password_reset_secret,
      expiry: this.config.password_reset_expiry,
    };
  }
}
