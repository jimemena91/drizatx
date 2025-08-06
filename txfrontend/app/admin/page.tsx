"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Monitor, Bell, Shield, Plus, Edit, Trash2, Save, AlertTriangle, X } from 'lucide-react'
import { useServices } from "@/hooks/use-services"
import { useOperators } from "@/hooks/use-operators"
import { useQueue } from "@/contexts/queue-context"
import { Role } from "@/lib/types"

export default function AdminPage() {
  const { services, createService, updateService, deleteService } = useServices()
  const { operators, createOperator, updateOperator } = useOperators()
  const { state, dispatch } = useQueue()

  // Estados para modales
  const [serviceModalOpen, setServiceModalOpen] = useState(false)
  const [operatorModalOpen, setOperatorModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<any>(null)
  const [editingOperator, setEditingOperator] = useState<any>(null)

  // Estados para formularios
  const [serviceForm, setServiceForm] = useState({
    name: '',
    prefix: '',
    priority: 1,
    estimatedTime: 10,
    active: true
  })

  const [operatorForm, setOperatorForm] = useState({
    name: '',
    email: '',
    position: '',
    role: Role.OPERATOR,
    active: true
  })

  // Configuraciones del sistema
  const [systemSettings, setSystemSettings] = useState({
    maxWaitTime: 15,
    autoCallNext: true,
    soundEnabled: true,
    displayTimeout: 30,
    mobileEnabled: true,
    qrEnabled: true,
    notificationsEnabled: true,
  })

  // Funciones para servicios
  const handleCreateService = () => {
    if (serviceForm.name && serviceForm.prefix) {
      createService(serviceForm)
      setServiceForm({ name: '', prefix: '', priority: 1, estimatedTime: 10, active: true })
      setServiceModalOpen(false)
    }
  }

  const handleEditService = (service: any) => {
    setEditingService(service)
    setServiceForm({
      name: service.name,
      prefix: service.prefix,
      priority: service.priority,
      estimatedTime: service.estimatedTime,
      active: service.active
    })
    setServiceModalOpen(true)
  }

  const handleUpdateService = () => {
    if (editingService && serviceForm.name && serviceForm.prefix) {
      updateService(editingService.id, serviceForm)
      setEditingService(null)
      setServiceForm({ name: '', prefix: '', priority: 1, estimatedTime: 10, active: true })
      setServiceModalOpen(false)
    }
  }

  const handleDeleteService = (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
      deleteService(id)
    }
  }

  // Funciones para operadores
  const handleCreateOperator = () => {
    if (operatorForm.name && operatorForm.email) {
      createOperator(operatorForm)
      setOperatorForm({ name: '', email: '', position: '', role: Role.OPERATOR, active: true })
      setOperatorModalOpen(false)
    }
  }

  const handleEditOperator = (operator: any) => {
    setEditingOperator(operator)
    setOperatorForm({
      name: operator.name,
      email: operator.email,
      position: operator.position || '',
      role: operator.role,
      active: operator.active
    })
    setOperatorModalOpen(true)
  }

  const handleUpdateOperator = () => {
    if (editingOperator && operatorForm.name && operatorForm.email) {
      updateOperator(editingOperator.id, operatorForm)
      setEditingOperator(null)
      setOperatorForm({ name: '', email: '', position: '', role: Role.OPERATOR, active: true })
      setOperatorModalOpen(false)
    }
  }

  const handleUpdateSetting = (key: string, value: string) => {
    dispatch({ type: 'UPDATE_SETTING', payload: { key, value } })
    setSystemSettings(prev => ({ ...prev, [key]: value === 'true' ? true : value === 'false' ? false : value }))
  }

  const resetServiceForm = () => {
    setServiceForm({ name: '', prefix: '', priority: 1, estimatedTime: 10, active: true })
    setEditingService(null)
  }

  const resetOperatorForm = () => {
    setOperatorForm({ name: '', email: '', position: '', role: Role.OPERATOR, active: true })
    setEditingOperator(null)
  }

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
                  <Dialog open={serviceModalOpen} onOpenChange={setServiceModalOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={resetServiceForm}>
                        <Plus className="h-4 w-4 mr-2" />
                        Nuevo Servicio
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {editingService ? 'Editar Servicio' : 'Nuevo Servicio'}
                        </DialogTitle>
                        <DialogDescription>
                          {editingService ? 'Modifica los datos del servicio' : 'Completa los datos del nuevo servicio'}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">Nombre</Label>
                          <Input
                            id="name"
                            value={serviceForm.name}
                            onChange={(e) => setServiceForm(prev => ({ ...prev, name: e.target.value }))}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="prefix" className="text-right">Prefijo</Label>
                          <Input
                            id="prefix"
                            value={serviceForm.prefix}
                            onChange={(e) => setServiceForm(prev => ({ ...prev, prefix: e.target.value.toUpperCase() }))}
                            className="col-span-3"
                            maxLength={3}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="priority" className="text-right">Prioridad</Label>
                          <Input
                            id="priority"
                            type="number"
                            value={serviceForm.priority}
                            onChange={(e) => setServiceForm(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="estimatedTime" className="text-right">Tiempo Est. (min)</Label>
                          <Input
                            id="estimatedTime"
                            type="number"
                            value={serviceForm.estimatedTime}
                            onChange={(e) => setServiceForm(prev => ({ ...prev, estimatedTime: parseInt(e.target.value) }))}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="active" className="text-right">Activo</Label>
                          <Switch
                            id="active"
                            checked={serviceForm.active}
                            onCheckedChange={(checked) => setServiceForm(prev => ({ ...prev, active: checked }))}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setServiceModalOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={editingService ? handleUpdateService : handleCreateService}>
                          {editingService ? 'Actualizar' : 'Crear'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Switch 
                          checked={service.active} 
                          onCheckedChange={(checked) => updateService(service.id, { active: checked })}
                        />
                        <div>
                          <h3 className="font-medium">{service.name}</h3>
                          <p className="text-sm text-gray-600">
                            Prefijo: {service.prefix} | Prioridad: {service.priority} | Tiempo: {service.estimatedTime} min
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={service.active ? "default" : "secondary"}>
                          {service.active ? "Activo" : "Inactivo"}
                        </Badge>
                        <Button size="sm" variant="outline" onClick={() => handleEditService(service)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteService(service.id)}>
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
                  <Dialog open={operatorModalOpen} onOpenChange={setOperatorModalOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={resetOperatorForm}>
                        <Plus className="h-4 w-4 mr-2" />
                        Nuevo Operador
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {editingOperator ? 'Editar Operador' : 'Nuevo Operador'}
                        </DialogTitle>
                        <DialogDescription>
                          {editingOperator ? 'Modifica los datos del operador' : 'Completa los datos del nuevo operador'}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="operatorName" className="text-right">Nombre</Label>
                          <Input
                            id="operatorName"
                            value={operatorForm.name}
                            onChange={(e) => setOperatorForm(prev => ({ ...prev, name: e.target.value }))}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="email" className="text-right">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={operatorForm.email}
                            onChange={(e) => setOperatorForm(prev => ({ ...prev, email: e.target.value }))}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="position" className="text-right">Posición</Label>
                          <Input
                            id="position"
                            value={operatorForm.position}
                            onChange={(e) => setOperatorForm(prev => ({ ...prev, position: e.target.value }))}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="role" className="text-right">Rol</Label>
                          <Select 
                            value={operatorForm.role} 
                            onValueChange={(value) => setOperatorForm(prev => ({ ...prev, role: value as Role }))}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={Role.OPERATOR}>Operador</SelectItem>
                              <SelectItem value={Role.SUPERVISOR}>Supervisor</SelectItem>
                              <SelectItem value={Role.ADMIN}>Administrador</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="operatorActive" className="text-right">Activo</Label>
                          <Switch
                            id="operatorActive"
                            checked={operatorForm.active}
                            onCheckedChange={(checked) => setOperatorForm(prev => ({ ...prev, active: checked }))}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setOperatorModalOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={editingOperator ? handleUpdateOperator : handleCreateOperator}>
                          {editingOperator ? 'Actualizar' : 'Crear'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {operators.map((operator) => (
                    <div key={operator.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Switch 
                          checked={operator.active} 
                          onCheckedChange={(checked) => updateOperator(operator.id, { active: checked })}
                        />
                        <div>
                          <h3 className="font-medium">{operator.name}</h3>
                          <p className="text-sm text-gray-600">
                            {operator.email} | {operator.position}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={operator.role === Role.SUPERVISOR || operator.role === Role.ADMIN ? "default" : "secondary"}>
                          {operator.role === Role.ADMIN ? "Admin" : operator.role === Role.SUPERVISOR ? "Supervisor" : "Operador"}
                        </Badge>
                        <Badge variant={operator.active ? "default" : "secondary"}>
                          {operator.active ? "Activo" : "Inactivo"}
                        </Badge>
                        <Button size="sm" variant="outline" onClick={() => handleEditOperator(operator)}>
                          <Edit className="h-4 w-4" />
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
                        onChange={(e) => {
                          const value = parseInt(e.target.value)
                          setSystemSettings(prev => ({ ...prev, displayTimeout: value }))
                          handleUpdateSetting('displayTimeout', value.toString())
                        }}
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
                      onChange={(e) => {
                        const value = parseInt(e.target.value)
                        setSystemSettings(prev => ({ ...prev, maxWaitTime: value }))
                        handleUpdateSetting('maxWaitTime', value.toString())
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-call">Llamado automático</Label>
                    <Switch
                      id="auto-call"
                      checked={systemSettings.autoCallNext}
                      onCheckedChange={(checked) => {
                        setSystemSettings(prev => ({ ...prev, autoCallNext: checked }))
                        handleUpdateSetting('autoCallNext', checked.toString())
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="sound">Sonido habilitado</Label>
                    <Switch
                      id="sound"
                      checked={systemSettings.soundEnabled}
                      onCheckedChange={(checked) => {
                        setSystemSettings(prev => ({ ...prev, soundEnabled: checked }))
                        handleUpdateSetting('soundEnabled', checked.toString())
                      }}
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
                      onCheckedChange={(checked) => {
                        setSystemSettings(prev => ({ ...prev, notificationsEnabled: checked }))
                        handleUpdateSetting('notificationsEnabled', checked.toString())
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="mobile-app">App móvil habilitada</Label>
                    <Switch
                      id="mobile-app"
                      checked={systemSettings.mobileEnabled}
                      onCheckedChange={(checked) => {
                        setSystemSettings(prev => ({ ...prev, mobileEnabled: checked }))
                        handleUpdateSetting('mobileEnabled', checked.toString())
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="qr-codes">Códigos QR habilitados</Label>
                    <Switch
                      id="qr-codes"
                      checked={systemSettings.qrEnabled}
                      onCheckedChange={(checked) => {
                        setSystemSettings(prev => ({ ...prev, qrEnabled: checked }))
                        handleUpdateSetting('qrEnabled', checked.toString())
                      }}
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

                  <Button 
                    variant="outline" 
                    className="h-20 flex-col bg-transparent"
                    onClick={() => {
                      const data = JSON.stringify(state, null, 2)
                      const blob = new Blob([data], { type: 'application/json' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = `backup-drizatx-${new Date().toISOString().split('T')[0]}.json`
                      a.click()
                      URL.revokeObjectURL(url)
                    }}
                  >
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
