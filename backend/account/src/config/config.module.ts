import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig, AppConfigService } from './app.config';
import { databaseConfig, DatabaseConfigService } from './database.config';
import validationSchema from './config.schema';
import { jwtConfig, JwtConfigService } from './jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, databaseConfig, jwtConfig],
      validationSchema: validationSchema,
    }),
  ],
  providers: [AppConfigService, DatabaseConfigService, JwtConfigService],
  exports: [
    ConfigModule,
    AppConfigService,
    DatabaseConfigService,
    JwtConfigService,
  ],
})
export class AppConfigModule {}
