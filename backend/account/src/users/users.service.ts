import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  findById(id: string): Promise<User> {
    return this.userRepository.findOne({ id });
  }

  findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ email });
  }

  async doesEmailExist(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ email });
    return !!user;
  }

  createUser(user: Pick<User, 'email' | 'passwordHash'>): Promise<User> {
    const partialUser = this.userRepository.create(user);
    return this.userRepository.save(partialUser);
  }

  async setRefreshToken(
    refreshTokenHash: string,
    id: string
  ): Promise<boolean> {
    try {
      await this.userRepository.update({ id }, { refreshTokenHash });
      console.log('Add refresh token');
      return true;
    } catch (err) {
      console.log('Error saving token', err);
      return false;
    }
  }

  async removeRefreshToken(id: string): Promise<boolean> {
    try {
      await this.userRepository.update({ id }, { refreshTokenHash: null });
      return true;
    } catch (err) {
      console.log('Error deleting token', err);
      return false;
    }
  }

  async activateAccount(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.isEmailConfirmed) {
      // already verified
      return false;
    }
    await this.userRepository.update(
      { id: user.id },
      { isEmailConfirmed: true }
    );
    return true;
  }

  async changePassword(id: string, passwordHash: string): Promise<boolean> {
    try {
      await this.userRepository.update({ id }, { passwordHash });
      return true;
    } catch (err) {
      console.log('Error setting password', err);
      return false;
    }
  }
}
