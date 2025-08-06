"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { QrCode, Printer, Users, Clock, ArrowRight, Smartphone, Ticket } from "lucide-react"

export default function TerminalPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [showTicket, setShowTicket] = useState(false)
  const [ticketNumber, setTicketNumber] = useState("")

  const services = [
    {
      id: "general",
      name: "Atención General",
      icon: Users,
      waitTime: "8 min",
      queue: 12,
      color: "bg-blue-500",
    },
    {
      id: "caja",
      name: "Caja",
      icon: Ticket,
      waitTime: "5 min",
      queue: 8,
      color: "bg-green-500",
    },
    {
      id: "consultas",
      name: "Consultas",
      icon: Users,
      waitTime: "15 min",
      queue: 18,
      color: "bg-orange-500",
    },
    {
      id: "reclamos",
      name: "Reclamos",
      icon: Users,
      waitTime: "12 min",
      queue: 3,
      color: "bg-red-500",
    },
  ]

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId)
  }

  const handleGetTicket = () => {
    const service = services.find((s) => s.id === selectedService)
    if (service) {
      const prefix = service.id.charAt(0).toUpperCase()
      const number = Math.floor(Math.random() * 100) + 1
      setTicketNumber(`${prefix}${number.toString().padStart(3, "0")}`)
      setShowTicket(true)
    }
  }

  const handleNewTicket = () => {
    setSelectedService(null)
    setShowTicket(false)
    setTicketNumber("")
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Terminal de Autoservicio</h1>
        <p className="text-gray-600 text-lg">Seleccione el servicio que necesita</p>
      </div>

      {!selectedService ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => {
            const IconComponent = service.icon
            return (
              <Card
                key={service.id}
                className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={() => handleServiceSelect(service.id)}
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`w-16 h-16 ${service.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{service.name}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>Tiempo estimado: {service.waitTime}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{service.queue} personas en cola</span>
                    </div>
                  </div>
                  <Badge
                    variant={service.queue > 15 ? "destructive" : service.queue > 10 ? "secondary" : "default"}
                    className="mt-4"
                  >
                    {service.queue > 15 ? "Cola Larga" : service.queue > 10 ? "Cola Media" : "Cola Corta"}
                  </Badge>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : showTicket ? (
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">¡Turno Generado!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="bg-gray-100 p-8 rounded-lg">
              <div className="text-6xl font-bold text-blue-600 mb-2">{ticketNumber}</div>
              <p className="text-gray-600">Su número de turno</p>
            </div>

            <div className="space-y-2">
              <p className="font-medium">Servicio: {services.find((s) => s.id === selectedService)?.name}</p>
              <p className="text-sm text-gray-600">
                Tiempo estimado: {services.find((s) => s.id === selectedService)?.waitTime}
              </p>
              <p className="text-sm text-gray-600">
                Personas adelante: {services.find((s) => s.id === selectedService)?.queue}
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <QrCode className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">Código QR</span>
              </div>
              <div className="w-32 h-32 bg-white border-2 border-blue-200 rounded-lg mx-auto flex items-center justify-center">
                <QrCode className="h-16 w-16 text-blue-600" />
              </div>
              <p className="text-xs text-gray-600 mt-2">Escanea para seguir tu turno desde el móvil</p>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleNewTicket} variant="outline" className="flex-1 bg-transparent">
                Nuevo Turno
              </Button>
              <Button className="flex-1">
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Confirmar Servicio</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-2">{services.find((s) => s.id === selectedService)?.name}</h3>
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center justify-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Tiempo estimado: {services.find((s) => s.id === selectedService)?.waitTime}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{services.find((s) => s.id === selectedService)?.queue} personas adelante</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Smartphone className="h-5 w-5 text-blue-600" />
                <span className="font-medium">¿Prefieres usar tu móvil?</span>
              </div>
              <p className="text-sm text-gray-600">
                Escanea el código QR que aparecerá en tu ticket para seguir tu turno desde el celular
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setSelectedService(null)} className="flex-1">
                Volver
              </Button>
              <Button onClick={handleGetTicket} className="flex-1">
                Obtener Turno
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="text-center">
        <p className="text-gray-500 text-sm">Para asistencia, presione el botón de ayuda o consulte con el personal</p>
      </div>
    </div>
  )
}
