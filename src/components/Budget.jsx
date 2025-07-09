"use client"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { realTimeService } from "../services/realTimeService"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  Calendar,
  PieChart,
  BarChart3,
  Activity,
} from "lucide-react"

export default function Budget() {
  const { isRealTimeEnabled } = useSelector((state) => state.app)
  const [realTimeData, setRealTimeData] = useState(null)
  const [budgetData, setBudgetData] = useState({
    monthlyBudget: 50000000, // Rp 50 juta
    currentSpending: 0,
    projectedSpending: 0,
    savings: 0,
    variance: 0,
  })

  // Real-time data subscription
  useEffect(() => {
    if (!isRealTimeEnabled) return

    const unsubscribe = realTimeService.subscribe((data) => {
      setRealTimeData(data)

      // Calculate budget metrics
      const dailyCost = (data.totalConsumption || 150) * 1500 // Rp 1500 per kWh
      const monthlyProjection = dailyCost * 30
      const currentMonth = new Date().getDate()
      const currentSpending = dailyCost * currentMonth
      const variance = (currentSpending / budgetData.monthlyBudget - currentMonth / 30) * 100

      setBudgetData((prev) => ({
        ...prev,
        currentSpending: Math.round(currentSpending),
        projectedSpending: Math.round(monthlyProjection),
        savings: Math.round(prev.monthlyBudget - monthlyProjection),
        variance: Math.round(variance * 100) / 100,
      }))
    })

    return unsubscribe
  }, [isRealTimeEnabled, budgetData.monthlyBudget])

  const budgetCategories = [
    { name: "HVAC", budget: 20000000, spent: 15500000, color: "#3b82f6" },
    { name: "Lighting", budget: 8000000, spent: 6200000, color: "#10b981" },
    { name: "Manufacturing", budget: 15000000, spent: 12800000, color: "#f59e0b" },
    { name: "IT Equipment", budget: 5000000, spent: 4100000, color: "#ef4444" },
    { name: "Security", budget: 2000000, spent: 1400000, color: "#8b5cf6" },
  ]

  const monthlyTrend = [
    { month: "Jan", budget: 50000000, actual: 48500000 },
    { month: "Feb", budget: 50000000, actual: 52100000 },
    { month: "Mar", budget: 50000000, actual: 49800000 },
    { month: "Apr", budget: 50000000, actual: 51200000 },
    { month: "May", budget: 50000000, actual: 47900000 },
    { month: "Jun", budget: 50000000, actual: budgetData.projectedSpending },
  ]

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getBudgetStatus = (spent, budget) => {
    const percentage = (spent / budget) * 100
    if (percentage > 100) return { status: "Over Budget", color: "text-red-600 bg-red-50 border-red-200" }
    if (percentage > 90) return { status: "Near Limit", color: "text-orange-600 bg-orange-50 border-orange-200" }
    if (percentage > 75) return { status: "On Track", color: "text-yellow-600 bg-yellow-50 border-yellow-200" }
    return { status: "Under Budget", color: "text-green-600 bg-green-50 border-green-200" }
  }

  return (
    <main className="flex-1 p-8 overflow-y-auto bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Budget Management</h1>
              <p className="text-gray-600 mt-2">Track and manage energy costs and budgets</p>
            </div>
            {isRealTimeEnabled && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200">
                <Activity className="h-4 w-4 animate-pulse" />
                <span className="text-sm font-medium">Live Budget Tracking</span>
              </div>
            )}
          </div>
        </div>

        {/* Budget Overview */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Monthly Budget Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency(budgetData.monthlyBudget)}</p>
              <p className="text-sm text-gray-600">Monthly Budget</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                {budgetData.variance > 0 ? (
                  <TrendingUp className="h-4 w-4 text-red-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-green-500" />
                )}
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency(budgetData.currentSpending)}</p>
              <p className="text-sm text-gray-600">Current Spending</p>
              <p className={`text-xs mt-1 ${budgetData.variance > 0 ? "text-red-600" : "text-green-600"}`}>
                {budgetData.variance > 0 ? "+" : ""}
                {budgetData.variance}% vs budget
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
                <TrendingUp className="h-4 w-4 text-orange-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency(budgetData.projectedSpending)}</p>
              <p className="text-sm text-gray-600">Projected Monthly</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <PieChart className="h-6 w-6 text-purple-600" />
                </div>
                {budgetData.savings > 0 ? (
                  <TrendingDown className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-red-500" />
                )}
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency(Math.abs(budgetData.savings))}</p>
              <p className="text-sm text-gray-600">{budgetData.savings > 0 ? "Projected Savings" : "Budget Overrun"}</p>
            </div>
          </div>
        </section>

        {/* Budget by Category */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Budget by Category</h2>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="space-y-6">
              {budgetCategories.map((category) => {
                const percentage = (category.spent / category.budget) * 100
                const status = getBudgetStatus(category.spent, category.budget)

                return (
                  <div key={category.name} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }}></div>
                        <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                          {status.status}
                        </span>
                        <span className="text-sm text-gray-600">
                          {formatCurrency(category.spent)} / {formatCurrency(category.budget)}
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(percentage, 100)}%`,
                          backgroundColor: category.color,
                        }}
                      ></div>
                    </div>

                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{Math.round(percentage)}% used</span>
                      <span>{formatCurrency(category.budget - category.spent)} remaining</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Monthly Trend */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Monthly Spending Trend</h2>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="space-y-4">
              {monthlyTrend.map((month) => {
                const variance = month.actual - month.budget
                const isOverBudget = variance > 0

                return (
                  <div key={month.month} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{month.month} 2024</h3>
                        <p className="text-sm text-gray-600">Budget: {formatCurrency(month.budget)}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(month.actual)}</p>
                      <p className={`text-sm ${isOverBudget ? "text-red-600" : "text-green-600"}`}>
                        {isOverBudget ? "+" : ""}
                        {formatCurrency(variance)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Budget Alerts */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Budget Alerts</h2>
          <div className="space-y-4">
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-xl">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 mr-3" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Manufacturing Budget Alert</h3>
                  <p className="text-red-800 text-sm">
                    Manufacturing category has exceeded 85% of monthly budget. Consider implementing energy-saving
                    measures.
                  </p>
                  <p className="text-red-600 text-xs mt-2">2 hours ago</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-xl">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
                <div>
                  <h3 className="font-semibold text-yellow-900 mb-1">Monthly Projection Warning</h3>
                  <p className="text-yellow-800 text-sm">
                    Current spending trend suggests you may exceed monthly budget by 8%. Review consumption patterns.
                  </p>
                  <p className="text-yellow-600 text-xs mt-2">1 day ago</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-xl">
              <div className="flex items-start">
                <TrendingDown className="h-5 w-5 text-green-600 mt-0.5 mr-3" />
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">Cost Savings Achievement</h3>
                  <p className="text-green-800 text-sm">
                    Lighting optimization has resulted in 15% cost reduction this month. Great job!
                  </p>
                  <p className="text-green-600 text-xs mt-2">3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Budget Controls */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Budget Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Set Monthly Budget</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Budget (IDR)</label>
                  <input
                    type="number"
                    value={budgetData.monthlyBudget}
                    onChange={(e) =>
                      setBudgetData((prev) => ({ ...prev, monthlyBudget: Number.parseInt(e.target.value) }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Update Budget
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Alert Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Budget threshold alerts</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Daily spending notifications</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Monthly reports</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
