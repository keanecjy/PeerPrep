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

  @Exclude()
  @Column('varchar')
  passwordHash: string;

  @Exclude()
  @Column('varchar', { nullable: true })
  refreshTokenHash: string;

  @OneToOne(() => Profile, (profile) => profile.user, { nullable: true })
  profile?: Profile;

  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;
}
