import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Obtener servicios con estadísticas
    const services = await prisma.service.findMany({
      where: { active: true },
      include: {
        _count: {
          select: {
            tickets: {
              where: {
                status: {
                  in: ['WAITING', 'CALLED']
                }
              }
            }
          }
        }
      },
      orderBy: { priority: 'asc' }
    })
    
    // Obtener turno actual
    const currentTicket = await prisma.ticket.findFirst({
      where: { status: 'IN_PROGRESS' },
      include: {
        service: true,
        operator: true
      },
      orderBy: { startedAt: 'asc' }
    })
    
    // Obtener próximos turnos
    const nextTickets = await prisma.ticket.findMany({
      where: { status: 'WAITING' },
      include: {
        service: true
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'asc' }
      ],
      take: 5
    })
    
    // Métricas del día
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const todayTickets = await prisma.ticket.findMany({
      where: {
        createdAt: {
          gte: today
        }
      }
    })
    
    const totalTickets = todayTickets.length
    const completedTickets = todayTickets.filter(t => t.status === 'COMPLETED').length
    const waitingTickets = todayTickets.filter(t => t.status === 'WAITING').length
    
    // Calcular tiempo promedio de espera
    const completedWithTimes = todayTickets.filter(t => 
      t.status === 'COMPLETED' && t.completedAt && t.createdAt
    )
    
    const averageWaitTime = completedWithTimes.length > 0 
      ? completedWithTimes.reduce((acc, ticket) => {
          const waitTime = (ticket.completedAt!.getTime() - ticket.createdAt.getTime()) / (1000 * 60)
          return acc + waitTime
        }, 0) / completedWithTimes.length
      : 0
    
    return NextResponse.json({
      queues: services.map(service => ({
        ...service,
        waitingCount: service._count.tickets,
        averageTime: service.estimatedTime
      })),
      currentTicket,
      nextTickets,
      todayMetrics: {
        totalTickets,
        completedTickets,
        waitingTickets,
        averageWaitTime: Math.round(averageWaitTime)
      }
    })
  } catch (error) {
    console.error('Error fetching queue status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch queue status' },
      { status: 500 }
    )
  }
}
