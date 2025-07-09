"use client"

import { useDispatch, useSelector } from "react-redux"
import { setTimeFilter, setLocation, toggleRealTime } from "../store"
import { Download, RefreshCw, Wifi, WifiOff } from "lucide-react"

export default function FilterBar() {
  const dispatch = useDispatch()
  const { timeFilter, location, isRealTimeEnabled } = useSelector((state) => state.app)

  const handleExport = () => {
    // Simulate export functionality
    const data = {
      timestamp: new Date().toISOString(),
      filter: { timeFilter, location },
      message: "Export functionality would be implemented here",
    }
    console.log("Exporting data:", data)
    alert("Export started! Check console for details.")
  }

  return (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      {/* Time Filter */}
      <div className="flex bg-white rounded-lg border shadow-sm">
        {["hour", "day", "week", "month"].map((period) => (
          <button
            key={period}
            onClick={() => dispatch(setTimeFilter(period))}
            className={`px-4 py-2 text-sm font-medium transition-colors first:rounded-l-lg last:rounded-r-lg ${
              timeFilter === period ? "bg-energy-blue text-white" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </button>
        ))}
      </div>

      {/* Location Filter */}
      <select
        value={location}
        onChange={(e) => dispatch(setLocation(e.target.value))}
        className="px-4 py-2 bg-white border rounded-lg shadow-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-energy-blue"
      >
        <option value="all">All Locations</option>
        <option value="building-a">Building A</option>
        <option value="building-b">Building B</option>
        <option value="factory">Factory</option>
        <option value="warehouse">Warehouse</option>
      </select>

      {/* Real-time Toggle */}
      <button
        onClick={() => dispatch(toggleRealTime())}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
          isRealTimeEnabled
            ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
            : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
        }`}
      >
        {isRealTimeEnabled ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
        <span className="text-sm font-medium">{isRealTimeEnabled ? "Real-time" : "Static"}</span>
      </button>

      {/* Export Button */}
      <button
        onClick={handleExport}
        className="flex items-center gap-2 px-4 py-2 bg-energy-blue text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
      >
        <Download className="h-4 w-4" />
        <span className="text-sm font-medium">Export</span>
      </button>

      {/* Refresh Button */}
      <button
        onClick={() => window.location.reload()}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <RefreshCw className="h-4 w-4" />
        <span className="text-sm font-medium">Refresh</span>
      </button>
    </div>
  )
}
