import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { IsEmail } from 'class-validator';
import { Exclude } from 'class-transformer';

import { Profile } from '../profile/profile.entity';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  @Unique('unique_email', ['email'])
  @IsEmail()
  email: string;

  @Column({ default: false })
  isEmailConfirmed: boolean;

  @OneToOne(() => Profile, (profile) => profile.user, { nullable: true })
  profile?: Profile;

  @Exclude()
  @ApiHideProperty()
  @Column('varchar')
  passwordHash: string;

  @Exclude()
  @ApiHideProperty()
  @Column('varchar', { nullable: true })
  refreshTokenHash: string;

  @Exclude()
  @ApiHideProperty()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @ApiHideProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
