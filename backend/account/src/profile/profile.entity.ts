import { InterviewRecord } from '../interview-record/interview-record.entity';
import { ApiHideProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
  Entity,
  OneToMany,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Profile {
  @PrimaryColumn('uuid')
  id: string;

  @ApiHideProperty()
  @OneToOne(() => User, (user) => user.profile, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id', referencedColumnName: 'id' })
  user: User;

  @Column('varchar')
  name: string;

  @Column('varchar', { nullable: true })
  photo: string;

  @OneToMany(
    () => InterviewRecord,
    (interview: InterviewRecord) => interview.owner
  )
  interviews: InterviewRecord[];

  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;
}
