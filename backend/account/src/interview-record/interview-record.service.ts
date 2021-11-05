import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRecordDto } from './dto/create-record.dto';
import { InterviewRecord } from './interview-record.entity';

@Injectable()
export class InterviewRecordService {
  constructor(
    @InjectRepository(InterviewRecord)
    private interviewRepository: Repository<InterviewRecord>
  ) {}

  create(
    createInterviewDto: CreateRecordDto,
    requesterId: string
  ): Promise<InterviewRecord> {
    const interview = this.interviewRepository.create({
      ...createInterviewDto,
      owner: { id: requesterId },
    });
    return this.interviewRepository.save(interview);
  }

  findOne(id: number): Promise<InterviewRecord> {
    return this.interviewRepository.findOne({ id }, { relations: ['owner'] });
  }
}
