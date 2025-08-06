import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const services = await prisma.service.findMany({
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
      orderBy: {
        priority: 'asc'
      }
    })
    
    return NextResponse.json(services)
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, prefix, priority, estimatedTime, active } = await request.json()
    
    const newService = await prisma.service.create({
      data: {
        name,
        prefix,
        priority,
        estimatedTime,
        active
      }
    })
    
    return NextResponse.json(newService, { status: 201 })
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    )
  }
}
