"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useFinanceStore } from "@/lib/finance-store"

export function SavingsRateChart() {
  const { transactions } = useFinanceStore()

  // Generate last 6 months savings rate data
  const months = []
  const currentDate = new Date()

  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
    const monthName = date.toLocaleDateString("en-US", { month: "short" })
    const year = date.getFullYear()
    const month = date.getMonth()

    const monthTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date)
      return transactionDate.getMonth() === month && transactionDate.getFullYear() === year
    })

    const income = monthTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

    const expenses = monthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0

    months.push({
      month: monthName,
      savingsRate: Math.max(0, savingsRate),
    })
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={months}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
        <Line type="monotone" dataKey="savingsRate" stroke="#10B981" strokeWidth={2} dot={{ fill: "#10B981" }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
