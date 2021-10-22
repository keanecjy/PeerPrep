import { ProfileModule } from './../profile/profile.module';
import { Interview } from './interview.entity';
import { Module } from '@nestjs/common';
import { InterviewService } from './interview.service';
import { InterviewController } from './interview.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Interview]), ProfileModule],
  controllers: [InterviewController],
  providers: [InterviewService],
})
export class InterviewModule {}
