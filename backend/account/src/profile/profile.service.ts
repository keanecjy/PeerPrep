import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { User } from '../users/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './profile.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>
  ) {}

  create(
    createProfileDto: Pick<CreateUserDto, 'firstName' | 'lastName'>,
    user: User
  ): Promise<Profile> {
    const profile = this.profileRepository.create({
      ...createProfileDto,
      user: user,
      photo: `https://avatars.dicebear.com/api/gridy/${user.id}.svg`,
    });

    return this.profileRepository.save(profile);
  }

  findOne(id: string): Promise<Profile> {
    return this.profileRepository.findOne({ id });
  }

  async update(
    id: string,
    updateProfileDto: UpdateProfileDto
  ): Promise<Profile> {
    const profile = await this.profileRepository.findOne({ id });

    if (!profile) {
      throw new NotFoundException('Profile does not exist');
    }

    await this.profileRepository.save({ ...profile, ...updateProfileDto });
    return this.profileRepository.findOne({ id });
  }

  async remove(id: string): Promise<boolean> {
    const profile = await this.profileRepository.findOne({ id });

    if (!profile) {
      throw new NotFoundException('Profile does not exist');
    }

    await this.profileRepository.remove(profile);
    return true;
  }
}
