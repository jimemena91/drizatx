import { Service, Operator, Ticket, SystemSetting, Status, Role } from './types'

// Servicios iniciales
export const mockServices: Service[] = [
  {
    id: 1,
    name: 'Atención General',
    prefix: 'A',
    active: true,
    priority: 1,
    estimatedTime: 8,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 2,
    name: 'Caja',
    prefix: 'B',
    active: true,
    priority: 2,
    estimatedTime: 5,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 3,
    name: 'Consultas',
    prefix: 'C',
    active: true,
    priority: 3,
    estimatedTime: 15,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 4,
    name: 'Reclamos',
    prefix: 'R',
    active: true,
    priority: 4,
    estimatedTime: 12,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
]

// Operadores iniciales
export const mockOperators: Operator[] = [
  {
    id: 1,
    name: 'Juan Pérez',
    email: 'juan@drizatx.com',
    position: 'Puesto 1',
    role: Role.OPERATOR,
    active: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 2,
    name: 'María García',
    email: 'maria@drizatx.com',
    position: 'Puesto 2',
    role: Role.OPERATOR,
    active: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 3,
    name: 'Carlos López',
    email: 'carlos@drizatx.com',
    position: 'Puesto 3',
    role: Role.SUPERVISOR,
    active: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 4,
    name: 'Ana Martín',
    email: 'ana@drizatx.com',
    position: 'Puesto 4',
    role: Role.OPERATOR,
    active: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
]

// Configuraciones del sistema
export const mockSettings: SystemSetting[] = [
  {
    id: 1,
    key: 'maxWaitTime',
    value: '15',
    description: 'Tiempo máximo de espera en minutos',
    updatedAt: new Date()
  },
  {
    id: 2,
    key: 'autoCallNext',
    value: 'true',
    description: 'Llamado automático del siguiente turno',
    updatedAt: new Date()
  },
  {
    id: 3,
    key: 'soundEnabled',
    value: 'true',
    description: 'Sonido habilitado para llamados',
    updatedAt: new Date()
  },
  {
    id: 4,
    key: 'displayTimeout',
    value: '30',
    description: 'Tiempo de rotación de pantallas en segundos',
    updatedAt: new Date()
  },
  {
    id: 5,
    key: 'mobileEnabled',
    value: 'true',
    description: 'App móvil habilitada',
    updatedAt: new Date()
  },
  {
    id: 6,
    key: 'qrEnabled',
    value: 'true',
    description: 'Códigos QR habilitados',
    updatedAt: new Date()
  },
  {
    id: 7,
    key: 'notificationsEnabled',
    value: 'true',
    description: 'Notificaciones habilitadas',
    updatedAt: new Date()
  }
]

// Función para generar tickets simulados
export function generateMockTickets(): Ticket[] {
  const tickets: Ticket[] = []
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  // Generar tickets del día
  for (let i = 0; i < 50; i++) {
    const serviceId = Math.floor(Math.random() * 4) + 1
    const service = mockServices.find(s => s.id === serviceId)!
    const createdAt = new Date(today.getTime() + Math.random() * (now.getTime() - today.getTime()))
    
    let status = Status.COMPLETED
    let calledAt: Date | null = null
    let startedAt: Date | null = null
    let completedAt: Date | null = null
    let operatorId: number | null = null
    
    // Determinar estado basado en la hora de creación
    const hoursSinceCreated = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60)
    
    if (hoursSinceCreated < 0.1) { // Últimos 6 minutos
      status = Status.WAITING
    } else if (hoursSinceCreated < 0.2) { // Entre 6-12 minutos
      status = Math.random() > 0.5 ? Status.CALLED : Status.IN_PROGRESS
      calledAt = new Date(createdAt.getTime() + Math.random() * 300000) // +5 min max
      operatorId = Math.floor(Math.random() * 3) + 1
      
      if (status === Status.IN_PROGRESS) {
        startedAt = new Date(calledAt.getTime() + Math.random() * 120000) // +2 min max
      }
    } else {
      status = Status.COMPLETED
      calledAt = new Date(createdAt.getTime() + Math.random() * 600000) // +10 min max
      startedAt = new Date(calledAt.getTime() + Math.random() * 120000)
      completedAt = new Date(startedAt.getTime() + service.estimatedTime * 60000 + Math.random() * 300000)
      operatorId = Math.floor(Math.random() * 3) + 1
    }
    
    const ticketNumber = `${service.prefix}${(i + 1).toString().padStart(3, '0')}`
    
    tickets.push({
      id: i + 1,
      number: ticketNumber,
      serviceId,
      status,
      priority: 1,
      createdAt,
      calledAt,
      startedAt,
      completedAt,
      operatorId,
      estimatedWaitTime: service.estimatedTime,
      actualWaitTime: completedAt ? Math.round((completedAt.getTime() - createdAt.getTime()) / 60000) : null,
      mobilePhone: Math.random() > 0.7 ? `+54911${Math.floor(Math.random() * 90000000) + 10000000}` : null,
      notificationSent: false
    })
  }
  
  return tickets.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}
