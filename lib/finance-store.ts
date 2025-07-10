"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Transaction {
  id: number
  amount: number
  category: string
  date: string
  description: string
  type: "income" | "expense"
}

export interface Budget {
  category: string
  monthlyLimit: number
  spent: number
  color: string
}

export interface Category {
  name: string
  type: "income" | "expense"
  color: string
  icon: string
}

export interface Settings {
  userName: string
  currency: string
  monthlyBudgetLimit: number
  notifications: boolean
}

interface FinanceStore {
  transactions: Transaction[]
  budgets: Budget[]
  categories: Category[]
  settings: Settings

  // Actions
  addTransaction: (transaction: Omit<Transaction, "id">) => void
  updateTransaction: (id: number, transaction: Partial<Transaction>) => void
  deleteTransaction: (id: number) => void

  addBudget: (budget: Omit<Budget, "spent">) => void
  updateBudget: (category: string, budget: Partial<Budget>) => void

  addCategory: (category: Category) => void
  updateCategory: (name: string, category: Partial<Category>) => void
  deleteCategory: (name: string) => void

  updateSettings: (settings: Partial<Settings>) => void

  // Computed values
  getCurrentMonthStats: () => {
    totalIncome: number
    totalExpenses: number
    netBalance: number
  }
  getTopCategories: () => Array<{
    name: string
    amount: number
    percentage: number
    color: string
  }>
  getRecentTransactions: (limit: number) => Transaction[]
  getSavingsGoalProgress: () => {
    saved: number
    goal: number
    percentage: number
  }
  getBudgetStatus: (category: string) => "under" | "near" | "over"
  getMonthlyReport: (
    month: number,
    year: number,
  ) => {
    totalIncome: number
    totalExpenses: number
    netSavings: number
    transactionCount: number
    categoryBreakdown: Array<{
      category: string
      amount: number
      percentage: number
      transactionCount: number
    }>
  }
  getYearlyOverview: (year: number) => {
    totalIncome: number
    totalExpenses: number
    netSavings: number
  }
  getTopExpenses: (limit: number) => Transaction[]
  getSavingsRate: () => number

  initializeData: () => void
}

const defaultCategories: Category[] = [
  { name: "Salary", type: "income", color: "#10B981", icon: "DollarSign" },
  { name: "Freelance", type: "income", color: "#059669", icon: "Briefcase" },
  { name: "Investment", type: "income", color: "#047857", icon: "TrendingUp" },

  { name: "Food", type: "expense", color: "#EF4444", icon: "Utensils" },
  { name: "Transport", type: "expense", color: "#F97316", icon: "Car" },
  { name: "Entertainment", type: "expense", color: "#8B5CF6", icon: "Gamepad2" },
  { name: "Shopping", type: "expense", color: "#EC4899", icon: "ShoppingBag" },
  { name: "Bills", type: "expense", color: "#6B7280", icon: "Home" },
  { name: "Healthcare", type: "expense", color: "#DC2626", icon: "Heart" },
  { name: "Education", type: "expense", color: "#2563EB", icon: "GraduationCap" },
  { name: "Travel", type: "expense", color: "#0891B2", icon: "Plane" },
]

const sampleTransactions: Omit<Transaction, "id">[] = [
  { amount: 1000000, category: "Salary", date: "2024-01-01", description: "Monthly salary", type: "income" },
  { amount: 150000, category: "Freelance", date: "2024-01-15", description: "Consulting project", type: "income" },
  { amount: -80000, category: "Food", date: "2024-01-02", description: "Monthly groceries", type: "expense" },
  { amount: -25000, category: "Transport", date: "2024-01-03", description: "Fuel and maintenance", type: "expense" },
  { amount: -15000, category: "Entertainment", date: "2024-01-04", description: "Movies and dining", type: "expense" },
  {
    amount: -45000,
    category: "Shopping",
    date: "2024-01-05",
    description: "Clothing and accessories",
    type: "expense",
  },
  { amount: -200000, category: "Bills", date: "2024-01-06", description: "Rent payment", type: "expense" },
  { amount: -30000, category: "Healthcare", date: "2024-01-07", description: "Medical checkup", type: "expense" },
  { amount: -50000, category: "Education", date: "2024-01-08", description: "Professional course", type: "expense" },
  { amount: -120000, category: "Travel", date: "2024-01-09", description: "Weekend getaway", type: "expense" },
  { amount: -12000, category: "Food", date: "2024-01-10", description: "Restaurant dinner", type: "expense" },
  { amount: -8000, category: "Transport", date: "2024-01-11", description: "Taxi rides", type: "expense" },
  {
    amount: -5000,
    category: "Entertainment",
    date: "2024-01-12",
    description: "Netflix subscription",
    type: "expense",
  },
  { amount: -35000, category: "Shopping", date: "2024-01-13", description: "Electronics purchase", type: "expense" },
  {
    amount: -18000,
    category: "Bills",
    date: "2024-01-14",
    description: "Utilities (water, electricity)",
    type: "expense",
  },
  { amount: 75000, category: "Investment", date: "2024-01-16", description: "Investment returns", type: "income" },
  { amount: -40000, category: "Food", date: "2024-01-17", description: "Weekly groceries", type: "expense" },
  { amount: -10000, category: "Transport", date: "2024-01-18", description: "Public transport", type: "expense" },
  { amount: -20000, category: "Entertainment", date: "2024-01-19", description: "Concert tickets", type: "expense" },
  { amount: -15000, category: "Healthcare", date: "2024-01-20", description: "Pharmacy purchases", type: "expense" },
  { amount: -25000, category: "Food", date: "2024-01-21", description: "Special occasion meal", type: "expense" },
  { amount: -7000, category: "Transport", date: "2024-01-22", description: "Moto taxi", type: "expense" },
  { amount: -12000, category: "Shopping", date: "2024-01-23", description: "Personal care items", type: "expense" },
  { amount: -6000, category: "Entertainment", date: "2024-01-24", description: "Coffee shop", type: "expense" },
  { amount: -22000, category: "Bills", date: "2024-01-25", description: "Internet and phone", type: "expense" },
]

const defaultBudgets: Omit<Budget, "spent">[] = [
  { category: "Food", monthlyLimit: 150000, color: "#EF4444" },
  { category: "Transport", monthlyLimit: 80000, color: "#F97316" },
  { category: "Entertainment", monthlyLimit: 50000, color: "#8B5CF6" },
  { category: "Shopping", monthlyLimit: 100000, color: "#EC4899" },
  { category: "Bills", monthlyLimit: 250000, color: "#6B7280" },
  { category: "Healthcare", monthlyLimit: 60000, color: "#DC2626" },
  { category: "Education", monthlyLimit: 80000, color: "#2563EB" },
  { category: "Travel", monthlyLimit: 150000, color: "#0891B2" },
]

export const useFinanceStore = create<FinanceStore>()(
  persist(
    (set, get) => ({
      transactions: [],
      budgets: [],
      categories: [],
      settings: {
        userName: "Noella", // Default name, can be changed in settings
        currency: "RWF",
        monthlyBudgetLimit: 1000000, // 1M RWF default
        notifications: true,
      },

      addTransaction: (transaction) => {
        const newTransaction = {
          ...transaction,
          id: Date.now(),
        }
        set((state) => ({
          transactions: [newTransaction, ...state.transactions],
          budgets: state.budgets.map((budget) => {
            if (budget.category === transaction.category && transaction.type === "expense") {
              return {
                ...budget,
                spent: budget.spent + Math.abs(transaction.amount),
              }
            }
            return budget
          }),
        }))
      },

      updateTransaction: (id, updatedTransaction) => {
        set((state) => ({
          transactions: state.transactions.map((t) => (t.id === id ? { ...t, ...updatedTransaction } : t)),
        }))
      },

      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        }))
      },

      addBudget: (budget) => {
        const currentMonth = new Date().getMonth()
        const currentYear = new Date().getFullYear()
        const spent = get()
          .transactions.filter((t) => {
            const transactionDate = new Date(t.date)
            return (
              t.category === budget.category &&
              t.type === "expense" &&
              transactionDate.getMonth() === currentMonth &&
              transactionDate.getFullYear() === currentYear
            )
          })
          .reduce((sum, t) => sum + Math.abs(t.amount), 0)

        set((state) => ({
          budgets: [...state.budgets, { ...budget, spent }],
        }))
      },

      updateBudget: (category, updatedBudget) => {
        set((state) => ({
          budgets: state.budgets.map((b) => (b.category === category ? { ...b, ...updatedBudget } : b)),
        }))
      },

      addCategory: (category) => {
        set((state) => ({
          categories: [...state.categories, category],
        }))
      },

      updateCategory: (name, updatedCategory) => {
        set((state) => ({
          categories: state.categories.map((c) => (c.name === name ? { ...c, ...updatedCategory } : c)),
        }))
      },

      deleteCategory: (name) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.name !== name),
        }))
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }))
      },

      getCurrentMonthStats: () => {
        const currentMonth = new Date().getMonth()
        const currentYear = new Date().getFullYear()
        const currentMonthTransactions = get().transactions.filter((t) => {
          const transactionDate = new Date(t.date)
          return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear
        })

        const totalIncome = currentMonthTransactions
          .filter((t) => t.type === "income")
          .reduce((sum, t) => sum + t.amount, 0)

        const totalExpenses = currentMonthTransactions
          .filter((t) => t.type === "expense")
          .reduce((sum, t) => sum + Math.abs(t.amount), 0)

        return {
          totalIncome,
          totalExpenses,
          netBalance: totalIncome - totalExpenses,
        }
      },

      getTopCategories: () => {
        const currentMonth = new Date().getMonth()
        const currentYear = new Date().getFullYear()
        const expenses = get().transactions.filter((t) => {
          const transactionDate = new Date(t.date)
          return (
            t.type === "expense" &&
            transactionDate.getMonth() === currentMonth &&
            transactionDate.getFullYear() === currentYear
          )
        })

        const categoryTotals = expenses.reduce(
          (acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount)
            return acc
          },
          {} as Record<string, number>,
        )

        const totalExpenses = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0)
        const categories = get().categories

        return Object.entries(categoryTotals)
          .map(([name, amount]) => ({
            name,
            amount,
            percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
            color: categories.find((c) => c.name === name)?.color || "#6B7280",
          }))
          .sort((a, b) => b.amount - a.amount)
          .slice(0, 3)
      },

      getRecentTransactions: (limit) => {
        return get()
          .transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, limit)
      },

      getSavingsGoalProgress: () => {
        const goal = get().settings.monthlyBudgetLimit
        const stats = get().getCurrentMonthStats()
        const saved = Math.max(0, stats.netBalance)

        return {
          saved,
          goal,
          percentage: goal > 0 ? Math.min((saved / goal) * 100, 100) : 0,
        }
      },

      getBudgetStatus: (category) => {
        const budget = get().budgets.find((b) => b.category === category)
        if (!budget) return "under"

        const percentage = (budget.spent / budget.monthlyLimit) * 100
        if (percentage >= 100) return "over"
        if (percentage >= 80) return "near"
        return "under"
      },

      getMonthlyReport: (month, year) => {
        const monthTransactions = get().transactions.filter((t) => {
          const transactionDate = new Date(t.date)
          return transactionDate.getMonth() === month && transactionDate.getFullYear() === year
        })

        const totalIncome = monthTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

        const totalExpenses = monthTransactions
          .filter((t) => t.type === "expense")
          .reduce((sum, t) => sum + t.amount, 0)

        const expensesByCategory = monthTransactions
          .filter((t) => t.type === "expense")
          .reduce(
            (acc, t) => {
              if (!acc[t.category]) {
                acc[t.category] = { amount: 0, count: 0 }
              }
              acc[t.category].amount += Math.abs(t.amount)
              acc[t.category].count += 1
              return acc
            },
            {} as Record<string, { amount: number; count: number }>,
          )

        const totalExpenseAmount = Math.abs(totalExpenses)
        const categoryBreakdown = Object.entries(expensesByCategory)
          .map(([category, data]) => ({
            category,
            amount: data.amount,
            percentage: totalExpenseAmount > 0 ? (data.amount / totalExpenseAmount) * 100 : 0,
            transactionCount: data.count,
          }))
          .sort((a, b) => b.amount - a.amount)

        return {
          totalIncome,
          totalExpenses,
          netSavings: totalIncome + totalExpenses,
          transactionCount: monthTransactions.length,
          categoryBreakdown,
        }
      },

      getYearlyOverview: (year) => {
        const yearTransactions = get().transactions.filter((t) => {
          const transactionDate = new Date(t.date)
          return transactionDate.getFullYear() === year
        })

        const totalIncome = yearTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

        const totalExpenses = yearTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

        return {
          totalIncome,
          totalExpenses,
          netSavings: totalIncome + totalExpenses,
        }
      },

      getTopExpenses: (limit) => {
        return get()
          .transactions.filter((t) => t.type === "expense")
          .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
          .slice(0, limit)
      },

      getSavingsRate: () => {
        const currentYear = new Date().getFullYear()
        const yearlyOverview = get().getYearlyOverview(currentYear)

        if (yearlyOverview.totalIncome === 0) return 0
        return (yearlyOverview.netSavings / yearlyOverview.totalIncome) * 100
      },

      initializeData: () => {
        const state = get()
        if (state.transactions.length === 0) {
          // Add sample transactions
          sampleTransactions.forEach((transaction) => {
            get().addTransaction(transaction)
          })

          // Add default categories
          set({ categories: defaultCategories })

          // Add default budgets
          defaultBudgets.forEach((budget) => {
            get().addBudget(budget)
          })
        }
      },
    }),
    {
      name: "finance-storage",
    },
  ),
)
