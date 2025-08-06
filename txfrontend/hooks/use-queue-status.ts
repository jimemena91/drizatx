'use client'

import { useCallback } from 'react';
import { useQueue } from '@/contexts/queue-context';
import { QueueStatus, ServiceWithStats, DashboardMetrics, Status } from '@/lib/types';

export function useQueueStatus() {
  const { state } = useQueue();

  const getQueueStatus = useCallback((): QueueStatus => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calcular estadísticas por servicio
    const queues: ServiceWithStats[] = state.services
      .filter(service => service.active)
      .map(service => {
        const serviceTickets = state.tickets.filter(t => t.serviceId === service.id);
        const todayTickets = serviceTickets.filter(t => t.createdAt >= today);
        const waitingCount = serviceTickets.filter(t =>
          t.status === Status.WAITING || t.status === Status.CALLED
        ).length;

        // Calcular tiempo promedio real del día
        const completedToday = todayTickets.filter(t =>
          t.status === Status.COMPLETED && t.actualWaitTime
        );
        const averageTime = completedToday.length > 0
          ? completedToday.reduce((acc, t) => acc + (t.actualWaitTime || 0), 0) / completedToday.length
          : service.estimatedTime;

        return {
          ...service,
          waitingCount,
          averageTime: Math.round(averageTime),
          todayTickets: todayTickets.length
        };
      })
      .sort((a, b) => a.priority - b.priority);

    // Turno actual (en progreso)
    const currentTicket = state.tickets
      .filter(t => t.status === Status.IN_PROGRESS)
      .map(ticket => ({
        ...ticket,
        service: state.services.find(s => s.id === ticket.serviceId)!,
        operator: ticket.operatorId ? state.operators.find(o => o.id === ticket.operatorId) : null
      }))[0] || null;

    // Próximos turnos
    const nextTickets = state.tickets
      .filter(t => t.status === Status.WAITING)
      .sort((a, b) => {
        if (a.priority !== b.priority) {
          return b.priority - a.priority;
        }
        return a.createdAt.getTime() - b.createdAt.getTime();
      })
      .slice(0, 5)
      .map(ticket => ({
        ...ticket,
        service: state.services.find(s => s.id === ticket.serviceId)!,
        operator: ticket.operatorId ? state.operators.find(o => o.id === ticket.operatorId) : null
      }));

    // Métricas del día
    const todayTickets = state.tickets.filter(t => t.createdAt >= today);
    const completedTickets = todayTickets.filter(t => t.status === Status.COMPLETED);
    const waitingTickets = todayTickets.filter(t => t.status === Status.WAITING);

    const averageWaitTime = completedTickets.length > 0
      ? completedTickets.reduce((acc, t) => acc + (t.actualWaitTime || 0), 0) / completedTickets.length
      : 0;

    // Calcular nivel de servicio (% de tickets atendidos en tiempo esperado)
    const onTimeTickets = completedTickets.filter(t => {
      const service = state.services.find(s => s.id === t.serviceId);
      return service && (t.actualWaitTime || 0) <= service.estimatedTime;
    });
    const serviceLevel = completedTickets.length > 0
      ? (onTimeTickets.length / completedTickets.length) * 100
      : 0;

    // Calcular hora pico
    const hourCounts = new Array(24).fill(0);
    todayTickets.forEach(ticket => {
      const hour = ticket.createdAt.getHours();
      hourCounts[hour]++;
    });
    const peakHour = hourCounts.indexOf(Math.max(...hourCounts));

    const todayMetrics: DashboardMetrics = {
      totalInQueue: waitingTickets.length,
      averageWaitTime: Math.round(averageWaitTime),
      attendedToday: completedTickets.length,
      serviceLevel: Math.round(serviceLevel),
      peakHour
    };

    return {
      queues,
      currentTicket,
      nextTickets,
      todayMetrics
    };
  }, [state]);

  return {
    getQueueStatus,
    currentTime: state.currentTime
  };
}
