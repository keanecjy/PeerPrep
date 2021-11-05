import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ISeeder } from '../seeder.interface';
import { InterviewRecord } from '../../interview-record/interview-record.entity';

@Injectable()
export class InterviewsSeeder implements ISeeder {
  constructor(
    @InjectRepository(InterviewRecord)
    private readonly interviewRepository: Repository<InterviewRecord>
  ) {}

  async seed(): Promise<any> {
    if (
      await this.interviewRepository.findOne({
        owner: { id: '10c7e0a8-120b-45e0-a37f-be92170bfb8d' },
      })
    ) {
      return;
    }
    const interviews = this.interviewRepository.create({
      leetcodeSlug: 'two-sum',
      questionName: 'Two Sum',
      owner: { id: '10c7e0a8-120b-45e0-a37f-be92170bfb8d' },
      partnerName: 'Guest',
      timeTaken: 180,
      isCompleted: true,
    });

    return this.interviewRepository
      .save(interviews)
      .finally(() => console.log('* Seeded interviews...'));
  }
}
