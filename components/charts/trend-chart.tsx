"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useFinanceStore } from "@/lib/finance-store"
import { formatCurrency } from "@/lib/utils"

export function TrendChart() {
  const { transactions } = useFinanceStore()

  // Generate last 6 months data
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

    const expenses = monthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    months.push({
      month: monthName,
      expenses,
    })
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={months}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
        <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} dot={{ fill: "#EF4444" }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
