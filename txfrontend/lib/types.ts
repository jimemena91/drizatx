// Enums
export enum Status {
  WAITING = 'WAITING',
  CALLED = 'CALLED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum Role {
  OPERATOR = 'OPERATOR',
  SUPERVISOR = 'SUPERVISOR',
  ADMIN = 'ADMIN'
}

// Interfaces principales
export interface Service {
  id: number
  name: string
  prefix: string
  active: boolean
  priority: number
  estimatedTime: number
  createdAt: Date
  updatedAt: Date
}

export interface Operator {
  id: number
  name: string
  email: string
  position: string | null
  role: Role
  active: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Ticket {
  id: number
  number: string
  serviceId: number
  status: Status
  priority: number
  createdAt: Date
  calledAt: Date | null
  startedAt: Date | null
  completedAt: Date | null
  operatorId: number | null
  estimatedWaitTime: number | null
  actualWaitTime: number | null
  mobilePhone: string | null
  notificationSent: boolean
}

export interface SystemSetting {
  id: number
  key: string
  value: string
  description: string | null
  updatedAt: Date
}

// Tipos extendidos
export interface TicketWithRelations extends Ticket {
  service: Service
  operator?: Operator | null
}

export interface ServiceWithStats extends Service {
  waitingCount: number
  averageTime: number
  todayTickets: number
}

export interface OperatorWithStats extends Operator {
  todayTickets: number
  averageTime: number
  currentTicket?: TicketWithRelations | null
}

// Tipos para el estado global
export interface QueueState {
  services: Service[]
  operators: Operator[]
  tickets: Ticket[]
  settings: SystemSetting[]
  currentTime: Date
}

// Tipos para métricas
export interface DashboardMetrics {
  totalInQueue: number
  averageWaitTime: number
  attendedToday: number
  serviceLevel: number
  peakHour: number
}

export interface QueueStatus {
  queues: ServiceWithStats[]
  currentTicket?: TicketWithRelations | null
  nextTickets: TicketWithRelations[]
  todayMetrics: DashboardMetrics
}
