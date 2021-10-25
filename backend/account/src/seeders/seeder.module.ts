import { Interview } from 'src/interview/interview.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppConfigModule } from '../config/config.module';
import { AppConfigService } from '../config/app.config';
import { User } from '../users/user.entity';
import { ISeeder } from './seeder.interface';
import { SeederService } from './seeder.service';
import { UsersSeeder } from './seeds/users.seeder';
import { InterviewsSeeder } from './seeds/interviews.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([User, Interview]), AppConfigModule],
  providers: [
    { provide: ISeeder, useClass: UsersSeeder },
    UsersSeeder,
    InterviewsSeeder,
    {
      provide: SeederService,
      useFactory: (
        appConfigService: AppConfigService,
        ...seeders: ISeeder[]
      ): SeederService => new SeederService(appConfigService, seeders),
      inject: [AppConfigService, UsersSeeder, InterviewsSeeder],
    },
  ],
})
export class SeederModule {}
