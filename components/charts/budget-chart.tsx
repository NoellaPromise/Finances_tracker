"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useFinanceStore } from "@/lib/finance-store"
import { formatCurrency } from "@/lib/utils"

export function BudgetChart() {
  const { budgets } = useFinanceStore()

  const data = budgets.map((budget) => ({
    category: budget.category,
    budget: budget.monthlyLimit,
    spent: budget.spent,
    remaining: Math.max(0, budget.monthlyLimit - budget.spent),
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
        <Legend />
        <Bar dataKey="budget" fill="#3B82F6" name="Budget" />
        <Bar dataKey="spent" fill="#EF4444" name="Spent" />
      </BarChart>
    </ResponsiveContainer>
  )
}
