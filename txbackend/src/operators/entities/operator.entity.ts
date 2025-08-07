import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Ticket } from '../../tickets/entities/ticket.entity';

export enum Role {
  OPERATOR = 'OPERATOR',
  SUPERVISOR = 'SUPERVISOR',
  ADMIN = 'ADMIN',
}

@Entity('operators')
export class Operator {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  position: string;

  @Column({ type: 'enum', enum: Role, default: Role.OPERATOR })
  role: Role;

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => Ticket, (ticket) => ticket.operator)
  tickets: Ticket[];
}
