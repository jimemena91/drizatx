import { Injectable } from '@nestjs/common';
import { Ticket, TicketStatus } from './entities/ticket.entity';

@Injectable()
export class TicketsService {
  private tickets: Ticket[] = [];
  private currentId = 1;

  create(serviceId: number, mobilePhone?: string): Ticket {
    const number = `T${String(this.currentId).padStart(3, '0')}`;
    const ticket: Ticket = {
      id: this.currentId++,
      number,
      serviceId,
      status: TicketStatus.WAITING,
      createdAt: new Date(),
      mobilePhone,
    };

    this.tickets.push(ticket);
    return ticket;
  }

  findAll(): Ticket[] {
    return this.tickets;
  }

  updateStatus(id: number, status: TicketStatus): Ticket | null {
  const ticket = this.tickets.find(t => t.id === id);
  if (ticket) {
    ticket.status = status;
  }
  return ticket ?? null;
}
}
