import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Ticket, TicketStatus } from '../tickets/entities/ticket.entity';
import { Service } from '../services/entities/service.entity';
import { Operator } from '../operators/entities/operator.entity';
import {
  QueueStatusResponse,
  QueueSummary,
} from './interfaces/queue-status.interface';

@Injectable()
export class QueueService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepo: Repository<Ticket>,
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
    @InjectRepository(Operator)
    private readonly operatorRepo: Repository<Operator>,
  ) {}

  async getQueueStatus(): Promise<QueueStatusResponse> {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));

    // ✅ Buscar todos los tickets de hoy con relaciones completas
    const tickets = await this.ticketRepo.find({
      where: { createdAt: MoreThan(startOfDay) },
      relations: ['service', 'operator'],
    });

    const totalInQueue = tickets.filter((t) => t.status === TicketStatus.WAITING).length;
    const attendedToday = tickets.filter((t) => t.status === TicketStatus.COMPLETED).length;
    const averageWaitTime = this.calcularPromedioEspera(tickets);
    const serviceLevel = this.calcularNivelServicio(tickets);
    const peakHour = this.calcularHoraPico(tickets);
    const queues = await this.buildQueueStats();

    const currentTicket = tickets.find((t) =>
      [TicketStatus.IN_PROGRESS, TicketStatus.CALLED].includes(t.status),
    );

    const nextTickets = tickets
      .filter((t) => t.status === TicketStatus.WAITING)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .slice(0, 5);

    return {
      todayMetrics: {
        averageWaitTime,
        totalInQueue,
        attendedToday,
        serviceLevel,
        peakHour,
      },
      queues,
      currentTicket,
      nextTickets,
    };
  }

  private calcularPromedioEspera(tickets: Ticket[]): number {
    const completados = tickets.filter(
      (t) =>
        t.status === TicketStatus.COMPLETED && t.startedAt && t.createdAt,
    );

    const totalMin = completados.reduce((acc, t) => {
      const ms = t.startedAt!.getTime() - t.createdAt.getTime();
      return acc + ms / 60000;
    }, 0);

    return completados.length
      ? Math.round(totalMin / completados.length)
      : 0;
  }

  private calcularNivelServicio(tickets: Ticket[]): number {
    const completados = tickets.filter(
      (t) =>
        t.status === TicketStatus.COMPLETED && t.startedAt && t.createdAt,
    );

    const dentroDeTiempo = completados.filter((t) => {
      if (!t.startedAt || !t.createdAt) return false;
      const minutos = (t.startedAt.getTime() - t.createdAt.getTime()) / 60000;
      return minutos <= 15;
    });

    return completados.length
      ? Math.round((dentroDeTiempo.length / completados.length) * 100)
      : 100;
  }

  private calcularHoraPico(tickets: Ticket[]): number {
    const porHora = Array(24).fill(0);
    tickets.forEach((t) => {
      const hora = t.createdAt.getHours();
      porHora[hora]++;
    });

    const max = Math.max(...porHora);
    return porHora.findIndex((count) => count === max);
  }

  private async buildQueueStats(): Promise<QueueSummary[]> {
    const services = await this.serviceRepo.find();
    const queues: QueueSummary[] = [];

    for (const service of services) {
      const tickets = await this.ticketRepo.find({
        where: {
          serviceId: service.id,
          status: TicketStatus.WAITING,
        },
      });

      const avg =
        tickets.length > 0
          ? tickets.reduce((acc) => acc + (service.estimatedTime || 10), 0) /
            tickets.length
          : service.estimatedTime || 10;

      queues.push({
        id: service.id,
        name: service.name,
        averageTime: Math.round(avg),
        waitingCount: tickets.length,
      });
    }

    return queues;
  }
}
