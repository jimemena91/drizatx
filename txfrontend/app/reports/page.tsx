"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, TrendingDown, Users, Clock, Target, Download, Calendar, Filter } from 'lucide-react'
import { useQueueStatus } from "@/hooks/use-queue-status"
import { useTickets } from "@/hooks/use-tickets"
import { useServices } from "@/hooks/use-services"
import { useOperators } from "@/hooks/use-operators"
import { Status } from "@/lib/types"

export default function ReportsPage() {
  const { getQueueStatus } = useQueueStatus()
  const { getTicketsWithRelations } = useTickets()
  const { services } = useServices()
  const { getOperatorsWithStats } = useOperators()

  const [queueStatus, setQueueStatus] = useState(getQueueStatus())
  const [allTickets, setAllTickets] = useState(getTicketsWithRelations())
  const [operatorsStats, setOperatorsStats] = useState(getOperatorsWithStats())

  // Actualizar datos cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setQueueStatus(getQueueStatus())
      setAllTickets(getTicketsWithRelations())
      setOperatorsStats(getOperatorsWithStats())
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Generar datos para gráficos
  const generateHourlyData = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const todayTickets = allTickets.filter(t => t.createdAt >= today)
    const hourlyData = []

    for (let hour = 8; hour <= 18; hour++) {
      const hourTickets = todayTickets.filter(t => t.createdAt.getHours() === hour)
      const completedTickets = hourTickets.filter(t => t.status === Status.COMPLETED)
      const avgWaitTime = completedTickets.length > 0
        ? completedTickets.reduce((acc, t) => acc + (t.actualWaitTime || 0), 0) / completedTickets.length
        : 0

      hourlyData.push({
        hour: `${hour}:00`,
        tickets: hourTickets.length,
        avgWait: Math.round(avgWaitTime)
      })
    }

    return hourlyData
  }

  const generateWeeklyData = () => {
    const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
    const weeklyData = []

    for (let i = 0; i < 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      
      const dayTickets = allTickets.filter(t => {
        const ticketDate = new Date(t.createdAt)
        ticketDate.setHours(0, 0, 0, 0)
        return ticketDate.getTime() === date.getTime()
      })

      const completedTickets = dayTickets.filter(t => t.status === Status.COMPLETED)
      const satisfaction = 3.8 + Math.random() * 1.4 // Simular satisfacción

      weeklyData.unshift({
        day: weekDays[date.getDay()],
        tickets: dayTickets.length,
        satisfaction: Math.round(satisfaction * 10) / 10
      })
    }

    return weeklyData
  }

  const generateServiceData = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const todayTickets = allTickets.filter(t => t.createdAt >= today)
    const total = todayTickets.length

    return services.map((service, index) => {
      const serviceTickets = todayTickets.filter(t => t.serviceId === service.id)
      const percentage = total > 0 ? (serviceTickets.length / total) * 100 : 0
      
      const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
      
      return {
        name: service.name,
        value: Math.round(percentage),
        count: serviceTickets.length,
        color: colors[index % colors.length]
      }
    })
  }

  const hourlyData = generateHourlyData()
  const weeklyData = generateWeeklyData()
  const serviceData = generateServiceData()

  const handleExport = () => {
    const data = {
      fecha: new Date().toLocaleDateString(),
      metricas: queueStatus.todayMetrics,
      servicios: serviceData,
      operadores: operatorsStats
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reporte-drizatx-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reportes y Analytics</h1>
            <p className="text-gray-600">Análisis de desempeño y métricas operativas</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Período
            </Button>
            <Button onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* KPIs principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tickets Procesados</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{queueStatus.todayMetrics.attendedToday}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                Completados hoy
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{queueStatus.todayMetrics.averageWaitTime} min</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingDown className="h-3 w-3 mr-1 text-green-500" />
                Tiempo de espera
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nivel de Servicio</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{queueStatus.todayMetrics.serviceLevel}%</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Badge variant={queueStatus.todayMetrics.serviceLevel >= 90 ? "default" : "secondary"} className="text-xs">
                  Meta: 90%
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Cola Ahora</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{queueStatus.todayMetrics.totalInQueue}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                Esperando atención
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="daily" className="space-y-6">
          <TabsList>
            <TabsTrigger value="daily">Análisis Diario</TabsTrigger>
            <TabsTrigger value="weekly">Análisis Semanal</TabsTrigger>
            <TabsTrigger value="services">Por Servicios</TabsTrigger>
            <TabsTrigger value="operators">Operadores</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tickets por Hora</CardTitle>
                  <CardDescription>Distribución de turnos durante el día</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={hourlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="tickets" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tiempo de Espera por Hora</CardTitle>
                  <CardDescription>Evolución del tiempo promedio de espera</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={hourlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="avgWait" stroke="#EF4444" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Resumen del día */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Día</CardTitle>
                <CardDescription>Métricas principales de hoy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {allTickets.filter(t => {
                        const today = new Date()
                        today.setHours(0, 0, 0, 0)
                        return t.createdAt >= today
                      }).length}
                    </div>
                    <p className="text-gray-600">Total de Turnos</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {queueStatus.todayMetrics.peakHour}:00
                    </div>
                    <p className="text-gray-600">Hora Pico</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {operatorsStats.filter(o => o.active).length}
                    </div>
                    <p className="text-gray-600">Operadores Activos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="weekly" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tickets por Día de la Semana</CardTitle>
                  <CardDescription>Volumen de atención semanal</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="tickets" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Satisfacción por Día</CardTitle>
                  <CardDescription>Calificación promedio de los usuarios</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis domain={[3.5, 5]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="satisfaction" stroke="#F59E0B" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Distribución por Servicios</CardTitle>
                  <CardDescription>Porcentaje de tickets por tipo de servicio</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={serviceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name} ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {serviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Métricas por Servicio</CardTitle>
                  <CardDescription>Desempeño detallado por tipo de atención</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {serviceData.map((service) => {
                      const serviceInfo = services.find(s => s.name === service.name)
                      const serviceStats = queueStatus.queues.find(q => q.name === service.name)
                      
                      return (
                        <div key={service.name} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: service.color }} />
                            <div>
                              <h3 className="font-medium">{service.name}</h3>
                              <p className="text-sm text-gray-600">{service.value}% del total</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{service.count} tickets</div>
                            <div className="text-sm text-gray-600">
                              {serviceStats?.averageTime || serviceInfo?.estimatedTime} min promedio
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="operators" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Desempeño de Operadores</CardTitle>
                <CardDescription>Métricas individuales de productividad</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {operatorsStats.map((operator) => (
                    <div key={operator.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            operator.active ? "bg-green-500" : "bg-gray-500"
                          }`}
                        />
                        <div>
                          <h3 className="font-medium">{operator.name}</h3>
                          <p className="text-sm text-gray-600">{operator.position}</p>
                          <Badge variant={operator.role === 'SUPERVISOR' ? 'default' : 'secondary'} className="text-xs mt-1">
                            {operator.role === 'SUPERVISOR' ? 'Supervisor' : 'Operador'}
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="font-bold">{operator.todayTickets}</div>
                          <div className="text-xs text-gray-600">Tickets</div>
                        </div>
                        <div>
                          <div className="font-bold">{operator.averageTime} min</div>
                          <div className="text-xs text-gray-600">Tiempo Prom.</div>
                        </div>
                        <div>
                          <div className="font-bold">
                            {operator.currentTicket ? operator.currentTicket.number : '-'}
                          </div>
                          <div className="text-xs text-gray-600">Turno Actual</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
