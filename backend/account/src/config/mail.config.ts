import { Inject, Injectable } from '@nestjs/common';
import { ConfigType, registerAs } from '@nestjs/config';

const env = process.env;

export const mailConfig = registerAs('mailer', () => ({
  user: env.EMAIL_ID,
  pass: env.EMAIL_PASS,
  host: env.EMAIL_HOST,
  port: env.EMAIL_PORT as unknown as number,
  from: env.EMAIL_FROM,
}));

@Injectable()
export class MailConfigService {
  constructor(
    @Inject(mailConfig.KEY)
    private config: ConfigType<typeof mailConfig>
  ) {}

  public get values() {
    return this.config;
  }

  public get user() {
    return this.config.user;
  }

  public get pass() {
    return this.config.pass;
  }

  public get host() {
    return this.config.host;
  }

  public get port() {
    return this.config.port;
  }

  public get from() {
    return this.config.from;
  }
}
