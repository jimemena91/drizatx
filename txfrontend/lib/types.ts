export type TicketStatus = 'WAITING' | 'CALLED' | 'COMPLETED';

export interface Ticket {
  id: number;
  number: string;
  serviceId: number;
  operatorId?: number | null;
  status: TicketStatus;
  createdAt: string; // formato ISO
  startedAt?: string | null;
  endedAt?: string | null;
  mobilePhone?: string | null;
}

export const Status = {
  WAITING: 'WAITING',
  CALLED: 'CALLED',
  COMPLETED: 'COMPLETED',
} as const;

export interface Service {
  id: number;
  name: string;
  averageTime: number;
  createdAt: string;
  updatedAt: string;
}

export interface Operator {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
export enum Role {
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
}