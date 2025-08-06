"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Clock, AlertTriangle, CheckCircle, UserCheck, TrendingUp, Activity, Play, Pause, Square } from 'lucide-react'
import { useQueueStatus } from "@/hooks/use-queue-status"
import { useTickets } from "@/hooks/use-tickets"
import { useOperators } from "@/hooks/use-operators"
import { Status } from "@/lib/types"

export default function DashboardPage() {
  const { getQueueStatus, currentTime } = useQueueStatus()
  const { callNextTicket, updateTicketStatus } = useTickets()
  const { getOperatorsWithStats } = useOperators()
  
  const [queueStatus, setQueueStatus] = useState(getQueueStatus())
  const [operatorsWithStats, setOperatorsWithStats] = useState(getOperatorsWithStats())

  // Actualizar datos cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setQueueStatus(getQueueStatus())
      setOperatorsWithStats(getOperatorsWithStats())
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleCallNext = (operatorId: number) => {
    const nextTicket = callNextTicket(operatorId)
    if (nextTicket) {
      setQueueStatus(getQueueStatus())
      setOperatorsWithStats(getOperatorsWithStats())
    }
  }

  const handleStartAttention = (ticketId: number) => {
    updateTicketStatus(ticketId, Status.IN_PROGRESS)
    setQueueStatus(getQueueStatus())
    setOperatorsWithStats(getOperatorsWithStats())
  }

  const handleCompleteTicket = (ticketId: number) => {
    updateTicketStatus(ticketId, Status.COMPLETED)
    setQueueStatus(getQueueStatus())
    setOperatorsWithStats(getOperatorsWithStats())
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Operativo</h1>
          <p className="text-gray-600">Monitoreo en tiempo real - {currentTime.toLocaleTimeString()}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Activity className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button>
            <AlertTriangle className="h-4 w-4 mr-2" />
            Alertas
          </Button>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total en Cola</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{queueStatus.todayMetrics.totalInQueue}</div>
            <p className="text-xs text-muted-foreground">Esperando atención</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{queueStatus.todayMetrics.averageWaitTime} min</div>
            <p className="text-xs text-muted-foreground">Tiempo de espera</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atendidos Hoy</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{queueStatus.todayMetrics.attendedToday}</div>
            <p className="text-xs text-muted-foreground">Tickets completados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nivel de Servicio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{queueStatus.todayMetrics.serviceLevel}%</div>
            <p className="text-xs text-muted-foreground">Meta: 90%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Estado de las Colas */}
        <Card>
          <CardHeader>
            <CardTitle>Estado de las Colas</CardTitle>
            <CardDescription>Monitoreo en tiempo real por tipo de servicio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {queueStatus.queues.map((queue) => (
                <div key={queue.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">{queue.name}</h3>
                      <Badge variant={queue.waitingCount > 15 ? "destructive" : queue.waitingCount > 10 ? "secondary" : "default"}>
                        {queue.waitingCount > 15 ? "Atención" : "Normal"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {queue.waitingCount} esperando
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {queue.averageTime} min promedio
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{queue.waitingCount}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Estado de Operadores */}
        <Card>
          <CardHeader>
            <CardTitle>Estado de Operadores</CardTitle>
            <CardDescription>Puestos de atención y disponibilidad</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {operatorsWithStats.map((operator) => (
                <div key={operator.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        operator.currentTicket
                          ? "bg-red-500"
                          : operator.active
                            ? "bg-green-500"
                            : "bg-gray-500"
                      }`}
                    />
                    <div>
                      <h3 className="font-medium">{operator.name}</h3>
                      <p className="text-sm text-gray-600">{operator.position}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right mr-4">
                      <Badge
                        variant={
                          operator.currentTicket
                            ? "destructive"
                            : operator.active
                              ? "default"
                              : "secondary"
                        }
                      >
                        {operator.currentTicket
                          ? "Ocupado"
                          : operator.active
                            ? "Disponible"
                            : "Inactivo"}
                      </Badge>
                      {operator.currentTicket && (
                        <p className="text-sm text-gray-600 mt-1">
                          Turno: {operator.currentTicket.number}
                        </p>
                      )}
                    </div>
                    
                    {/* Controles del operador */}
                    <div className="flex flex-col gap-1">
                      {operator.active && !operator.currentTicket && (
                        <Button
                          size="sm"
                          onClick={() => handleCallNext(operator.id)}
                          className="text-xs"
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Llamar
                        </Button>
                      )}
                      
                      {operator.currentTicket && operator.currentTicket.status === Status.CALLED && (
                        <Button
                          size="sm"
                          onClick={() => handleStartAttention(operator.currentTicket!.id)}
                          className="text-xs"
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Iniciar
                        </Button>
                      )}
                      
                      {operator.currentTicket && operator.currentTicket.status === Status.IN_PROGRESS && (
                        <Button
                          size="sm"
                          onClick={() => handleCompleteTicket(operator.currentTicket!.id)}
                          className="text-xs"
                          variant="outline"
                        >
                          <Square className="h-3 w-3 mr-1" />
                          Finalizar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Turno actual destacado */}
      {queueStatus.currentTicket && (
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="text-white">🔊 Turno en Atención</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold mb-2">{queueStatus.currentTicket.number}</div>
                <p className="text-blue-100">
                  {queueStatus.currentTicket.service.name} - {queueStatus.currentTicket.operator?.position}
                </p>
              </div>
              <div className="text-right">
                <p className="text-blue-100">Operador:</p>
                <p className="font-medium">{queueStatus.currentTicket.operator?.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Próximos turnos */}
      {queueStatus.nextTickets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Próximos Turnos</CardTitle>
            <CardDescription>Turnos en espera por orden de prioridad</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {queueStatus.nextTickets.map((ticket, index) => (
                <div key={ticket.id} className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{ticket.number}</div>
                  <p className="text-sm text-gray-600">{ticket.service.name}</p>
                  <Badge variant="outline" className="mt-2">
                    {index === 0 ? "Siguiente" : `+${index + 1}`}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alertas del Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Alertas del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {queueStatus.queues.some(q => q.waitingCount > 15) && (
              <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Colas con alta demanda detectadas</p>
                  <p className="text-xs text-gray-600">
                    {queueStatus.queues.filter(q => q.waitingCount > 15).map(q => q.name).join(', ')} 
                    {' '}con más de 15 personas esperando
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  Revisar
                </Button>
              </div>
            )}

            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Nivel de servicio dentro de la meta</p>
                <p className="text-xs text-gray-600">{queueStatus.todayMetrics.serviceLevel}% - Meta: 90%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
