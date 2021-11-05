import { Profile } from '../profile/profile.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class InterviewRecord {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar' })
  leetcodeSlug: string;

  @Column({ type: 'varchar' })
  questionName: string;

  @ManyToOne(() => Profile, (profile: Profile) => profile.interviews, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  owner: Profile;

  @Column({ type: 'varchar', nullable: true })
  partnerName: string;

  @Column({ type: 'integer' })
  timeTaken: number;

  @Column({ type: 'boolean', default: true })
  isCompleted: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
