'use client'

import { useQueue } from '@/contexts/queue-context'
import { Operator, OperatorWithStats, Role, Status } from '@/lib/types'

export function useOperators() {
  const { state, dispatch } = useQueue()

  const createOperator = (operatorData: Omit<Operator, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newOperator: Operator = {
      ...operatorData,
      id: Math.max(...state.operators.map(o => o.id), 0) + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    dispatch({ type: 'ADD_OPERATOR', payload: newOperator })
    return newOperator
  }

  const updateOperator = (id: number, data: Partial<Operator>) => {
    dispatch({ type: 'UPDATE_OPERATOR', payload: { id, data } })
  }

  const deleteOperator = (id: number) => {
    dispatch({ type: 'DELETE_OPERATOR', payload: id })
  }

  const getOperatorById = (id: number) => {
    return state.operators.find(operator => operator.id === id)
  }

  const getActiveOperators = () => {
    return state.operators.filter(operator => operator.active)
  }

  const getOperatorsWithStats = (): OperatorWithStats[] => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return state.operators.map(operator => {
      const operatorTickets = state.tickets.filter(t => t.operatorId === operator.id)
      const todayTickets = operatorTickets.filter(t => t.createdAt >= today)
      const completedToday = todayTickets.filter(t => t.status === Status.COMPLETED)
      
      const averageTime = completedToday.length > 0
        ? completedToday.reduce((acc, t) => acc + (t.actualWaitTime || 0), 0) / completedToday.length
        : 0

      const currentTicket = state.tickets
        .filter(t => t.operatorId === operator.id && t.status === Status.IN_PROGRESS)
        .map(ticket => ({
          ...ticket,
          service: state.services.find(s => s.id === ticket.serviceId)!,
          operator
        }))[0] || null

      return {
        ...operator,
        todayTickets: todayTickets.length,
        averageTime: Math.round(averageTime),
        currentTicket
      }
    })
  }

  return {
    operators: state.operators,
    createOperator,
    updateOperator,
    deleteOperator,
    getOperatorById,
    getActiveOperators,
    getOperatorsWithStats
  }
}
