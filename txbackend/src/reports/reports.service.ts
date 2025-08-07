import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from '../services/entities/service.entity';
import { Operator } from '../operators/entities/operator.entity';
import { Ticket, TicketStatus } from '../tickets/entities/ticket.entity';
import { TicketsService } from '../tickets/tickets.service';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
    @InjectRepository(Operator)
    private readonly operatorRepo: Repository<Operator>,
    private readonly ticketsService: TicketsService
  ) {}

  async generarReporte() {
    const tickets = await this.ticketsService.findAll(); // ✅ AQUI VA EL AWAIT
    const servicios = await this.serviceRepo.find();
    const operadores = await this.operatorRepo.find();

    return {
      totalTurnos: tickets.length,
      atendidos: tickets.filter(t => t.status === TicketStatus.COMPLETED).length,
      servicios: servicios.map(s => ({
        nombre: s.name,
        tickets: tickets.filter(t => t.serviceId === s.id).length
      })),
      operadores: operadores.map(o => ({
        nombre: o.name,
        ticketsAtendidos: tickets.filter(t =>
          t.operatorId === o.id && t.status === TicketStatus.COMPLETED
        ).length
      }))
    };
  }
}
