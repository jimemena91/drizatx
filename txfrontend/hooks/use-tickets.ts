'use client'

import { useState, useEffect } from 'react'
import { useQueue } from '@/contexts/queue-context'
import { Ticket, Status, TicketWithRelations } from '@/lib/types'

export function useTickets() {
  const { state, dispatch } = useQueue()
  const [tickets, setTickets] = useState<TicketWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTickets = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/tickets')
      if (!response.ok) {
        throw new Error('Failed to fetch tickets')
      }
      const data = await response.json()
      setTickets(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const createTicket = (serviceId: number, mobilePhone?: string, priority: number = 1) => {
    const service = state.services.find(s => s.id === serviceId)
    if (!service) {
      throw new Error('Service not found')
    }

    // Generar número de turno
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const todayTickets = state.tickets.filter(t => 
      t.serviceId === serviceId && 
      t.createdAt >= today
    )
    
    const nextNumber = todayTickets.length + 1
    const ticketNumber = `${service.prefix}${nextNumber.toString().padStart(3, '0')}`

    // Calcular tiempo de espera estimado
    const waitingCount = state.tickets.filter(t => 
      t.serviceId === serviceId && 
      (t.status === Status.WAITING || t.status === Status.CALLED)
    ).length

    const estimatedWaitTime = waitingCount * service.estimatedTime

    const newTicket: Ticket = {
      id: Math.max(...state.tickets.map(t => t.id), 0) + 1,
      number: ticketNumber,
      serviceId,
      status: Status.WAITING,
      priority,
      createdAt: new Date(),
      calledAt: null,
      startedAt: null,
      completedAt: null,
      operatorId: null,
      estimatedWaitTime,
      actualWaitTime: null,
      mobilePhone: mobilePhone || null,
      notificationSent: false
    }

    dispatch({ type: 'ADD_TICKET', payload: newTicket })
    return newTicket
  }

  const updateTicketStatus = (id: number, status: Status, operatorId?: number) => {
    const updateData: Partial<Ticket> = { status }
    
    if (operatorId) {
      updateData.operatorId = operatorId
    }

    // Agregar timestamps según el estado
    const now = new Date()
    switch (status) {
      case Status.CALLED:
        updateData.calledAt = now
        break
      case Status.IN_PROGRESS:
        updateData.startedAt = now
        break
      case Status.COMPLETED:
        updateData.completedAt = now
        // Calcular tiempo real de espera
        const ticket = state.tickets.find(t => t.id === id)
        if (ticket) {
          updateData.actualWaitTime = Math.round((now.getTime() - ticket.createdAt.getTime()) / 60000)
        }
        break
    }

    dispatch({ type: 'UPDATE_TICKET', payload: { id, data: updateData } })
  }

  const callNextTicket = (operatorId: number) => {
    const nextTicket = state.tickets
      .filter(t => t.status === Status.WAITING)
      .sort((a, b) => {
        // Ordenar por prioridad (desc) y luego por fecha de creación (asc)
        if (a.priority !== b.priority) {
          return b.priority - a.priority
        }
        return a.createdAt.getTime() - b.createdAt.getTime()
      })[0]

    if (nextTicket) {
      updateTicketStatus(nextTicket.id, Status.CALLED, operatorId)
      return nextTicket
    }
    return null
  }

  const getTicketsWithRelations = (): TicketWithRelations[] => {
    return state.tickets.map(ticket => ({
      ...ticket,
      service: state.services.find(s => s.id === ticket.serviceId)!,
      operator: ticket.operatorId ? state.operators.find(o => o.id === ticket.operatorId) : null
    }))
  }

  const getTicketsByStatus = (status: Status) => {
    return getTicketsWithRelations().filter(ticket => ticket.status === status)
  }

  const getTicketsByService = (serviceId: number) => {
    return getTicketsWithRelations().filter(ticket => ticket.serviceId === serviceId)
  }

  const getTodayTickets = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return getTicketsWithRelations().filter(ticket => ticket.createdAt >= today)
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  return {
    tickets,
    loading,
    error,
    createTicket,
    updateTicketStatus,
    callNextTicket,
    getTicketsWithRelations,
    getTicketsByStatus,
    getTicketsByService,
    getTodayTickets,
    refetch: fetchTickets
  }
}
