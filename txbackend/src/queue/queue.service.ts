import { Injectable } from '@nestjs/common';
import { TicketsService } from '../tickets/tickets.service';
import { OperatorsService } from '../operators/operators.service';
import { ServicesService } from '../services/services.service';

@Injectable()
export class QueueService {
  constructor(
    private readonly ticketsService: TicketsService,
    private readonly operatorsService: OperatorsService,
    private readonly servicesService: ServicesService,
  ) {}

  getStatus() {
    const tickets = this.ticketsService.findAll();
    const operators = this.operatorsService.findAll();
    const services = this.servicesService.findAll();

    // Lógica para calcular métricas de estado real
    return {
      currentTicket: tickets.find(t => t.status === 'IN_PROGRESS'),
      nextTickets: tickets.filter(t => t.status === 'WAITING').slice(0, 5),
      todayMetrics: {
        totalInQueue: tickets.filter(t => t.status === 'WAITING').length,
        averageWaitTime: 10,
        attendedToday: tickets.filter(t => t.status === 'COMPLETED').length,
        serviceLevel: 92,
        peakHour: 11,
      },
      queues: services.map(service => {
        const waiting = tickets.filter(t => t.serviceId === service.id && t.status === 'WAITING');
        return {
          id: service.id,
          name: service.name,
          waitingCount: waiting.length,
          averageTime: service.estimatedTime,
        };
      }),
    };
  }
}
