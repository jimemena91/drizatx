import { Injectable } from '@nestjs/common';
import { TicketsService } from '../tickets/tickets.service';
import { OperatorsService } from '../operators/operators.service';
import { ServicesService } from '../services/services.service';

@Injectable()
export class ReportsService {
  constructor(
    private readonly ticketsService: TicketsService,
    private readonly operatorsService: OperatorsService,
    private readonly servicesService: ServicesService,
  ) {}

  generateReport() {
    const tickets = this.ticketsService.findAll();
    const operators = this.operatorsService.findAll();
    const services = this.servicesService.findAll();

    return {
      fecha: new Date().toISOString().split('T')[0],
      totalTurnos: tickets.length,
      atendidos: tickets.filter(t => t.status === 'COMPLETED').length,
      servicios: services.map(s => ({
        name: s.name,
        tickets: tickets.filter(t => t.serviceId === s.id).length,
      })),
      operadores: operators.map(o => ({
        name: o.name,
        ticketsAtendidos: tickets.filter(t => t.operatorId === o.id && t.status === 'COMPLETED').length,
      })),
    };
  }
}
