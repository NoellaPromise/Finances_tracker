"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useFinanceStore } from "@/lib/finance-store"
import { formatCurrency } from "@/lib/utils"

interface YearlyTrendChartProps {
  year: number
}

export function YearlyTrendChart({ year }: YearlyTrendChartProps) {
  const { transactions } = useFinanceStore()

  const monthlyData = []
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  for (let month = 0; month < 12; month++) {
    const monthTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date)
      return transactionDate.getMonth() === month && transactionDate.getFullYear() === year
    })

    const income = monthTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

    const expenses = monthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    monthlyData.push({
      month: months[month],
      income,
      expenses,
    })
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={monthlyData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
        <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} />
        <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}
