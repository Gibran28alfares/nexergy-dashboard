"use client"

import { useDispatch, useSelector } from "react-redux"
import { setView } from "../store"
import { LayoutDashboard, BarChart3, Zap, DollarSign, AlertTriangle, Settings, Power, Wifi } from "lucide-react"

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "devices", label: "Devices", icon: Zap },
  { key: "budget", label: "Budget", icon: DollarSign },
  { key: "alerts", label: "Alerts", icon: AlertTriangle },
  { key: "settings", label: "Settings", icon: Settings },
]

export default function Sidebar() {
  const dispatch = useDispatch()
  const { view, isRealTimeEnabled, realTimeData } = useSelector((state) => state.app)

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-800 text-white flex flex-col shadow-xl z-40">
      {/* Header/Brand */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-energy-blue to-energy-green rounded-lg flex items-center justify-center">
            <Power className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">NEXERGY</h1>
            <p className="text-xs text-slate-400">Smart Energy Management</p>
          </div>
        </div>
      </div>

      {/* Real-time Status */}
      <div className="px-6 py-3 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-400">
              {realTimeData?.lastUpdate ? new Date(realTimeData.lastUpdate).toLocaleTimeString() : new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-grow py-4 overflow-y-auto">
        <div className="space-y-2 px-3">
          {navItems.map((item) => {
            const isActive = view === item.key
            const Icon = item.icon
            return (
              <button
                key={item.key}
                onClick={() => dispatch(setView(item.key))}
                className={`
                    group flex items-center w-full px-4 py-2 text-left rounded-lg transition-all duration-200 relative
                  ${
                    isActive
                      ? "bg-slate-700 text-white shadow-md border-l-4 border-energy-blue"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white"
                  }
                `}
              >
                <Icon className="mr-3 h-5 w-5" />
                <span className="font-medium">{item.label}</span>
                {isActive && <div className="ml-auto w-2 h-2 bg-energy-blue rounded-full"></div>}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-1">
          <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
            <span className="text-slate-300 text-sm font-semibold">A</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-slate-400">admin@nexergy.com</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
