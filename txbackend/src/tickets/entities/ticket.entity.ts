export enum TicketStatus {
  WAITING = 'WAITING',
  CALLED = 'CALLED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class Ticket {
  id: number;
  number: string; // Ej: A012
  serviceId: number;
  operatorId?: number;
  createdAt: Date;
  status: TicketStatus;
  estimatedWaitTime?: number;
  actualWaitTime?: number;
  mobilePhone?: string;
}
