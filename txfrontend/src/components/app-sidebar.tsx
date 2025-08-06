"use client"

import type * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Logo } from "./logo"
import { Monitor, Smartphone, Tv, Settings, BarChart3, QrCode, Home, User, LogOut } from "lucide-react"

// Datos de navegación
const data = {
  navMain: [
    {
      title: "Principal",
      items: [
        {
          title: "Inicio",
          url: "/",
          icon: Home,
        },
        {
          title: "Dashboard Operativo",
          url: "/dashboard",
          icon: Monitor,
        },
      ],
    },
    {
      title: "Atención al Cliente",
      items: [
        {
          title: "Terminal Autoservicio",
          url: "/terminal",
          icon: QrCode,
        },
        {
          title: "Cartelería Digital",
          url: "/display",
          icon: Tv,
        },
        {
          title: "App Móvil",
          url: "/mobile",
          icon: Smartphone,
        },
      ],
    },
    {
      title: "Gestión",
      items: [
        {
          title: "Reportes y Analytics",
          url: "/reports",
          icon: BarChart3,
        },
        {
          title: "Administración",
          url: "/admin",
          icon: Settings,
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <Logo size="md" showText={true} />
        </div>
      </SidebarHeader>

      <SidebarContent>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const IconComponent = item.icon
                  const isActive = pathname === item.url

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={item.url}>
                          <IconComponent className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 px-2 py-2">
              <div className="flex items-center gap-2 flex-1">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Admin Usuario</p>
                  <p className="text-xs text-muted-foreground truncate">admin@drizatx.com</p>
                </div>
              </div>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <LogOut className="h-4 w-4" />
              <span>Cerrar Sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
