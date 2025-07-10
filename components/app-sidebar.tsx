"use client"

import { BarChart3, CreditCard, Home, SettingsIcon, Target, Wallet } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    id: "dashboard",
  },
  {
    title: "Transactions",
    icon: CreditCard,
    id: "transactions",
  },
  {
    title: "Budget",
    icon: Target,
    id: "budget",
  },
  {
    title: "Reports",
    icon: BarChart3,
    id: "reports",
  },
  {
    title: "Settings",
    icon: SettingsIcon,
    id: "settings",
  },
]

interface AppSidebarProps {
  activeView: string
  setActiveView: (view: string) => void
}

export function AppSidebar({ activeView, setActiveView }: AppSidebarProps) {
  return (
    <Sidebar className="w-64 border-r bg-white">
      <SidebarHeader className="p-6 border-b">
        <div className="flex items-center gap-2">
          <Wallet className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">FinanceTracker</h1>
            <p className="text-sm text-gray-500">Personal Finance</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="mb-2">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveView(item.id)}
                    isActive={activeView === item.id}
                    className="w-full justify-start px-3 py-2 rounded-md hover:bg-gray-100 data-[active=true]:bg-blue-100 data-[active=true]:text-blue-700"
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
