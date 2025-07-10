"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Target, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { useFinanceStore } from "@/lib/finance-store"
import { formatCurrency } from "@/lib/utils"

export function BudgetManager() {
  const { budgets, categories, addBudget, updateBudget, getBudgetStatus } = useFinanceStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState<any>(null)

  const [formData, setFormData] = useState({
    category: "",
    monthlyLimit: "",
    color: "#3B82F6",
  })

  const resetForm = () => {
    setFormData({
      category: "",
      monthlyLimit: "",
      color: "#3B82F6",
    })
    setEditingBudget(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const monthlyLimit = Number.parseFloat(formData.monthlyLimit)

    if (monthlyLimit < 5000) {
      alert("Minimum budget amount should be 5,000 RWF")
      return
    }

    const budgetData = {
      category: formData.category,
      monthlyLimit: monthlyLimit,
      color: formData.color,
    }

    if (editingBudget) {
      updateBudget(editingBudget.category, budgetData)
    } else {
      addBudget(budgetData)
    }

    resetForm()
    setIsDialogOpen(false)
  }

  const handleEdit = (budget: any) => {
    setEditingBudget(budget)
    setFormData({
      category: budget.category,
      monthlyLimit: budget.monthlyLimit.toString(),
      color: budget.color,
    })
    setIsDialogOpen(true)
  }

  const getBudgetStatusIcon = (status: string) => {
    switch (status) {
      case "under":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "near":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case "over":
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getBudgetStatusColor = (status: string) => {
    switch (status) {
      case "under":
        return "text-green-600"
      case "near":
        return "text-yellow-600"
      case "over":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.monthlyLimit, 0)
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0)
  const remainingBudget = totalBudget - totalSpent

  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
  const currentDay = new Date().getDate()
  const remainingDays = daysInMonth - currentDay

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Budget Management</h1>
          <p className="text-gray-500">Track your spending against your budget goals</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Budget
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingBudget ? "Edit Budget" : "Add New Budget"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  disabled={!!editingBudget}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .filter((cat) => cat.type === "expense")
                      .filter(
                        (cat) => !budgets.find((b) => b.category === cat.name) || editingBudget?.category === cat.name,
                      )
                      .map((category) => (
                        <SelectItem key={category.name} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="monthlyLimit">Monthly Budget Limit</Label>
                <Input
                  id="monthlyLimit"
                  type="number"
                  step="5000"
                  min="5000"
                  placeholder="Min: 5,000 RWF"
                  value={formData.monthlyLimit}
                  onChange={(e) => setFormData({ ...formData, monthlyLimit: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="color">Color</Label>
                <div className="flex gap-2 mt-2">
                  {["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"].map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${
                        formData.color === color ? "border-gray-800" : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData({ ...formData, color })}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingBudget ? "Update" : "Add"} Budget
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Budget</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalBudget)}</div>
            <p className="text-xs text-gray-500 mt-1">Monthly allocation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Spent</CardTitle>
            <Target className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalSpent)}</div>
            <p className="text-xs text-gray-500 mt-1">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Remaining</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${remainingBudget >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(remainingBudget)}
            </div>
            <p className="text-xs text-gray-500 mt-1">{remainingDays} days left</p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgets.map((budget) => {
          const status = getBudgetStatus(budget.category)
          const percentage = budget.monthlyLimit > 0 ? (budget.spent / budget.monthlyLimit) * 100 : 0
          const remaining = budget.monthlyLimit - budget.spent

          return (
            <Card key={budget.category} className="relative">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: budget.color }} />
                  <CardTitle className="text-lg">{budget.category}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  {getBudgetStatusIcon(status)}
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(budget)}>
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Spent: {formatCurrency(budget.spent)}</span>
                    <span>Budget: {formatCurrency(budget.monthlyLimit)}</span>
                  </div>
                  <Progress
                    value={Math.min(percentage, 100)}
                    className="h-2"
                    style={
                      {
                        "--progress-background": budget.color,
                      } as React.CSSProperties
                    }
                  />
                  <div className="flex justify-between items-center">
                    <span className={`text-sm font-medium ${getBudgetStatusColor(status)}`}>
                      {percentage.toFixed(1)}% used
                    </span>
                    <Badge variant={status === "over" ? "destructive" : status === "near" ? "secondary" : "default"}>
                      {status === "over" ? "Over Budget" : status === "near" ? "Near Limit" : "On Track"}
                    </Badge>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Remaining:</span>
                    <span className={remaining >= 0 ? "text-green-600" : "text-red-600"}>
                      {formatCurrency(remaining)}
                    </span>
                  </div>
                  {remaining > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      ~{formatCurrency(remaining / remainingDays)} per day
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {budgets.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No budgets set up yet</h3>
            <p className="text-gray-500 mb-4">Create your first budget to start tracking your spending goals.</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Budget
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
