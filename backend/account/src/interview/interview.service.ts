import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { Interview } from './interview.entity';

@Injectable()
export class InterviewService {
  constructor(
    @InjectRepository(Interview)
    private interviewRepository: Repository<Interview>
  ) {}

  create(
    createInterviewDto: CreateInterviewDto,
    participants: { id: string }[]
  ): Promise<Interview> {
    const interview = this.interviewRepository.create({
      ...createInterviewDto,
      participants,
    });
    return this.interviewRepository.save(interview);
  }

  findOne(id: number): Promise<Interview> {
    return this.interviewRepository.findOne({ id });
  }
}
