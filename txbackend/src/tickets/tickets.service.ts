import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Ticket, TicketStatus } from './entities/ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Service } from 'src/services/entities/service.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepo: Repository<Ticket>,
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
  ) {}

  async create(dto: CreateTicketDto): Promise<Ticket> {
      const service = await this.serviceRepo.findOne({ where: { id: dto.serviceId } });
    if (!service) throw new Error('Service not found');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayCount = await this.ticketRepo.count({
      where: {
        serviceId: dto.serviceId,
        createdAt: MoreThan(today),
      },
    });

    const ticketNumber = `${service.prefix}${(todayCount + 1)
      .toString()
      .padStart(3, '0')}`;
    const ticket = this.ticketRepo.create({
       number: ticketNumber,
      serviceId: dto.serviceId,
      mobilePhone: dto.mobilePhone,
      status: TicketStatus.WAITING,
    });

    return this.ticketRepo.save(ticket);
  }

  async findAll(): Promise<Ticket[]> {
  return this.ticketRepo.find({
    relations: ['service', 'operator'],
  });
}
  async updateStatus(
    id: number,
    status: TicketStatus,
    operatorId?: number,
  ): Promise<Ticket> {
    const ticket = await this.ticketRepo.findOne({ where: { id } });
    if (!ticket) throw new Error('Ticket not found');
  const now = new Date();
    ticket.status = status;
    if (operatorId !== undefined) {
      ticket.operatorId = operatorId;
    }

    switch (status) {
      case TicketStatus.CALLED:
        ticket.calledAt = now;
        break;
      case TicketStatus.IN_PROGRESS:
        ticket.startedAt = now;
        break;
      case TicketStatus.COMPLETED:
        ticket.completedAt = now;
        break;
    }

    return this.ticketRepo.save(ticket);
  }
}
