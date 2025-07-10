"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Palette, Shield, User } from "lucide-react"
import { useFinanceStore } from "@/lib/finance-store"

export function Settings() {
  const { categories, addCategory, updateCategory, deleteCategory, settings, updateSettings } = useFinanceStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    type: "expense" as "income" | "expense",
    color: "#3B82F6",
    icon: "DollarSign",
  })

  const [settingsForm, setSettingsForm] = useState({
    userName: settings.userName || "",
    currency: settings.currency,
    monthlyBudgetLimit: settings.monthlyBudgetLimit.toString(),
    notifications: settings.notifications,
  })

  const resetCategoryForm = () => {
    setCategoryForm({
      name: "",
      type: "expense",
      color: "#3B82F6",
      icon: "DollarSign",
    })
    setEditingCategory(null)
  }

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingCategory) {
      updateCategory(editingCategory.name, categoryForm)
    } else {
      addCategory(categoryForm)
    }

    resetCategoryForm()
    setIsDialogOpen(false)
  }

  const handleEditCategory = (category: any) => {
    setEditingCategory(category)
    setCategoryForm({
      name: category.name,
      type: category.type,
      color: category.color,
      icon: category.icon,
    })
    setIsDialogOpen(true)
  }

  const handleDeleteCategory = (categoryName: string) => {
    if (confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      deleteCategory(categoryName)
    }
  }

  const handleSettingsUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    updateSettings({
      userName: settingsForm.userName,
      currency: settingsForm.currency,
      monthlyBudgetLimit: Number.parseFloat(settingsForm.monthlyBudgetLimit),
      notifications: settingsForm.notifications,
    })
    alert("Settings updated successfully!")
  }

  const colorOptions = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4", "#84CC16", "#F97316"]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your preferences and customize your financial tracking</p>
      </div>

      {/* Personal Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSettingsUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="userName">Your Name</Label>
                <Input
                  id="userName"
                  type="text"
                  placeholder="Enter your name"
                  value={settingsForm.userName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, userName: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={settingsForm.currency}
                  onValueChange={(value) => setSettingsForm({ ...settingsForm, currency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RWF">RWF (₣)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="JPY">JPY (¥)</SelectItem>
                    <SelectItem value="CAD">CAD (C$)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="monthlyBudgetLimit">Monthly Salary/Income</Label>
                <Input
                  id="monthlyBudgetLimit"
                  type="number"
                  step="50000"
                  min="100000"
                  placeholder="Your monthly income"
                  value={settingsForm.monthlyBudgetLimit}
                  onChange={(e) => setSettingsForm({ ...settingsForm, monthlyBudgetLimit: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notifications</Label>
                <p className="text-sm text-gray-500">Receive notifications for budget alerts and reminders</p>
              </div>
              <Switch
                checked={settingsForm.notifications}
                onCheckedChange={(checked) => setSettingsForm({ ...settingsForm, notifications: checked })}
              />
            </div>

            <Button type="submit">Update Settings</Button>
          </form>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900">Rwanda Financial Guidelines</h3>
              <p className="text-sm text-blue-700 mt-1">
                All expenses must be minimum 5,000 RWF to reflect realistic Rwanda spending patterns.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Categories Management
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetCategoryForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    placeholder="Enter category name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={categoryForm.type}
                    onValueChange={(value: "income" | "expense") => setCategoryForm({ ...categoryForm, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Color</Label>
                  <div className="flex gap-2 mt-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-8 h-8 rounded-full border-2 ${
                          categoryForm.color === color ? "border-gray-800" : "border-gray-300"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setCategoryForm({ ...categoryForm, color })}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingCategory ? "Update" : "Add"} Category
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((category) => (
              <div key={category.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
                  <div>
                    <div className="font-medium">{category.name}</div>
                    <Badge variant={category.type === "income" ? "default" : "secondary"}>{category.type}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEditCategory(category)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCategory(category.name)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium">Export Data</h3>
              <p className="text-sm text-gray-500">Download all your financial data as CSV</p>
            </div>
            <Button variant="outline">Export CSV</Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium">Clear All Data</h3>
              <p className="text-sm text-gray-500">Permanently delete all transactions and budgets</p>
            </div>
            <Button variant="destructive">Clear Data</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
