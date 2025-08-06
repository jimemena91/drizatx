import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Monitor, Smartphone, Tv, Settings, BarChart3, Users, Clock, QrCode } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex-1 space-y-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Sistema Integral de Gestión de Colas</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Optimiza flujos de personas en entornos de atención masiva con tecnología DrizaTx
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-6 w-6 text-blue-600" />
              Dashboard Operativo
            </CardTitle>
            <CardDescription>Monitoreo en tiempo real de filas y atención</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard">
              <Button className="w-full">Acceder al Dashboard</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-6 w-6 text-green-600" />
              Terminal Autoservicio
            </CardTitle>
            <CardDescription>Emisión de turnos físicos y digitales</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/terminal">
              <Button className="w-full bg-transparent" variant="outline">
                Ver Terminal
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tv className="h-6 w-6 text-purple-600" />
              Cartelería Digital
            </CardTitle>
            <CardDescription>Pantallas dinámicas con información en tiempo real</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/display">
              <Button className="w-full bg-transparent" variant="outline">
                Ver Cartelería
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-6 w-6 text-orange-600" />
              App Móvil
            </CardTitle>
            <CardDescription>Turnos desde el celular sin instalación</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/mobile">
              <Button className="w-full bg-transparent" variant="outline">
                Ver App Móvil
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-red-600" />
              Reportes y Analytics
            </CardTitle>
            <CardDescription>Análisis históricos y toma de decisiones</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/reports">
              <Button className="w-full bg-transparent" variant="outline">
                Ver Reportes
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-6 w-6 text-gray-600" />
              Administración
            </CardTitle>
            <CardDescription>Configuración del sistema y usuarios</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin">
              <Button className="w-full bg-transparent" variant="outline">
                Panel Admin
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Clock className="h-5 w-5" />
              Tiempo de Espera
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">8 min</div>
            <p className="text-sm text-blue-600">Promedio actual</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Users className="h-5 w-5" />
              Personas en Cola
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">24</div>
            <p className="text-sm text-green-600">En todas las filas</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Monitor className="h-5 w-5" />
              Puestos Activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">6/8</div>
            <p className="text-sm text-purple-600">Operadores disponibles</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
