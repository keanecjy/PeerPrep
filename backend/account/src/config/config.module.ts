import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import validationSchema from './config.schema';
import { appConfig, AppConfigService } from './app.config';
import { databaseConfig, DatabaseConfigService } from './database.config';
import { jwtConfig, JwtConfigService } from './jwt.config';
import { MailConfigService, mailConfig } from './mail.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, databaseConfig, jwtConfig, mailConfig],
      validationSchema: validationSchema,
    }),
  ],
  providers: [
    AppConfigService,
    DatabaseConfigService,
    JwtConfigService,
    MailConfigService,
  ],
  exports: [
    ConfigModule,
    AppConfigService,
    DatabaseConfigService,
    JwtConfigService,
    MailConfigService,
  ],
})
export class AppConfigModule {}
