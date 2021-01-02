import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { TaskStatus } from './task.status.enum';
import { User } from 'src/auth/user.entity';
import { type } from 'os';

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  @ManyToOne(
    type => User,
    user => user.task,
    { eager: false },
  )
  user: User;

  @Column()
  userId:number
}
