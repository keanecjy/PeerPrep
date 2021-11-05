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
    participants: { id: string }[]
  ): Promise<InterviewRecord> {
    const interview = this.interviewRepository.create({
      ...createInterviewDto,
      isCompleted: createInterviewDto.completed,
      participants,
    });
    return this.interviewRepository.save(interview);
  }

  findOne(id: number): Promise<InterviewRecord> {
    return this.interviewRepository.findOne({ id });
  }
}
