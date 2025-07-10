"use client"

import { useState, useEffect } from "react"
import { AppHeader } from "@/components/app-header"
import { MainDashboard } from "@/components/main-dashboard"
import { TransactionManager } from "@/components/transaction-manager"
import { BudgetManager } from "@/components/budget-manager"
import { ReportsAnalytics } from "@/components/reports-analytics"
import { Settings } from "@/components/settings"
import { useFinanceStore } from "@/lib/finance-store"

export default function HomePage() {
  const [activeView, setActiveView] = useState("dashboard")
  const { initializeData } = useFinanceStore()

  useEffect(() => {
    initializeData()
  }, [initializeData])

  const renderActiveView = () => {
    switch (activeView) {
      case "dashboard":
        return <MainDashboard />
      case "transactions":
        return <TransactionManager />
      case "budget":
        return <BudgetManager />
      case "reports":
        return <ReportsAnalytics />
      case "settings":
        return <Settings />
      default:
        return <MainDashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader activeView={activeView} setActiveView={setActiveView} />
      <main className="pt-20 px-6 pb-6">{renderActiveView()}</main>
    </div>
  )
}
