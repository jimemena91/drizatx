import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Service } from '../../services/entities/service.entity';
import { Operator } from '../../operators/entities/operator.entity';

export enum TicketStatus {
  WAITING = 'WAITING',
  CALLED = 'CALLED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: string;

  @Column({ type: 'enum', enum: TicketStatus, default: TicketStatus.WAITING })
  status: TicketStatus;

  @Column({ nullable: true })
  mobilePhone?: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'datetime', nullable: true })
  calledAt?: Date;

  @Column({ type: 'datetime', nullable: true })
  startedAt?: Date;

  @Column({ type: 'datetime', nullable: true })
  completedAt?: Date;

  @Column()
  serviceId: number;

  @ManyToOne(() => Service, (service) => service.tickets)
  @JoinColumn({ name: 'serviceId' })
  service: Service;

  @Column({ nullable: true })
  operatorId?: number;

  @ManyToOne(() => Operator, (operator) => operator.tickets, { nullable: true })
  @JoinColumn({ name: 'operatorId' })
  operator: Operator;
}
