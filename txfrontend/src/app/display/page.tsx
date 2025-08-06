"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Thermometer, DollarSign, Wifi, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DisplayPage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [currentTicket, setCurrentTicket] = useState("A045")
  const [nextTickets, setNextTickets] = useState(["A046", "B023", "A047"])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Simular cambio de turnos
    const ticketTimer = setInterval(() => {
      const prefixes = ["A", "B", "C"]
      const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)]
      const randomNumber = Math.floor(Math.random() * 100) + 1
      setCurrentTicket(`${randomPrefix}${randomNumber.toString().padStart(3, "0")}`)
    }, 8000)

    return () => {
      clearInterval(timer)
      clearInterval(ticketTimer)
    }
  }, [])

  const announcements = [
    "Recuerde mantener su distancia de seguridad",
    "Puede seguir su turno desde su móvil escaneando el código QR",
    "Horario de atención: Lunes a Viernes 8:00 - 18:00",
    "Para consultas urgentes, diríjase al mostrador de información",
  ]

  const [currentAnnouncement, setCurrentAnnouncement] = useState(0)

  useEffect(() => {
    const announcementTimer = setInterval(() => {
      setCurrentAnnouncement((prev) => (prev + 1) % announcements.length)
    }, 5000)

    return () => clearInterval(announcementTimer)
  }, [announcements.length])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white p-4 md:p-8 overflow-auto">
      <div className="max-w-7xl mx-auto flex flex-col min-h-screen">
        {/* Header con información general */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">DT</span>
              </div>
              <span className="text-2xl font-bold text-white">DrizaTx</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">Centro de Atención al Cliente</h1>
            <p className="text-blue-200">Sistema de Gestión de Colas DrizaTx</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{currentTime.toLocaleTimeString()}</div>
            <div className="text-blue-200">
              {currentTime.toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>

        {/* Turno actual destacado */}
        <Card className="mb-8 bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Volume2 className="h-8 w-8 text-yellow-400 animate-pulse" />
              <h2 className="text-2xl font-bold">TURNO ACTUAL</h2>
            </div>
            <div className="text-8xl font-bold text-yellow-400 mb-4 animate-pulse">{currentTicket}</div>
            <p className="text-xl text-blue-200">Diríjase al Puesto 1</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 flex-1">
          {/* Próximos turnos */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Próximos Turnos
              </h3>
              <div className="space-y-3">
                {nextTickets.map((ticket, index) => (
                  <div key={ticket} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-2xl font-bold">{ticket}</span>
                    <Badge variant="secondary">{index === 0 ? "Siguiente" : `+${index + 1}`}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Estado de las colas */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Tiempos de Espera
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Atención General</span>
                  <Badge className="bg-green-600">8 min</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Caja</span>
                  <Badge className="bg-green-600">5 min</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Consultas</span>
                  <Badge className="bg-yellow-600">15 min</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Reclamos</span>
                  <Badge className="bg-green-600">12 min</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información adicional */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Información</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Thermometer className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="font-medium">Temperatura</p>
                    <p className="text-blue-200">22°C - Parcialmente nublado</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="font-medium">Dólar Oficial</p>
                    <p className="text-blue-200">$1.250,00</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Wifi className="h-5 w-5 text-purple-400" />
                  <div>
                    <p className="font-medium">WiFi Gratuito</p>
                    <p className="text-blue-200">Red: "Cliente_WiFi"</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Banner de anuncios */}
        <Card className="mt-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-bold mb-2">Información Importante</h3>
              <p className="text-blue-200 text-lg">{announcements[currentAnnouncement]}</p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-blue-200">
          <p>Para obtener un turno, utilice los terminales de autoservicio o escanee el código QR con su móvil</p>
        </div>
      </div>
      <div className="fixed top-4 right-4 z-10">
        <Link href="/">
          <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
            Volver al Sistema
          </Button>
        </Link>
      </div>
    </div>
  )
}
