"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Monitor, Bell, Shield, Plus, Edit, Trash2, Save, AlertTriangle } from "lucide-react"

export default function AdminPage() {
  const [services, setServices] = useState([
    { id: 1, name: "Atención General", prefix: "A", active: true, priority: 1 },
    { id: 2, name: "Caja", prefix: "B", active: true, priority: 2 },
    { id: 3, name: "Consultas", prefix: "C", active: true, priority: 3 },
    { id: 4, name: "Reclamos", prefix: "R", active: false, priority: 4 },
  ])

  const [operators, setOperators] = useState([
    { id: 1, name: "Juan Pérez", email: "juan@empresa.com", position: "Puesto 1", active: true, role: "operator" },
    { id: 2, name: "María García", email: "maria@empresa.com", position: "Puesto 2", active: true, role: "operator" },
    {
      id: 3,
      name: "Carlos López",
      email: "carlos@empresa.com",
      position: "Puesto 3",
      active: true,
      role: "supervisor",
    },
    { id: 4, name: "Ana Martín", email: "ana@empresa.com", position: "Puesto 4", active: false, role: "operator" },
  ])

  const [systemSettings, setSystemSettings] = useState({
    maxWaitTime: 15,
    autoCallNext: true,
    soundEnabled: true,
    displayTimeout: 30,
    mobileEnabled: true,
    qrEnabled: true,
    notificationsEnabled: true,
  })

  return (
    <div className="flex-1 space-y-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
            <p className="text-gray-600">Configuración del sistema y gestión de usuarios</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Logs del Sistema
            </Button>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Guardar Cambios
            </Button>
          </div>
        </div>

        <Tabs defaultValue="services" className="space-y-6">
          <TabsList>
            <TabsTrigger value="services">Servicios</TabsTrigger>
            <TabsTrigger value="operators">Operadores</TabsTrigger>
            <TabsTrigger value="displays">Pantallas</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Gestión de Servicios</CardTitle>
                    <CardDescription>Configura los tipos de atención disponibles</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Servicio
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Switch checked={service.active} />
                        <div>
                          <h3 className="font-medium">{service.name}</h3>
                          <p className="text-sm text-gray-600">
                            Prefijo: {service.prefix} | Prioridad: {service.priority}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={service.active ? "default" : "secondary"}>
                          {service.active ? "Activo" : "Inactivo"}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="operators" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Gestión de Operadores</CardTitle>
                    <CardDescription>Administra usuarios y permisos del sistema</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Operador
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {operators.map((operator) => (
                    <div key={operator.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Switch checked={operator.active} />
                        <div>
                          <h3 className="font-medium">{operator.name}</h3>
                          <p className="text-sm text-gray-600">
                            {operator.email} | {operator.position}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={operator.role === "supervisor" ? "default" : "secondary"}>
                          {operator.role === "supervisor" ? "Supervisor" : "Operador"}
                        </Badge>
                        <Badge variant={operator.active ? "default" : "secondary"}>
                          {operator.active ? "Activo" : "Inactivo"}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="displays" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Configuración de Pantallas
                </CardTitle>
                <CardDescription>Gestiona la cartelería digital y displays</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="display-timeout">Tiempo de rotación (segundos)</Label>
                      <Input
                        id="display-timeout"
                        type="number"
                        value={systemSettings.displayTimeout}
                        onChange={(e) =>
                          setSystemSettings({ ...systemSettings, displayTimeout: Number.parseInt(e.target.value) })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-weather">Mostrar clima</Label>
                      <Switch id="show-weather" />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-currency">Mostrar cotizaciones</Label>
                      <Switch id="show-currency" />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-news">Mostrar noticias</Label>
                      <Switch id="show-news" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Pantallas conectadas</Label>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded">
                          <span className="text-sm">Pantalla Principal</span>
                          <Badge className="bg-green-600">Conectada</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded">
                          <span className="text-sm">Pantalla Secundaria</span>
                          <Badge className="bg-green-600">Conectada</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-red-50 border border-red-200 rounded">
                          <span className="text-sm">Pantalla Entrada</span>
                          <Badge variant="destructive">Desconectada</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Configuración General
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="max-wait">Tiempo máximo de espera (minutos)</Label>
                    <Input
                      id="max-wait"
                      type="number"
                      value={systemSettings.maxWaitTime}
                      onChange={(e) =>
                        setSystemSettings({ ...systemSettings, maxWaitTime: Number.parseInt(e.target.value) })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-call">Llamado automático</Label>
                    <Switch
                      id="auto-call"
                      checked={systemSettings.autoCallNext}
                      onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, autoCallNext: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="sound">Sonido habilitado</Label>
                    <Switch
                      id="sound"
                      checked={systemSettings.soundEnabled}
                      onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, soundEnabled: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notificaciones
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications">Notificaciones habilitadas</Label>
                    <Switch
                      id="notifications"
                      checked={systemSettings.notificationsEnabled}
                      onCheckedChange={(checked) =>
                        setSystemSettings({ ...systemSettings, notificationsEnabled: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="mobile-app">App móvil habilitada</Label>
                    <Switch
                      id="mobile-app"
                      checked={systemSettings.mobileEnabled}
                      onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, mobileEnabled: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="qr-codes">Códigos QR habilitados</Label>
                    <Switch
                      id="qr-codes"
                      checked={systemSettings.qrEnabled}
                      onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, qrEnabled: checked })}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Seguridad y Respaldos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex-col bg-transparent">
                    <Shield className="h-6 w-6 mb-2" />
                    Cambiar Contraseña
                  </Button>

                  <Button variant="outline" className="h-20 flex-col bg-transparent">
                    <Save className="h-6 w-6 mb-2" />
                    Crear Respaldo
                  </Button>

                  <Button variant="outline" className="h-20 flex-col bg-transparent">
                    <AlertTriangle className="h-6 w-6 mb-2" />
                    Ver Logs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
