import { Inject, Injectable } from '@nestjs/common';
import { ConfigType, registerAs } from '@nestjs/config';

const env = process.env;

export const mailConfig = registerAs('mailer', () => ({
  user: env.HOTMAIL_ID,
  pass: env.HOTMAIL_PASS,
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
}
