"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { realTimeService } from "../services/realTimeService"
import { addNotification, removeNotification } from "../store"
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Bell,
  BellOff,
  Filter,
  Search,
  Activity,
  Clock,
  Trash2,
} from "lucide-react"

export default function Alerts() {
  const dispatch = useDispatch()
  const { isRealTimeEnabled, notifications } = useSelector((state) => state.app)
  const [realTimeData, setRealTimeData] = useState(null)
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Real-time data subscription
  useEffect(() => {
    if (!isRealTimeEnabled) return

    const unsubscribe = realTimeService.subscribe((data) => {
      setRealTimeData(data)

      // Add new alerts to notifications
      if (data.alerts && data.alerts.length > 0) {
        data.alerts.forEach((alert) => {
          dispatch(addNotification(alert))
        })
      }
    })

    return unsubscribe
  }, [isRealTimeEnabled, dispatch])

  const getAlertIcon = (type) => {
    switch (type) {
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
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
      case "success":
        return "border-l-green-500 bg-green-50"
      default:
        return "border-l-gray-500 bg-gray-50"
    }
  }

  const mockAlerts = [
    {
      id: 1,
      type: "error",
      title: "Critical Energy Consumption",
      message: "Manufacturing equipment consuming 150% above normal levels",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      deviceId: 4,
      resolved: false,
    },
    {
      id: 2,
      type: "warning",
      title: "High Temperature Alert",
      message: "HVAC system temperature exceeds optimal range",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      deviceId: 1,
      resolved: false,
    },
    {
      id: 3,
      type: "info",
      title: "Scheduled Maintenance Due",
      message: "Lighting system maintenance scheduled for tomorrow",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
      deviceId: 2,
      resolved: false,
    },
    {
      id: 4,
      type: "success",
      title: "Energy Efficiency Improved",
      message: "Computer network efficiency increased by 12%",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
      deviceId: 3,
      resolved: true,
    },
    {
      id: 5,
      type: "warning",
      title: "Budget Threshold Exceeded",
      message: "Monthly energy budget 85% utilized",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
      resolved: false,
    },
  ]

  const allAlerts = [...notifications, ...mockAlerts]

  const filteredAlerts = allAlerts.filter((alert) => {
    const matchesFilter = filter === "all" || alert.type === filter || (filter === "unresolved" && !alert.resolved)
    const matchesSearch =
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const alertStats = {
    total: allAlerts.length,
    critical: allAlerts.filter((a) => a.type === "error").length,
    warning: allAlerts.filter((a) => a.type === "warning").length,
    unresolved: allAlerts.filter((a) => !a.resolved).length,
  }

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const alertTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now - alertTime) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <main className="flex-1 p-8 overflow-y-auto bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Alerts & Notifications</h1>
              <p className="text-gray-600 mt-2">Monitor system alerts and notifications</p>
            </div>
            {isRealTimeEnabled && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200">
                <Activity className="h-4 w-4 animate-pulse" />
                <span className="text-sm font-medium">Live Alerts</span>
              </div>
            )}
          </div>
        </div>

        {/* Alert Statistics */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Bell className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{alertStats.total}</p>
              <p className="text-sm text-gray-600">Total Alerts</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{alertStats.critical}</p>
              <p className="text-sm text-gray-600">Critical Alerts</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{alertStats.warning}</p>
              <p className="text-sm text-gray-600">Warnings</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{alertStats.unresolved}</p>
              <p className="text-sm text-gray-600">Unresolved</p>
            </div>
          </div>
        </section>

        {/* Filters and Search */}
        <section className="mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex flex-wrap items-center gap-4">
              {/* Search */}
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search alerts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Filter Buttons */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                {["all", "error", "warning", "info", "success", "unresolved"].map((filterType) => (
                  <button
                    key={filterType}
                    onClick={() => setFilter(filterType)}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      filter === filterType ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Alerts List */}
        <section className="mb-8">
          <div className="space-y-4">
            {filteredAlerts.length === 0 ? (
              <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
                <BellOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No alerts found</h3>
                <p className="text-gray-600">No alerts match your current filters.</p>
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${getAlertColor(alert.type)} ${
                    alert.resolved ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex-shrink-0 mt-1">{getAlertIcon(alert.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                          {alert.resolved && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Resolved</span>
                          )}
                          {isRealTimeEnabled && !alert.resolved && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full animate-pulse">
                              Live
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3">{alert.message}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatTimeAgo(alert.timestamp)}
                          </span>
                          {alert.deviceId && <span>Device ID: {alert.deviceId}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {!alert.resolved && (
                        <button className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
                          Resolve
                        </button>
                      )}
                      <button
                        onClick={() => dispatch(removeNotification(alert.id))}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Alert Settings */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Alert Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Critical alerts</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Warning alerts</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Info notifications</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Email notifications</span>
                  <input type="checkbox" className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">SMS alerts</span>
                  <input type="checkbox" className="rounded" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Alert Thresholds</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">High consumption threshold (%)</label>
                  <input
                    type="number"
                    defaultValue={120}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Critical consumption threshold (%)
                  </label>
                  <input
                    type="number"
                    defaultValue={150}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget alert threshold (%)</label>
                  <input
                    type="number"
                    defaultValue={85}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
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
