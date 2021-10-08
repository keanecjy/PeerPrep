import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig, AppConfigService } from './app.config';
import { databaseConfig, DatabaseConfigService } from './database.config';
import validationSchema from './config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, databaseConfig],
      validationSchema: validationSchema,
    }),
  ],
  providers: [AppConfigService, DatabaseConfigService],
  exports: [ConfigModule, AppConfigService, DatabaseConfigService],
})
export class AppConfigModule {}
