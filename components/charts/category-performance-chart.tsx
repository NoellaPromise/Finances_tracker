"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useFinanceStore } from "@/lib/finance-store"
import { formatCurrency } from "@/lib/utils"

export function CategoryPerformanceChart() {
  const { transactions, categories } = useFinanceStore()

  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

  const getCategorySpending = (month: number, year: number) => {
    return transactions
      .filter((t) => {
        const transactionDate = new Date(t.date)
        return t.type === "expense" && transactionDate.getMonth() === month && transactionDate.getFullYear() === year
      })
      .reduce(
        (acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount)
          return acc
        },
        {} as Record<string, number>,
      )
  }

  const currentMonthSpending = getCategorySpending(currentMonth, currentYear)
  const lastMonthSpending = getCategorySpending(lastMonth, lastMonthYear)

  const data = categories
    .filter((c) => c.type === "expense")
    .map((category) => ({
      category: category.name,
      thisMonth: currentMonthSpending[category.name] || 0,
      lastMonth: lastMonthSpending[category.name] || 0,
    }))
    .filter((item) => item.thisMonth > 0 || item.lastMonth > 0)

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
        <Bar dataKey="lastMonth" fill="#94A3B8" name="Last Month" />
        <Bar dataKey="thisMonth" fill="#3B82F6" name="This Month" />
      </BarChart>
    </ResponsiveContainer>
  )
}
