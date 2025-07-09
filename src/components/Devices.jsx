"use client"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { realTimeService } from "../services/realTimeService"
import { Zap, Power, Settings, AlertTriangle, CheckCircle, XCircle, Activity, Gauge, Clock, Wrench } from "lucide-react"

export default function Devices() {
  const { isRealTimeEnabled } = useSelector((state) => state.app)
  const [realTimeData, setRealTimeData] = useState(null)
  const [selectedDevice, setSelectedDevice] = useState(null)

  // Real-time data subscription
  useEffect(() => {
    if (!isRealTimeEnabled) return

    const unsubscribe = realTimeService.subscribe((data) => {
      setRealTimeData(data)
    })

    return unsubscribe
  }, [isRealTimeEnabled])

  const getStatusIcon = (status) => {
    switch (status) {
      case "Normal":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "Warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "Critical":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "Offline":
        return <Power className="h-5 w-5 text-gray-500" />
      default:
        return <CheckCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Normal":
        return "bg-green-50 text-green-700 border-green-200"
      case "Warning":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "Critical":
        return "bg-red-50 text-red-700 border-red-200"
      case "Offline":
        return "bg-gray-50 text-gray-700 border-gray-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const mockDevices = [
    {
      id: 1,
      name: "HVAC System",
      currentConsumption: 45,
      status: "Normal",
      efficiency: 85,
      location: "Building A - Floor 1",
      lastMaintenance: "2024-01-15",
      nextMaintenance: "2024-04-15",
      operatingHours: 18,
      temperature: 22,
    },
    {
      id: 2,
      name: "Lighting System",
      currentConsumption: 25,
      status: "Normal",
      efficiency: 92,
      location: "Building A - All Floors",
      lastMaintenance: "2024-02-01",
      nextMaintenance: "2024-05-01",
      operatingHours: 12,
      brightness: 85,
    },
    {
      id: 3,
      name: "Computer Network",
      currentConsumption: 35,
      status: "Warning",
      efficiency: 78,
      location: "Building A - Floor 2",
      lastMaintenance: "2024-01-20",
      nextMaintenance: "2024-04-20",
      operatingHours: 24,
      load: 68,
    },
    {
      id: 4,
      name: "Manufacturing Equipment",
      currentConsumption: 80,
      status: "Critical",
      efficiency: 65,
      location: "Factory - Production Line",
      lastMaintenance: "2023-12-10",
      nextMaintenance: "2024-03-10",
      operatingHours: 16,
      pressure: 95,
    },
    {
      id: 5,
      name: "Security System",
      currentConsumption: 8,
      status: "Normal",
      efficiency: 95,
      location: "Building A - All Areas",
      lastMaintenance: "2024-02-10",
      nextMaintenance: "2024-05-10",
      operatingHours: 24,
      cameras: 12,
    },
  ]

  const devices = realTimeData?.devices || mockDevices

  return (
    <main className="flex-1 p-8 overflow-y-auto bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Device Management</h1>
              <p className="text-gray-600 mt-2">Monitor and control all connected devices</p>
            </div>
            {isRealTimeEnabled && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200">
                <Activity className="h-4 w-4 animate-pulse" />
                <span className="text-sm font-medium">Live Monitoring</span>
              </div>
            )}
          </div>
        </div>

        {/* Device Grid */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {devices.map((device) => (
              <div
                key={device.id}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedDevice(device)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Zap className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{device.name}</h3>
                      <p className="text-xs text-gray-500">{device.location}</p>
                    </div>
                  </div>
                  {getStatusIcon(device.status)}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Consumption</span>
                    <span className="text-lg font-bold text-gray-900">{device.currentConsumption} kWh</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Efficiency</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${device.efficiency >= 80 ? "bg-green-500" : device.efficiency >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
                          style={{ width: `${device.efficiency}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{device.efficiency}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(device.status)}`}
                    >
                      {device.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Operating Hours</span>
                    <span className="text-sm font-medium">{device.operatingHours}h/day</span>
                  </div>

                  {isRealTimeEnabled && (
                    <div className="flex items-center gap-1 text-xs text-green-600 pt-2 border-t">
                      <Activity className="h-3 w-3" />
                      <span>Live Data</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Device Detail Modal */}
        {selectedDevice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Zap className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedDevice.name}</h2>
                      <p className="text-gray-600">{selectedDevice.location}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedDevice(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <XCircle className="h-6 w-6 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Status Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="p-3 bg-blue-100 rounded-lg mb-2 mx-auto w-fit">
                      <Gauge className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{selectedDevice.currentConsumption}</p>
                    <p className="text-sm text-gray-600">kWh Current</p>
                  </div>

                  <div className="text-center">
                    <div className="p-3 bg-green-100 rounded-lg mb-2 mx-auto w-fit">
                      <Activity className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{selectedDevice.efficiency}%</p>
                    <p className="text-sm text-gray-600">Efficiency</p>
                  </div>

                  <div className="text-center">
                    <div className="p-3 bg-orange-100 rounded-lg mb-2 mx-auto w-fit">
                      <Clock className="h-6 w-6 text-orange-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{selectedDevice.operatingHours}</p>
                    <p className="text-sm text-gray-600">Hours/Day</p>
                  </div>

                  <div className="text-center">
                    <div
                      className={`p-3 rounded-lg mb-2 mx-auto w-fit ${getStatusColor(selectedDevice.status).replace("text-", "text-").replace("bg-", "bg-").replace("border-", "bg-")}`}
                    >
                      {getStatusIcon(selectedDevice.status)}
                    </div>
                    <p className="text-sm font-bold text-gray-900">{selectedDevice.status}</p>
                    <p className="text-sm text-gray-600">Status</p>
                  </div>
                </div>

                {/* Maintenance Info */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Wrench className="h-5 w-5" />
                    Maintenance Schedule
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Last Maintenance</p>
                      <p className="font-medium">{new Date(selectedDevice.lastMaintenance).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Next Maintenance</p>
                      <p className="font-medium">{new Date(selectedDevice.nextMaintenance).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Device-specific metrics */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Device Metrics</h3>
                  {selectedDevice.temperature && (
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm text-gray-600">Temperature</span>
                      <span className="font-medium">{selectedDevice.temperature}°C</span>
                    </div>
                  )}
                  {selectedDevice.brightness && (
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <span className="text-sm text-gray-600">Brightness</span>
                      <span className="font-medium">{selectedDevice.brightness}%</span>
                    </div>
                  )}
                  {selectedDevice.load && (
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm text-gray-600">CPU Load</span>
                      <span className="font-medium">{selectedDevice.load}%</span>
                    </div>
                  )}
                  {selectedDevice.pressure && (
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <span className="text-sm text-gray-600">Pressure</span>
                      <span className="font-medium">{selectedDevice.pressure} PSI</span>
                    </div>
                  )}
                  {selectedDevice.cameras && (
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm text-gray-600">Active Cameras</span>
                      <span className="font-medium">{selectedDevice.cameras}/12</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6 pt-6 border-t">
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Settings className="h-4 w-4" />
                    Configure
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <Wrench className="h-4 w-4" />
                    Schedule Maintenance
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                    <Power className="h-4 w-4" />
                    Power Control
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
