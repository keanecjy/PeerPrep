import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ISeeder } from '../seeder.interface';
import { Interview } from 'src/interview/interview.entity';

@Injectable()
export class InterviewsSeeder implements ISeeder {
  constructor(
    @InjectRepository(Interview)
    private readonly interviewRepository: Repository<Interview>
  ) {}

  async seed(): Promise<any> {
    const interviews = this.interviewRepository.create({
      leetcodeSlug: 'two-sum',
      questionName: 'Two Sum',
      participants: [{ id: '10c7e0a8-120b-45e0-a37f-be92170bfb8d' }],
      timeTaken: '2min',
      isCompleted: true,
    });

    return this.interviewRepository
      .save(interviews)
      .finally(() => console.log('* Seeded interviews...'));
  }
}
