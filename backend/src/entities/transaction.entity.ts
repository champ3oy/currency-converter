import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.transactions)
  user: User;

  @Column()
  userId: number;

  @Column()
  fromCurrency: string;

  @Column()
  toCurrency: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column('decimal', { precision: 10, scale: 2 })
  convertedAmount: number;

  @Column('decimal', { precision: 10, scale: 6 })
  rate: number;

  @CreateDateColumn()
  createdAt: Date;
}
