import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from '../orders/order.entity';

export type UserRole = 'customer' | 'admin';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // bcrypt hash

  @Column({ default: 'customer' })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
