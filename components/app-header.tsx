"use client"

import { useState } from "react"
import { BarChart3, CreditCard, Home, SettingsIcon, Target, Wallet, Menu, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useFinanceStore } from "@/lib/finance-store"

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

interface AppHeaderProps {
  activeView: string
  setActiveView: (view: string) => void
}

export function AppHeader({ activeView, setActiveView }: AppHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { settings } = useFinanceStore()

  const activeMenuItem = menuItems.find((item) => item.id === activeView)

  const handleMenuItemClick = (viewId: string) => {
    setActiveView(viewId)
    setIsOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo and App Branding - Always Visible */}
        <div className="flex items-center gap-3">
          <Wallet className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">Finance Tracker</h1>
            <p className="text-sm text-gray-500">Personal Finance</p>
          </div>
        </div>

        {/* Navigation Dropdown */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 text-sm text-gray-600">
            <span>Welcome back, {settings.userName || "User"}!</span>
          </div>
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                {activeMenuItem && <activeMenuItem.icon className="h-4 w-4" />}
                <span className="hidden sm:inline">{activeMenuItem?.title || "Navigation"}</span>
                <Menu className="h-4 w-4 sm:hidden" />
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {menuItems.map((item) => (
                <DropdownMenuItem
                  key={item.id}
                  onClick={() => handleMenuItemClick(item.id)}
                  className={`flex items-center gap-3 cursor-pointer ${
                    activeView === item.id ? "bg-blue-50 text-blue-700" : ""
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                  {activeView === item.id && <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Currency Display */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-md">
            <span className="text-sm font-medium text-gray-600">RWF</span>
          </div>
        </div>
      </div>
    </header>
  )
}
