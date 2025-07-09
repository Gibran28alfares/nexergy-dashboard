"use client"

import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { Chart } from "chart.js/auto"
import { realTimeService } from "../services/realTimeService"
import { TrendingUp, TrendingDown, BarChart3, PieChart, Activity, Calendar, Target, Zap } from "lucide-react"

export default function Analytics() {
  const { timeFilter, isRealTimeEnabled } = useSelector((state) => state.app)
  const [realTimeData, setRealTimeData] = useState(null)
  const [analytics, setAnalytics] = useState({
    totalConsumption: 0,
    averageConsumption: 0,
    peakConsumption: 0,
    efficiency: 0,
    costSavings: 0,
    carbonFootprint: 0,
  })

  const trendChartRef = useRef(null)
  const comparisonChartRef = useRef(null)
  const efficiencyChartRef = useRef(null)

  // Real-time data subscription
  useEffect(() => {
    if (!isRealTimeEnabled) return

    const unsubscribe = realTimeService.subscribe((data) => {
      setRealTimeData(data)

      // Calculate analytics
      const devices = data.devices || []
      const totalConsumption = devices.reduce((sum, device) => sum + device.currentConsumption, 0)
      const averageConsumption = totalConsumption / devices.length
      const peakConsumption = Math.max(...devices.map((d) => d.currentConsumption))
      const efficiency = devices.reduce((sum, device) => sum + device.efficiency, 0) / devices.length

      setAnalytics({
        totalConsumption: Math.round(totalConsumption * 100) / 100,
        averageConsumption: Math.round(averageConsumption * 100) / 100,
        peakConsumption: Math.round(peakConsumption * 100) / 100,
        efficiency: Math.round(efficiency),
        costSavings: Math.round((efficiency - 70) * 100), // Simulated savings
        carbonFootprint: Math.round(totalConsumption * 0.5 * 100) / 100, // kg CO2
      })
    })

    return unsubscribe
  }, [isRealTimeEnabled])

  // Charts
  useEffect(() => {
    // Destroy existing charts
    if (trendChartRef.current) trendChartRef.current.destroy()
    if (comparisonChartRef.current) comparisonChartRef.current.destroy()
    if (efficiencyChartRef.current) efficiencyChartRef.current.destroy()

    // Generate data
    const historicalData = realTimeService.generateHistoricalData(timeFilter)
    const comparisonData = realTimeService.generateHistoricalData("week")

    // Trend Analysis Chart
    const trendCtx = document.getElementById("trendChart")?.getContext("2d")
    if (trendCtx) {
      trendChartRef.current = new Chart(trendCtx, {
        type: "line",
        data: {
          labels: historicalData.map((d) => d.time),
          datasets: [
            {
              label: "Current Period",
              data: historicalData.map((d) => d.consumption),
              borderColor: "#3b82f6",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              borderWidth: 2,
              tension: 0.4,
              fill: true,
            },
            {
              label: "Previous Period",
              data: historicalData.map((d) => d.consumption * 0.9 + Math.random() * 20),
              borderColor: "#6b7280",
              backgroundColor: "rgba(107, 114, 128, 0.1)",
              borderWidth: 2,
              tension: 0.4,
              fill: false,
              borderDash: [5, 5],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Consumption Trend Analysis",
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Consumption (kWh)",
              },
            },
          },
        },
      })
    }

    // Device Comparison Chart
    const comparisonCtx = document.getElementById("comparisonChart")?.getContext("2d")
    if (comparisonCtx && realTimeData?.devices) {
      comparisonChartRef.current = new Chart(comparisonCtx, {
        type: "bar",
        data: {
          labels: realTimeData.devices.map((d) => d.name),
          datasets: [
            {
              label: "Current Consumption",
              data: realTimeData.devices.map((d) => d.currentConsumption),
              backgroundColor: "#3b82f6",
            },
            {
              label: "Base Consumption",
              data: realTimeData.devices.map((d) => d.baseConsumption),
              backgroundColor: "#6b7280",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Device Consumption Comparison",
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Consumption (kWh)",
              },
            },
          },
        },
      })
    }

    // Efficiency Chart
    const efficiencyCtx = document.getElementById("efficiencyChart")?.getContext("2d")
    if (efficiencyCtx && realTimeData?.devices) {
      efficiencyChartRef.current = new Chart(efficiencyCtx, {
        type: "radar",
        data: {
          labels: realTimeData.devices.map((d) => d.name),
          datasets: [
            {
              label: "Efficiency %",
              data: realTimeData.devices.map((d) => d.efficiency),
              backgroundColor: "rgba(16, 185, 129, 0.2)",
              borderColor: "#10b981",
              borderWidth: 2,
              pointBackgroundColor: "#10b981",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "Device Efficiency Analysis",
            },
          },
          scales: {
            r: {
              beginAtZero: true,
              max: 100,
              ticks: {
                stepSize: 20,
              },
            },
          },
        },
      })
    }

    return () => {
      if (trendChartRef.current) trendChartRef.current.destroy()
      if (comparisonChartRef.current) comparisonChartRef.current.destroy()
      if (efficiencyChartRef.current) efficiencyChartRef.current.destroy()
    }
  }, [timeFilter, realTimeData])

  return (
    <main className="flex-1 p-8 overflow-y-auto bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Analytics</h1>
              <p className="text-gray-600 mt-2">Detailed energy consumption analysis and insights</p>
            </div>
            {isRealTimeEnabled && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200">
                <Activity className="h-4 w-4 animate-pulse" />
                <span className="text-sm font-medium">Live Analytics</span>
              </div>
            )}
          </div>
        </div>

        {/* Key Metrics */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Key Performance Indicators</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{analytics.totalConsumption}</p>
              <p className="text-sm text-gray-600">Total Consumption (kWh)</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
                <TrendingDown className="h-4 w-4 text-red-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{analytics.averageConsumption}</p>
              <p className="text-sm text-gray-600">Average Consumption</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Activity className="h-6 w-6 text-orange-600" />
                </div>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{analytics.peakConsumption}</p>
              <p className="text-sm text-gray-600">Peak Consumption</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{analytics.efficiency}%</p>
              <p className="text-sm text-gray-600">Overall Efficiency</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">Rp {analytics.costSavings.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Cost Savings</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <PieChart className="h-6 w-6 text-blue-600" />
                </div>
                <TrendingDown className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{analytics.carbonFootprint}</p>
              <p className="text-sm text-gray-600">CO₂ Footprint (kg)</p>
            </div>
          </div>
        </section>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Trend Analysis */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Trend Analysis</h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="h-80">
                <canvas id="trendChart"></canvas>
              </div>
            </div>
          </section>

          {/* Device Comparison */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Device Comparison</h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="h-80">
                <canvas id="comparisonChart"></canvas>
              </div>
            </div>
          </section>
        </div>

        {/* Efficiency Analysis */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Efficiency Analysis</h2>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="h-96">
              <canvas id="efficiencyChart"></canvas>
            </div>
          </div>
        </section>

        {/* Insights */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">AI-Powered Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3">Energy Optimization</h3>
              <p className="text-blue-800 text-sm mb-4">
                Based on current consumption patterns, you can save up to 15% by optimizing HVAC schedules during
                off-peak hours.
              </p>
              <button className="text-blue-600 text-sm font-medium hover:text-blue-700">View Recommendations →</button>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
              <h3 className="font-semibold text-green-900 mb-3">Peak Load Management</h3>
              <p className="text-green-800 text-sm mb-4">
                Peak consumption occurs between 2-4 PM. Consider load balancing to reduce demand charges by 20%.
              </p>
              <button className="text-green-600 text-sm font-medium hover:text-green-700">Configure Alerts →</button>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
              <h3 className="font-semibold text-orange-900 mb-3">Maintenance Alerts</h3>
              <p className="text-orange-800 text-sm mb-4">
                Manufacturing equipment efficiency has decreased by 8% this week. Schedule maintenance to prevent
                further degradation.
              </p>
              <button className="text-orange-600 text-sm font-medium hover:text-orange-700">
                Schedule Maintenance →
              </button>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-3">Cost Forecast</h3>
              <p className="text-purple-800 text-sm mb-4">
                Current consumption trends suggest a 12% increase in monthly costs. Implement energy-saving measures
                now.
              </p>
              <button className="text-purple-600 text-sm font-medium hover:text-purple-700">
                View Budget Impact →
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
