import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Ticket } from '../../tickets/entities/ticket.entity';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  prefix: string;

  @Column({ default: 1 })
  priority: number;

  @Column({ default: 10 })
  estimatedTime: number;

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => Ticket, (ticket) => ticket.service)
  tickets: Ticket[];
}
