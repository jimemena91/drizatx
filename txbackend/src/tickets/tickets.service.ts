import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket, TicketStatus } from './entities/ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepo: Repository<Ticket>
  ) {}

  async create(dto: CreateTicketDto): Promise<Ticket> {
    const ticket = this.ticketRepo.create({
      ...dto,
      status: TicketStatus.WAITING,
    });

    return this.ticketRepo.save(ticket);
  }

  async findAll(): Promise<Ticket[]> {
  return this.ticketRepo.find({
    relations: ['service', 'operator'],
  });
}
async updateStatus(id: number, status: TicketStatus): Promise<Ticket> {
  const ticket = await this.ticketRepo.findOne({ where: { id } });
  if (!ticket) throw new Error('Ticket not found');

  ticket.status = status;
  return this.ticketRepo.save(ticket);
}
}
