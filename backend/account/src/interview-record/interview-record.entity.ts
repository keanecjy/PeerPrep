import { Profile } from '../profile/profile.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
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

  @ManyToMany(() => Profile, (profile: Profile) => profile.interviews, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinTable()
  participants: Profile[];

  @Column({ type: 'integer' })
  timeTaken: number;

  @Column({ type: 'boolean', default: true })
  isCompleted: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
