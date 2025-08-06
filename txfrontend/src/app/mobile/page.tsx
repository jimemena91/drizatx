"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { QrCode, Clock, Users, MapPin, Bell, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function MobilePage() {
  const [hasTicket, setHasTicket] = useState(false)
  const [ticketInfo, setTicketInfo] = useState({
    number: "A045",
    service: "Atención General",
    position: 3,
    estimatedTime: "8 min",
    currentTicket: "A042",
  })

  const services = [
    { id: "general", name: "Atención General", waitTime: "8 min", queue: 12 },
    { id: "caja", name: "Caja", waitTime: "5 min", queue: 8 },
    { id: "consultas", name: "Consultas", waitTime: "15 min", queue: 18 },
    { id: "reclamos", name: "Reclamos", waitTime: "12 min", queue: 3 },
  ]

  const handleGetTicket = (serviceId: string) => {
    const service = services.find((s) => s.id === serviceId)
    if (service) {
      setTicketInfo({
        number: `${serviceId.charAt(0).toUpperCase()}${Math.floor(Math.random() * 100) + 1}`.padEnd(4, "0"),
        service: service.name,
        position: service.queue + 1,
        estimatedTime: service.waitTime,
        currentTicket: `${serviceId.charAt(0).toUpperCase()}${Math.floor(Math.random() * 100) + 1}`.padEnd(4, "0"),
      })
      setHasTicket(true)
    }
  }

  if (hasTicket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">DT</span>
              </div>
              <span className="text-lg font-bold text-white">DrizaTx</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Mi Turno</h1>
            <p className="text-gray-600">Centro de Atención al Cliente</p>
          </div>

          {/* Turno actual */}
          <Card className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="p-6 text-center">
              <div className="text-5xl font-bold mb-2">{ticketInfo.number}</div>
              <p className="text-blue-100 mb-4">{ticketInfo.service}</p>
              <Badge className="bg-white/20 text-white">Tu turno</Badge>
            </CardContent>
          </Card>

          {/* Estado actual */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Estado Actual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Turno en atención:</span>
                  <span className="font-bold text-lg">{ticketInfo.currentTicket}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tu posición:</span>
                  <Badge variant="secondary">{ticketInfo.position} en cola</Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tiempo estimado:</span>
                  <span className="font-medium text-green-600">{ticketInfo.estimatedTime}</span>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progreso</span>
                    <span>{Math.max(0, 10 - ticketInfo.position)}/10</span>
                  </div>
                  <Progress value={Math.max(0, (10 - ticketInfo.position) * 10)} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notificaciones */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-600" />
                Notificaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Turno confirmado</p>
                    <p className="text-xs text-gray-600">Tu turno ha sido registrado exitosamente</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Mantente cerca</p>
                    <p className="text-xs text-gray-600">Te llamaremos en aproximadamente 8 minutos</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información adicional */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600" />
                Información del Local
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Dirección:</strong> Av. Corrientes 1234, CABA
                </p>
                <p>
                  <strong>Horario:</strong> Lunes a Viernes 8:00 - 18:00
                </p>
                <p>
                  <strong>Teléfono:</strong> (011) 4567-8900
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Acciones */}
          <div className="space-y-3">
            <Button className="w-full bg-transparent" variant="outline">
              <Bell className="h-4 w-4 mr-2" />
              Activar Notificaciones
            </Button>

            <Button className="w-full" variant="destructive" onClick={() => setHasTicket(false)}>
              Cancelar Turno
            </Button>
          </div>

          <div className="text-center mt-6 text-sm text-gray-500">
            <p>Mantén esta pantalla abierta para recibir actualizaciones</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 p-4 z-50 overflow-auto">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                ← Volver
              </Button>
            </Link>
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">DT</span>
            </div>
            <div></div>
          </div>
          <div className="mb-4">
            <span className="text-2xl font-bold text-gray-800">DrizaTx</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Turnos Móviles</h1>
          <p className="text-gray-600">Obtén tu turno sin hacer cola</p>
        </div>

        {/* QR Scanner alternativo */}
        <Card className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <CardContent className="p-6 text-center">
            <QrCode className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">¿Tienes un código QR?</h3>
            <p className="text-purple-100 text-sm mb-4">Escanea el código de tu ticket físico para seguir tu turno</p>
            <Button variant="secondary" className="w-full">
              Escanear Código QR
            </Button>
          </CardContent>
        </Card>

        {/* Servicios disponibles */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Selecciona un Servicio</h2>

          {services.map((service) => (
            <Card key={service.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-lg">{service.name}</h3>
                  <Badge variant={service.queue > 15 ? "destructive" : service.queue > 10 ? "secondary" : "default"}>
                    {service.queue > 15 ? "Cola Larga" : service.queue > 10 ? "Cola Media" : "Cola Corta"}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{service.waitTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{service.queue} en cola</span>
                  </div>
                </div>

                <Button className="w-full" onClick={() => handleGetTicket(service.id)} disabled={service.queue > 20}>
                  {service.queue > 20 ? "No Disponible" : "Obtener Turno"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Información adicional */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="font-bold text-blue-900 mb-2">¿Cómo funciona?</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Selecciona el servicio que necesitas</li>
              <li>• Recibe tu número de turno al instante</li>
              <li>• Sigue el progreso en tiempo real</li>
              <li>• Recibe notificaciones cuando sea tu turno</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
