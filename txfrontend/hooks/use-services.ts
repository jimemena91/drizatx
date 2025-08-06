'use client'

import { useQueue } from '@/contexts/queue-context'
import { Service } from '@/lib/types'

export function useServices() {
  const { state, dispatch } = useQueue()

  const createService = (serviceData: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newService: Service = {
      ...serviceData,
      id: Math.max(...state.services.map(s => s.id), 0) + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    dispatch({ type: 'ADD_SERVICE', payload: newService })
    return newService
  }

  const updateService = (id: number, data: Partial<Service>) => {
    dispatch({ type: 'UPDATE_SERVICE', payload: { id, data } })
  }

  const deleteService = (id: number) => {
    dispatch({ type: 'DELETE_SERVICE', payload: id })
  }

  const getServiceById = (id: number) => {
    return state.services.find(service => service.id === id)
  }

  const getActiveServices = () => {
    return state.services.filter(service => service.active)
  }

  return {
    services: state.services,
    createService,
    updateService,
    deleteService,
    getServiceById,
    getActiveServices
  }
}
