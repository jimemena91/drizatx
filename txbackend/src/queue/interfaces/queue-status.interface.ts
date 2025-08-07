// Resumen por servicio (cola individual)
export interface QueueSummary {
  id: number
  name: string
  averageTime: number
  waitingCount: number
}

// Métricas del día
export interface TodayMetrics {
  averageWaitTime: number
  totalInQueue: number
  attendedToday: number
  serviceLevel: number
  peakHour: number
}

// Respuesta completa que espera el frontend (Dashboard, Display, etc.)
export interface QueueStatusResponse {
  todayMetrics: TodayMetrics
  queues: QueueSummary[]
  currentTicket: any // si querés, lo podés cambiar por tipo `Ticket`
  nextTickets: any[] // idem, se puede usar `Ticket[]` si querés
}
