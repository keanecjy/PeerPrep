import { Profile } from './../profile/profile.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Interview {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar' })
  leetcodeSlug: string;

  @ManyToMany(() => Profile, (profile: Profile) => profile.interviews, {
    cascade: true,
    eager: true,
  })
  @JoinTable()
  participants: Profile[];

  @Column({ type: 'varchar' })
  timeTaken: string;

  @Column({ type: 'varchar', nullable: true })
  code?: string;

  @Column({ type: 'varchar', nullable: true })
  language?: string;

  @Column({ type: 'boolean', default: true })
  isCompleted: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
