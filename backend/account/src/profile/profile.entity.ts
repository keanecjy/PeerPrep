import { ApiHideProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
  Entity,
} from 'typeorm';
import { User } from '../users/user.entity';

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
  firstName: string;

  @Column('varchar')
  lastName: string;

  @Column('varchar', { nullable: true })
  alias: string;

  @Column('varchar', { nullable: true })
  photo: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
