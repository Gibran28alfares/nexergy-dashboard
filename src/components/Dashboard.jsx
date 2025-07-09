"use client"

import { useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react"
import { Chart } from "chart.js/auto"
import { realTimeService } from "../services/realTimeService"
import FilterBar from "./FilterBar"
import { Zap, DollarSign, TrendingUp, Clock, AlertTriangle, Activity } from "lucide-react"

export default function Dashboard() {
  const { timeFilter, isRealTimeEnabled } = useSelector((state) => state.app)
  const [realTimeData, setRealTimeData] = useState(null)
  const consumptionChartRef = useRef(null)
  const distributionChartRef = useRef(null)

  // Real-time data subscription
  useEffect(() => {
    if (!isRealTimeEnabled) return

    const unsubscribe = realTimeService.subscribe((data) => {
      setRealTimeData(data)
    })

    return unsubscribe
  }, [isRealTimeEnabled])

  // Chart creation and updates
  useEffect(() => {
    // Destroy existing charts
    if (consumptionChartRef.current) {
      consumptionChartRef.current.destroy()
    }
    if (distributionChartRef.current) {
      distributionChartRef.current.destroy()
    }

    // Generate historical data
    const historicalData = realTimeService.generateHistoricalData(timeFilter)

    // Create consumption trend chart
    const ctx = document.getElementById("consumptionChart")?.getContext("2d")
    if (ctx) {
      consumptionChartRef.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: historicalData.map((d) => d.time),
          datasets: [
            {
              label: "Energy Consumption (kWh)",
              data: historicalData.map((d) => d.consumption),
              borderColor: "#06b6d4",
              backgroundColor: "rgba(6, 182, 212, 0.1)",
              borderWidth: 3,
              tension: 0.4,
              fill: true,
              pointBackgroundColor: "#06b6d4",
              pointBorderColor: "#ffffff",
              pointBorderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: "bottom",
              labels: {
                usePointStyle: true,
                padding: 20,
              },
            },
          },
          scales: {
            x: {
              grid: {
                color: "#e0e7ff",
                drawBorder: false,
              },
              ticks: {
                color: "#6b7280",
                font: { size: 12 },
              },
            },
            y: {
              beginAtZero: true,
              grid: {
                color: "#e0e7ff",
                drawBorder: false,
              },
              ticks: {
                color: "#6b7280",
                font: { size: 12 },
              },
            },
          },
        },
      })
    }

    // Create distribution chart
    const ctxDist = document.getElementById("distributionChart")?.getContext("2d")
    if (ctxDist && realTimeData?.devices) {
      distributionChartRef.current = new Chart(ctxDist, {
        type: "doughnut",
        data: {
          labels: realTimeData.devices.map((d) => d.name),
          datasets: [
            {
              data: realTimeData.devices.map((d) => d.currentConsumption),
              backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"],
              borderWidth: 0,
              cutout: "60%",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                usePointStyle: true,
                padding: 15,
                font: { size: 12 },
              },
            },
          },
        },
      })
    }

    return () => {
      if (consumptionChartRef.current) {
        consumptionChartRef.current.destroy()
      }
      if (distributionChartRef.current) {
        distributionChartRef.current.destroy()
      }
    }
  }, [timeFilter, realTimeData])

  const getStatusColor = (status) => {
    switch (status) {
      case "Critical":
        return "text-red-600 bg-red-50 border-red-200"
      case "Warning":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "Normal":
        return "text-green-600 bg-green-50 border-green-200"
      case "Offline":
        return "text-gray-600 bg-gray-50 border-gray-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getAlertColor = (type) => {
    switch (type) {
      case "error":
        return "border-l-red-500 bg-red-50"
      case "warning":
        return "border-l-yellow-500 bg-yellow-50"
      case "info":
        return "border-l-blue-500 bg-blue-50"
      default:
        return "border-l-gray-500 bg-gray-50"
    }
  }

  return (
    <main className="flex-1 p-8 overflow-y-auto bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Energy Dashboard</h1>
              <p className="text-gray-600 mt-2">Real-time energy monitoring and analytics</p>
            </div>
            {isRealTimeEnabled && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200">
                <Activity className="h-4 w-4 animate-pulse" />
                <span className="text-sm font-medium">Live Data</span>
              </div>
            )}
          </div>
          <FilterBar />
        </div>

        {/* AI Predictions & Forecasting */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">AI Predictions & Forecasting</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                {isRealTimeEnabled && <div className="realtime-indicator"></div>}
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{realTimeData?.forecast?.nextMonth || "3247"} kWh</p>
              <p className="text-sm text-gray-600">Next Month Forecast</p>
              {realTimeData?.forecast && (
                <p className="text-xs text-gray-500 mt-2">Confidence: {realTimeData.forecast.confidence}%</p>
              )}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                {isRealTimeEnabled && <div className="realtime-indicator"></div>}
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                Rp {((realTimeData?.forecast?.nextMonth || 3247) * 1500).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Estimated Cost</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                {isRealTimeEnabled && <div className="realtime-indicator"></div>}
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{realTimeData?.efficiency || "18"}%</p>
              <p className="text-sm text-gray-600">Potential Savings</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                {isRealTimeEnabled && <div className="realtime-indicator"></div>}
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{new Date().getHours()}:00</p>
              <p className="text-sm text-gray-600">Peak Hour Today</p>
            </div>
          </div>
        </section>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Energy Consumption Trend */}
          <section className="lg:col-span-2">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Energy Consumption Trend</h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="h-80">
                <canvas id="consumptionChart"></canvas>
              </div>
            </div>
          </section>

          {/* Energy Distribution */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Energy Distribution</h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="h-80">
                <canvas id="distributionChart"></canvas>
              </div>
            </div>
          </section>
        </div>

        {/* Device Consumption */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Device Consumption</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {(
              realTimeData?.devices || [
                { name: "HVAC System", currentConsumption: 45, status: "Normal", efficiency: 85 },
                { name: "Lighting", currentConsumption: 25, status: "Normal", efficiency: 92 },
                { name: "Computers", currentConsumption: 35, status: "Warning", efficiency: 78 },
                { name: "Manufacturing", currentConsumption: 80, status: "Critical", efficiency: 65 },
                { name: "Security System", currentConsumption: 8, status: "Normal", efficiency: 95 },
              ]
            ).map((device, index) => (
              <div
                key={device.name || index}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 text-sm">{device.name}</h3>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(device.status)}`}>
                    {device.status}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Consumption</span>
                    <span className="text-sm font-bold text-gray-900">{device.currentConsumption} kWh</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Efficiency</span>
                    <span className="text-sm font-medium text-gray-700">{device.efficiency}%</span>
                  </div>
                  {isRealTimeEnabled && (
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <Activity className="h-3 w-3" />
                      <span>Live</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Alerts */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recent Alerts</h2>
          <div className="space-y-4">
            {(
              realTimeData?.alerts || [
                {
                  title: "High Energy Consumption",
                  message: "Manufacturing unit consuming 25% above normal levels",
                  type: "warning",
                },
                {
                  title: "Device Maintenance Required",
                  message: "HVAC System requires scheduled maintenance",
                  type: "info",
                },
                {
                  title: "Energy Efficiency Improved",
                  message: "Lighting system efficiency increased by 12%",
                  type: "info",
                },
              ]
            )
              .slice(0, 5)
              .map((alert, index) => (
                <div
                  key={alert.id || index}
                  className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${getAlertColor(alert.type)}`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{alert.title}</h3>
                      <p className="text-gray-600">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {alert.timestamp ? new Date(alert.timestamp).toLocaleString() : "Just now"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>
      </div>
    </main>
  )
}
