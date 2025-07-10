"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Calendar } from "lucide-react"
import { useFinanceStore } from "@/lib/finance-store"
import { formatCurrency } from "@/lib/utils"
import { YearlyTrendChart } from "@/components/charts/yearly-trend-chart"
import { CategoryPerformanceChart } from "@/components/charts/category-performance-chart"
import { SavingsRateChart } from "@/components/charts/savings-rate-chart"

export function ReportsAnalytics() {
  const { transactions, getMonthlyReport, getYearlyOverview, getTopExpenses, getSavingsRate } = useFinanceStore()

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const monthlyReport = getMonthlyReport(selectedMonth, selectedYear)
  const yearlyOverview = getYearlyOverview(selectedYear)
  const topExpenses = getTopExpenses(10)
  const savingsRate = getSavingsRate()

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const years = Array.from(new Set(transactions.map((t) => new Date(t.date).getFullYear()))).sort((a, b) => b - a)

  const exportReport = () => {
    // Simple CSV export functionality
    const csvData = transactions.map((t) => ({
      Date: t.date,
      Description: t.description,
      Category: t.category,
      Type: t.type,
      Amount: t.amount,
    }))

    const csvContent = [Object.keys(csvData[0]).join(","), ...csvData.map((row) => Object.values(row).join(","))].join(
      "\n",
    )

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `financial-report-${selectedYear}-${selectedMonth + 1}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-500">Detailed insights into your financial patterns</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(Number.parseInt(value))}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(Number.parseInt(value))}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={exportReport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Monthly Report */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Monthly Report - {months[selectedMonth]} {selectedYear}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{formatCurrency(monthlyReport.totalIncome)}</div>
              <div className="text-sm text-gray-500">Total Income</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(Math.abs(monthlyReport.totalExpenses))}
              </div>
              <div className="text-sm text-gray-500">Total Expenses</div>
            </div>
            <div className="text-center">
              <div
                className={`text-2xl font-bold ${monthlyReport.netSavings >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {formatCurrency(monthlyReport.netSavings)}
              </div>
              <div className="text-sm text-gray-500">Net Savings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{monthlyReport.transactionCount}</div>
              <div className="text-sm text-gray-500">Transactions</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>
            Category Breakdown - {months[selectedMonth]} {selectedYear}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyReport.categoryBreakdown.map((category, index) => (
              <div key={category.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{category.category}</div>
                    <div className="text-sm text-gray-500">{category.transactionCount} transactions</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-red-600">{formatCurrency(Math.abs(category.amount))}</div>
                  <div className="text-sm text-gray-500">{category.percentage.toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Yearly Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Yearly Overview - {selectedYear}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Income</span>
                <span className="font-semibold text-green-600">{formatCurrency(yearlyOverview.totalIncome)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Expenses</span>
                <span className="font-semibold text-red-600">
                  {formatCurrency(Math.abs(yearlyOverview.totalExpenses))}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Net Savings</span>
                <span className={`font-semibold ${yearlyOverview.netSavings >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatCurrency(yearlyOverview.netSavings)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Savings Rate</span>
                <span className="font-semibold text-blue-600">{savingsRate.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Monthly Spending</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(Math.abs(yearlyOverview.totalExpenses) / 12)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topExpenses.slice(0, 5).map((expense, index) => (
                <div key={expense.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-xs font-semibold text-red-600">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{expense.description}</div>
                      <div className="text-xs text-gray-500">{expense.category}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-red-600 text-sm">{formatCurrency(Math.abs(expense.amount))}</div>
                    <div className="text-xs text-gray-500">{new Date(expense.date).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Spending Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <YearlyTrendChart year={selectedYear} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryPerformanceChart />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Savings Rate Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <SavingsRateChart />
        </CardContent>
      </Card>
    </div>
  )
}
