'use client'

import { useState, useEffect } from 'react'
import { useQueue } from '@/contexts/queue-context'
import { Ticket, Status, Service, Operator } from '@/lib/types'

type TicketWithRelations = Ticket & {
  service: Service
  operator: Operator | null
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'; // fallback dev

export function useTickets() {
  const { state, dispatch } = useQueue()
  const [tickets, setTickets] = useState<TicketWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTickets = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/tickets`)
      if (!response.ok) {
        throw new Error('Failed to fetch tickets')
      }
      const data = await response.json()
       const parsed: Ticket[] = data.map((t: any) => ({
        ...t,
        createdAt: new Date(t.createdAt),
        calledAt: t.calledAt ? new Date(t.calledAt) : null,
        startedAt: t.startedAt ? new Date(t.startedAt) : null,
        completedAt: t.completedAt ? new Date(t.completedAt) : null,
      }))
      dispatch({ type: 'SET_TICKETS', payload: parsed })
      const withRelations: TicketWithRelations[] = parsed.map(ticket => ({
        ...ticket,
        service: state.services.find(s => s.id === ticket.serviceId)!,
        operator: ticket.operatorId ? state.operators.find(o => o.id === ticket.operatorId) : null,
      }))
      setTickets(withRelations)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }
  const createTicket = async (serviceId: number, mobilePhone?: string) => {
    const response = await fetch(`${API_URL}/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceId, mobilePhone }),
    })
    if (!response.ok) {
      throw new Error('Failed to create ticket')
    }
    const newTicket = await response.json()
    const parsed: Ticket = {
      ...newTicket,
      createdAt: new Date(newTicket.createdAt),
      calledAt: newTicket.calledAt ? new Date(newTicket.calledAt) : null,
      startedAt: newTicket.startedAt ? new Date(newTicket.startedAt) : null,
      completedAt: newTicket.completedAt ? new Date(newTicket.completedAt) : null,
    } as Ticket
    dispatch({ type: 'ADD_TICKET', payload: parsed })
    const withRelations: TicketWithRelations = {
      ...parsed,
      service: state.services.find(s => s.id === parsed.serviceId)!,
      operator: parsed.operatorId ? state.operators.find(o => o.id === parsed.operatorId) : null,
    }
     setTickets(prev => [withRelations, ...prev])
    return parsed
  }
  const updateTicketStatus = async (
    id: number,
    status: Status,
    operatorId?: number,
  ) => {
    const response = await fetch(`${API_URL}/tickets/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, operatorId }),
    })
    if (!response.ok) {
      throw new Error('Failed to update ticket')
    }
     const updated = await response.json()
    const parsed: Ticket = {
      ...updated,
      createdAt: new Date(updated.createdAt),
      calledAt: updated.calledAt ? new Date(updated.calledAt) : null,
      startedAt: updated.startedAt ? new Date(updated.startedAt) : null,
      completedAt: updated.completedAt ? new Date(updated.completedAt) : null,
    } as Ticket
    dispatch({ type: 'UPDATE_TICKET', payload: { id, data: parsed } })
    const withRelations: TicketWithRelations = {
      ...parsed,
      service: state.services.find(s => s.id === parsed.serviceId)!,
      operator: parsed.operatorId ? state.operators.find(o => o.id === parsed.operatorId) : null,
    }
     setTickets(prev => prev.map(t => (t.id === id ? withRelations : t)))
    return parsed
  }
  const callNextTicket = async (operatorId: number) => {
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
        await updateTicketStatus(nextTicket.id, Status.CALLED, operatorId)
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