import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { Status } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as Status | null
    const serviceId = searchParams.get('service_id')
    
    const where: any = {}
    
    if (status) {
      where.status = status
    }
    
    if (serviceId) {
      where.serviceId = parseInt(serviceId)
    }
    
    const tickets = await prisma.ticket.findMany({
      where,
      include: {
        service: true,
        operator: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json(tickets)
  } catch (error) {
    console.error('Error fetching tickets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { serviceId, mobilePhone, priority = 1 } = await request.json()
    
    // Obtener el servicio
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    })
    
    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }
    
    // Generar número de turno
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const lastTicket = await prisma.ticket.findFirst({
      where: {
        serviceId,
        createdAt: {
          gte: today
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    let nextNumber = 1
    if (lastTicket) {
      const lastNumber = parseInt(lastTicket.number.substring(1))
      nextNumber = lastNumber + 1
    }
    
    const ticketNumber = `${service.prefix}${nextNumber.toString().padStart(3, '0')}`
    
    // Calcular tiempo de espera estimado
    const waitingCount = await prisma.ticket.count({
      where: {
        serviceId,
        status: {
          in: ['WAITING', 'CALLED']
        }
      }
    })
    
    const estimatedWaitTime = waitingCount * service.estimatedTime
    
    const newTicket = await prisma.ticket.create({
      data: {
        number: ticketNumber,
        serviceId,
        estimatedWaitTime,
        mobilePhone,
        priority
      },
      include: {
        service: true,
        operator: true
      }
    })
    
    return NextResponse.json(newTicket, { status: 201 })
  } catch (error) {
    console.error('Error creating ticket:', error)
    return NextResponse.json(
      { error: 'Failed to create ticket' },
      { status: 500 }
    )
  }
}
