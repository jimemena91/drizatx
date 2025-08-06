"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Clock, AlertTriangle, CheckCircle, UserCheck, TrendingUp, Activity } from "lucide-react"

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString())

  // Simular actualización de tiempo
  setInterval(() => {
    setCurrentTime(new Date().toLocaleTimeString())
  }, 1000)

  const queues = [
    { id: 1, name: "Atención General", waiting: 12, avgTime: "8 min", status: "normal" },
    { id: 2, name: "Caja", waiting: 8, avgTime: "5 min", status: "normal" },
    { id: 3, name: "Consultas", waiting: 18, avgTime: "15 min", status: "warning" },
    { id: 4, name: "Reclamos", waiting: 3, avgTime: "12 min", status: "normal" },
  ]

  const operators = [
    { id: 1, name: "Juan Pérez", position: "Puesto 1", status: "busy", currentTicket: "A045" },
    { id: 2, name: "María García", position: "Puesto 2", status: "available", currentTicket: null },
    { id: 3, name: "Carlos López", position: "Puesto 3", status: "busy", currentTicket: "B023" },
    { id: 4, name: "Ana Martín", position: "Puesto 4", status: "break", currentTicket: null },
  ]

  return (
    <div className="flex-1 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Operativo</h1>
          <p className="text-gray-600">Monitoreo en tiempo real - {currentTime}</p>
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
            <div className="text-2xl font-bold">41</div>
            <p className="text-xs text-muted-foreground">+12% desde ayer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10 min</div>
            <p className="text-xs text-muted-foreground">-2 min desde ayer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atendidos Hoy</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">187</div>
            <p className="text-xs text-muted-foreground">+8% desde ayer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nivel de Servicio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
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
              {queues.map((queue) => (
                <div key={queue.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">{queue.name}</h3>
                      <Badge variant={queue.status === "warning" ? "destructive" : "secondary"}>
                        {queue.status === "warning" ? "Atención" : "Normal"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {queue.waiting} esperando
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {queue.avgTime} promedio
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{queue.waiting}</div>
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
              {operators.map((operator) => (
                <div key={operator.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        operator.status === "busy"
                          ? "bg-red-500"
                          : operator.status === "available"
                            ? "bg-green-500"
                            : "bg-yellow-500"
                      }`}
                    />
                    <div>
                      <h3 className="font-medium">{operator.name}</h3>
                      <p className="text-sm text-gray-600">{operator.position}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        operator.status === "busy"
                          ? "destructive"
                          : operator.status === "available"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {operator.status === "busy"
                        ? "Ocupado"
                        : operator.status === "available"
                          ? "Disponible"
                          : "Descanso"}
                    </Badge>
                    {operator.currentTicket && (
                      <p className="text-sm text-gray-600 mt-1">Turno: {operator.currentTicket}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas y Notificaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Alertas del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Cola de Consultas con tiempo de espera elevado</p>
                <p className="text-xs text-gray-600">15 minutos promedio - Meta: 10 minutos</p>
              </div>
              <Button size="sm" variant="outline">
                Revisar
              </Button>
            </div>

            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Nivel de servicio dentro de la meta</p>
                <p className="text-xs text-gray-600">94% - Meta: 90%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
