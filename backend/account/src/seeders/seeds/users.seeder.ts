import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { ISeeder } from '../seeder.interface';
import { User } from '../../users/user.entity';

@Injectable()
export class UsersSeeder implements ISeeder {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  private async generateData(subject: string): Promise<User> {
    const passwordHash = await bcrypt.hash(subject, 12);
    return this.userRepository.create({
      id: '10c7e0a8-120b-45e0-a37f-be92170bfb8d',
      profile: {
        firstName: subject,
        lastName: 'User',
      },
      passwordHash,
      email: `${subject}@email.com`,
      isEmailConfirmed: true,
    });
  }

  async seed(): Promise<any> {
    const seedUser = await this.generateData('seeder');

    return this.userRepository
      .save(seedUser)
      .finally(() => console.log('* Seeded users...'));
  }
}
