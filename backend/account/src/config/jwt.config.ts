import { Inject, Injectable } from '@nestjs/common';
import { ConfigType, registerAs } from '@nestjs/config';

const env = process.env;

export const jwtConfig = registerAs('jwt', () => ({
  token_secret: env.JWT_ACCESS_TOKEN_SECRET,
  token_expiry: env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  refresh_secret: env.JWT_REFRESH_TOKEN_SECRET,
  refresh_expiry: env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
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
}
