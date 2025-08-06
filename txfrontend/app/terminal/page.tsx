"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { QrCode, Printer, Users, Clock, ArrowRight, Smartphone, Ticket } from 'lucide-react'
import { useServices } from "@/hooks/use-services"
import { useTickets } from "@/hooks/use-tickets"
import { useQueueStatus } from "@/hooks/use-queue-status"

export default function TerminalPage() {
  const [selectedService, setSelectedService] = useState<number | null>(null)
  const [showTicket, setShowTicket] = useState(false)
  const [generatedTicket, setGeneratedTicket] = useState<any>(null)
  const [mobilePhone, setMobilePhone] = useState("")

  const { getActiveServices } = useServices()
  const { createTicket } = useTickets()
  const { getQueueStatus } = useQueueStatus()

  const services = getActiveServices()
  const queueStatus = getQueueStatus()

  const handleServiceSelect = (serviceId: number) => {
    setSelectedService(serviceId)
  }

  const handleGetTicket = () => {
    if (selectedService) {
      try {
        const newTicket = createTicket(selectedService, mobilePhone || undefined)
        setGeneratedTicket(newTicket)
        setShowTicket(true)
      } catch (error) {
        console.error('Error creating ticket:', error)
        alert('Error al generar el turno. Por favor intente nuevamente.')
      }
    }
  }

  const handleNewTicket = () => {
    setSelectedService(null)
    setShowTicket(false)
    setGeneratedTicket(null)
    setMobilePhone("")
  }

  const handlePrint = () => {
    // Simular impresión
    alert('Imprimiendo turno... (Funcionalidad simulada)')
  }

  // Obtener estadísticas del servicio seleccionado
  const selectedServiceStats = selectedService 
    ? queueStatus.queues.find(q => q.id === selectedService)
    : null

  return (
    <div className="flex-1 space-y-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Terminal de Autoservicio</h1>
        <p className="text-gray-600 text-lg">Seleccione el servicio que necesita</p>
      </div>

      {!selectedService ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => {
            const serviceStats = queueStatus.queues.find(q => q.id === service.id)
            return (
              <Card
                key={service.id}
                className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={() => handleServiceSelect(service.id)}
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Ticket className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{service.name}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>Tiempo estimado: {serviceStats?.averageTime || service.estimatedTime} min</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{serviceStats?.waitingCount || 0} personas en cola</span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      (serviceStats?.waitingCount || 0) > 15 
                        ? "destructive" 
                        : (serviceStats?.waitingCount || 0) > 10 
                          ? "secondary" 
                          : "default"
                    }
                    className="mt-4"
                  >
                    {(serviceStats?.waitingCount || 0) > 15 
                      ? "Cola Larga" 
                      : (serviceStats?.waitingCount || 0) > 10 
                        ? "Cola Media" 
                        : "Cola Corta"}
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
              <div className="text-6xl font-bold text-blue-600 mb-2">{generatedTicket?.number}</div>
              <p className="text-gray-600">Su número de turno</p>
            </div>

            <div className="space-y-2">
              <p className="font-medium">
                Servicio: {services.find((s) => s.id === selectedService)?.name}
              </p>
              <p className="text-sm text-gray-600">
                Tiempo estimado: {selectedServiceStats?.averageTime || generatedTicket?.estimatedWaitTime} min
              </p>
              <p className="text-sm text-gray-600">
                Personas adelante: {selectedServiceStats?.waitingCount || 0}
              </p>
              <p className="text-xs text-gray-500">
                Creado: {generatedTicket?.createdAt?.toLocaleTimeString()}
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
              <Button onClick={handlePrint} className="flex-1">
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
              <h3 className="text-xl font-bold mb-2">
                {services.find((s) => s.id === selectedService)?.name}
              </h3>
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center justify-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Tiempo estimado: {selectedServiceStats?.averageTime} min</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{selectedServiceStats?.waitingCount || 0} personas adelante</span>
                </div>
              </div>
            </div>

            {/* Campo opcional para teléfono móvil */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Smartphone className="h-5 w-5 text-blue-600" />
                <span className="font-medium">¿Quieres recibir notificaciones?</span>
              </div>
              <input
                type="tel"
                placeholder="Número de celular (opcional)"
                value={mobilePhone}
                onChange={(e) => setMobilePhone(e.target.value)}
                className="w-full p-2 border rounded-md text-center text-sm"
              />
              <p className="text-xs text-gray-600 mt-2">
                Te enviaremos un SMS cuando sea tu turno
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
