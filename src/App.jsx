import { useSelector } from "react-redux"
import Sidebar from "./components/Sidebar"
import Dashboard from "./components/Dashboard"
import Analytics from "./components/Analytics"
import Devices from "./components/Devices"
import Budget from "./components/Budget"
import Alerts from "./components/Alerts"
import Settings from "./components/Settings"

function App() {
  const view = useSelector((state) => state.app.view)

  const renderView = () => {
    switch (view) {
      case "dashboard":
        return <Dashboard />
      case "analytics":
        return <Analytics />
      case "devices":
        return <Devices />
      case "budget":
        return <Budget />
      case "alerts":
        return <Alerts />
      case "settings":
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 font-inter relative">
      <Sidebar />
      <div className="ml-64 min-h-screen">{renderView()}</div>
    </div>
  )
}

export default App
