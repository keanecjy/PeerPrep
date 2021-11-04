import { ProfileModule } from '../profile/profile.module';
import { InterviewRecord } from './interview-record.entity';
import { Module } from '@nestjs/common';
import { InterviewRecordService } from './interview-record.service';
import { InterviewRecordController } from './interview-record.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([InterviewRecord]), ProfileModule],
  controllers: [InterviewRecordController],
  providers: [InterviewRecordService],
})
export class InterviewRecordModule {}
