'use client'

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { Service, Operator, Ticket, SystemSetting, QueueState, Status, Role } from '@/lib/types'
import { mockServices, mockOperators, mockSettings, generateMockTickets } from '@/lib/mock-data'

// Tipos para las acciones
type QueueAction =
  | { type: 'SET_SERVICES'; payload: Service[] }
  | { type: 'ADD_SERVICE'; payload: Service }
  | { type: 'UPDATE_SERVICE'; payload: { id: number; data: Partial<Service> } }
  | { type: 'DELETE_SERVICE'; payload: number }
  | { type: 'SET_OPERATORS'; payload: Operator[] }
  | { type: 'ADD_OPERATOR'; payload: Operator }
  | { type: 'UPDATE_OPERATOR'; payload: { id: number; data: Partial<Operator> } }
  | { type: 'DELETE_OPERATOR'; payload: number }
  | { type: 'SET_TICKETS'; payload: Ticket[] }
  | { type: 'ADD_TICKET'; payload: Ticket }
  | { type: 'UPDATE_TICKET'; payload: { id: number; data: Partial<Ticket> } }
  | { type: 'DELETE_TICKET'; payload: number }
  | { type: 'SET_SETTINGS'; payload: SystemSetting[] }
  | { type: 'UPDATE_SETTING'; payload: { key: string; value: string } }
  | { type: 'UPDATE_TIME' }
  | { type: 'LOAD_FROM_STORAGE'; payload: QueueState }

// Estado inicial
const initialState: QueueState = {
  services: mockServices,
  operators: mockOperators,
  tickets: generateMockTickets(),
  settings: mockSettings,
  currentTime: new Date()
}

// Reducer
function queueReducer(state: QueueState, action: QueueAction): QueueState {
  switch (action.type) {
    case 'SET_SERVICES':
      return { ...state, services: action.payload }
    
    case 'ADD_SERVICE':
      return { ...state, services: [...state.services, action.payload] }
    
    case 'UPDATE_SERVICE':
      return {
        ...state,
        services: state.services.map(service =>
          service.id === action.payload.id
            ? { ...service, ...action.payload.data, updatedAt: new Date() }
            : service
        )
      }
    
    case 'DELETE_SERVICE':
      return {
        ...state,
        services: state.services.filter(service => service.id !== action.payload)
      }
    
    case 'SET_OPERATORS':
      return { ...state, operators: action.payload }
    
    case 'ADD_OPERATOR':
      return { ...state, operators: [...state.operators, action.payload] }
    
    case 'UPDATE_OPERATOR':
      return {
        ...state,
        operators: state.operators.map(operator =>
          operator.id === action.payload.id
            ? { ...operator, ...action.payload.data, updatedAt: new Date() }
            : operator
        )
      }
    
    case 'DELETE_OPERATOR':
      return {
        ...state,
        operators: state.operators.filter(operator => operator.id !== action.payload)
      }
    
    case 'SET_TICKETS':
      return { ...state, tickets: action.payload }
    
    case 'ADD_TICKET':
      return { ...state, tickets: [action.payload, ...state.tickets] }
    
    case 'UPDATE_TICKET':
      return {
        ...state,
        tickets: state.tickets.map(ticket =>
          ticket.id === action.payload.id
            ? { ...ticket, ...action.payload.data }
            : ticket
        )
      }
    
    case 'DELETE_TICKET':
      return {
        ...state,
        tickets: state.tickets.filter(ticket => ticket.id !== action.payload)
      }
    
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload }
    
    case 'UPDATE_SETTING':
      return {
        ...state,
        settings: state.settings.map(setting =>
          setting.key === action.payload.key
            ? { ...setting, value: action.payload.value, updatedAt: new Date() }
            : setting
        )
      }
    
    case 'UPDATE_TIME':
      return { ...state, currentTime: new Date() }
    
    case 'LOAD_FROM_STORAGE':
      return action.payload
    
    default:
      return state
  }
}

// Context
interface QueueContextType {
  state: QueueState
  dispatch: React.Dispatch<QueueAction>
}

const QueueContext = createContext<QueueContextType | undefined>(undefined)

// Provider
interface QueueProviderProps {
  children: ReactNode
}

export function QueueProvider({ children }: QueueProviderProps) {
  const [state, dispatch] = useReducer(queueReducer, initialState)

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const savedState = localStorage.getItem('drizatx-queue-state')
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState)
        // Convertir strings de fecha de vuelta a Date objects
        parsedState.tickets = parsedState.tickets.map((ticket: any) => ({
          ...ticket,
          createdAt: new Date(ticket.createdAt),
          calledAt: ticket.calledAt ? new Date(ticket.calledAt) : null,
          startedAt: ticket.startedAt ? new Date(ticket.startedAt) : null,
          completedAt: ticket.completedAt ? new Date(ticket.completedAt) : null
        }))
        parsedState.services = parsedState.services.map((service: any) => ({
          ...service,
          createdAt: new Date(service.createdAt),
          updatedAt: new Date(service.updatedAt)
        }))
        parsedState.operators = parsedState.operators.map((operator: any) => ({
          ...operator,
          createdAt: new Date(operator.createdAt),
          updatedAt: new Date(operator.updatedAt)
        }))
        parsedState.settings = parsedState.settings.map((setting: any) => ({
          ...setting,
          updatedAt: new Date(setting.updatedAt)
        }))
        parsedState.currentTime = new Date()
        
        dispatch({ type: 'LOAD_FROM_STORAGE', payload: parsedState })
      } catch (error) {
        console.error('Error loading state from localStorage:', error)
      }
    }
  }, [])

  // Guardar en localStorage cuando cambie el estado
  useEffect(() => {
    localStorage.setItem('drizatx-queue-state', JSON.stringify(state))
  }, [state])

  // Actualizar tiempo cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'UPDATE_TIME' })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <QueueContext.Provider value={{ state, dispatch }}>
      {children}
    </QueueContext.Provider>
  )
}

// Hook para usar el context
export function useQueue() {
  const context = useContext(QueueContext)
  if (context === undefined) {
    throw new Error('useQueue must be used within a QueueProvider')
  }
  return context
}
