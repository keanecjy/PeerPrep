import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

import { AppConfigModule } from '../config/config.module';
import { MailConfigService } from '../config/mail.config';
import { MailService } from './mail.service';

@Module({
  imports: [
    AppConfigModule,
    MailerModule.forRootAsync({
      useFactory: ({ user, pass }: MailConfigService) => ({
        transport: {
          service: 'Hotmail',
          auth: { user, pass },
        },
        defaults: {
          from: `PeerPrep Team`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      imports: [AppConfigModule],
      inject: [MailConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
