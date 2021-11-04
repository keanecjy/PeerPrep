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
      useFactory: ({ host, port, user, pass, from }: MailConfigService) => ({
        transport: {
          host,
          port,
          secure: false, // upgrade later with STARTTLS
          auth: { user, pass },
        },
        defaults: {
          from: `PeerPrep Team <${from}>`,
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
