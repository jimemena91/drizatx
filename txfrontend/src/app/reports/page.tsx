"use client"

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
import { TrendingUp, TrendingDown, Users, Clock, Target, Download, Calendar, Filter } from "lucide-react"

export default function ReportsPage() {
  const dailyData = [
    { hour: "08:00", tickets: 12, avgWait: 5 },
    { hour: "09:00", tickets: 25, avgWait: 8 },
    { hour: "10:00", tickets: 35, avgWait: 12 },
    { hour: "11:00", tickets: 42, avgWait: 15 },
    { hour: "12:00", tickets: 38, avgWait: 18 },
    { hour: "13:00", tickets: 28, avgWait: 14 },
    { hour: "14:00", tickets: 45, avgWait: 16 },
    { hour: "15:00", tickets: 52, avgWait: 20 },
    { hour: "16:00", tickets: 48, avgWait: 18 },
    { hour: "17:00", tickets: 35, avgWait: 12 },
  ]

  const serviceData = [
    { name: "Atención General", value: 45, color: "#3B82F6" },
    { name: "Caja", value: 25, color: "#10B981" },
    { name: "Consultas", value: 20, color: "#F59E0B" },
    { name: "Reclamos", value: 10, color: "#EF4444" },
  ]

  const weeklyData = [
    { day: "Lun", tickets: 187, satisfaction: 4.2 },
    { day: "Mar", tickets: 203, satisfaction: 4.1 },
    { day: "Mié", tickets: 195, satisfaction: 4.3 },
    { day: "Jue", tickets: 218, satisfaction: 4.0 },
    { day: "Vie", tickets: 234, satisfaction: 3.9 },
    { day: "Sáb", tickets: 156, satisfaction: 4.4 },
    { day: "Dom", tickets: 98, satisfaction: 4.5 },
  ]

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
            <Button>
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
              <div className="text-2xl font-bold">1,291</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                +12% vs semana anterior
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12.5 min</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingDown className="h-3 w-3 mr-1 text-green-500" />
                -8% vs semana anterior
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nivel de Servicio</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94.2%</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Badge variant="default" className="text-xs">
                  Meta: 90%
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Satisfacción</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.2/5</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                +0.3 vs semana anterior
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
                    <BarChart data={dailyData}>
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
                    <LineChart data={dailyData}>
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
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
                    {serviceData.map((service) => (
                      <div key={service.name} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: service.color }} />
                          <div>
                            <h3 className="font-medium">{service.name}</h3>
                            <p className="text-sm text-gray-600">{service.value}% del total</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{Math.floor(service.value * 12.91)} tickets</div>
                          <div className="text-sm text-gray-600">{Math.floor(Math.random() * 5) + 8} min promedio</div>
                        </div>
                      </div>
                    ))}
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
                  {[
                    { name: "Juan Pérez", position: "Puesto 1", tickets: 45, avgTime: "8.2 min", satisfaction: 4.3 },
                    { name: "María García", position: "Puesto 2", tickets: 52, avgTime: "7.1 min", satisfaction: 4.5 },
                    { name: "Carlos López", position: "Puesto 3", tickets: 38, avgTime: "9.8 min", satisfaction: 4.1 },
                    { name: "Ana Martín", position: "Puesto 4", tickets: 41, avgTime: "8.9 min", satisfaction: 4.2 },
                  ].map((operator) => (
                    <div key={operator.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{operator.name}</h3>
                        <p className="text-sm text-gray-600">{operator.position}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="font-bold">{operator.tickets}</div>
                          <div className="text-xs text-gray-600">Tickets</div>
                        </div>
                        <div>
                          <div className="font-bold">{operator.avgTime}</div>
                          <div className="text-xs text-gray-600">Tiempo Prom.</div>
                        </div>
                        <div>
                          <div className="font-bold">{operator.satisfaction}/5</div>
                          <div className="text-xs text-gray-600">Satisfacción</div>
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
