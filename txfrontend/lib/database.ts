import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const sql = neon(process.env.DATABASE_URL)

export { sql }

// Tipos TypeScript para las tablas
export interface Service {
  id: number
  name: string
  prefix: string
  active: boolean
  priority: number
  estimated_time: number
  created_at: Date
  updated_at: Date
}

export interface Operator {
  id: number
  name: string
  email: string
  password_hash: string
  position: string | null
  role: 'operator' | 'supervisor' | 'admin'
  active: boolean
  created_at: Date
  updated_at: Date
}

export interface Ticket {
  id: number
  number: string
  service_id: number
  status: 'waiting' | 'called' | 'in_progress' | 'completed' | 'cancelled'
  priority: number
  created_at: Date
  called_at: Date | null
  started_at: Date | null
  completed_at: Date | null
  operator_id: number | null
  estimated_wait_time: number | null
  actual_wait_time: number | null
  mobile_phone: string | null
  notification_sent: boolean
}

export interface SystemSetting {
  id: number
  key: string
  value: string
  description: string | null
  updated_at: Date
}

export interface DailyMetric {
  id: number
  date: Date
  total_tickets: number
  completed_tickets: number
  cancelled_tickets: number
  average_wait_time: number
  peak_hour: number | null
  service_level_percentage: number
  created_at: Date
}

// Funciones utilitarias
export async function getNextTicketNumber(serviceId: number): Promise<string> {
  const service = await sql`
    SELECT prefix FROM services WHERE id = ${serviceId}
  `
  
  if (!service.length) {
    throw new Error('Service not found')
  }

  const prefix = service[0].prefix
  
  // Obtener el último número del día para este servicio
  const today = new Date().toISOString().split('T')[0]
  const lastTicket = await sql`
    SELECT number FROM tickets 
    WHERE service_id = ${serviceId} 
    AND DATE(created_at) = ${today}
    ORDER BY created_at DESC 
    LIMIT 1
  `

  let nextNumber = 1
  if (lastTicket.length > 0) {
    const lastNumber = parseInt(lastTicket[0].number.substring(1))
    nextNumber = lastNumber + 1
  }

  return `${prefix}${nextNumber.toString().padStart(3, '0')}`
}

export async function calculateWaitTime(serviceId: number): Promise<number> {
  // Calcular tiempo de espera basado en la cola actual y tiempo promedio del servicio
  const queueCount = await sql`
    SELECT COUNT(*) as count FROM tickets 
    WHERE service_id = ${serviceId} 
    AND status IN ('waiting', 'called')
  `

  const service = await sql`
    SELECT estimated_time FROM services WHERE id = ${serviceId}
  `

  const count = parseInt(queueCount[0].count)
  const estimatedTime = service[0]?.estimated_time || 10

  return count * estimatedTime
}
