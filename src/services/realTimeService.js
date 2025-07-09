// Real-time data simulation service
class RealTimeService {
  constructor() {
    this.subscribers = new Set()
    this.isRunning = false
    this.interval = null
    this.baseConsumption = 150
    this.devices = [
      { id: 1, name: "HVAC System", baseConsumption: 45, variance: 15 },
      { id: 2, name: "Lighting", baseConsumption: 25, variance: 8 },
      { id: 3, name: "Computers", baseConsumption: 35, variance: 12 },
      { id: 4, name: "Manufacturing", baseConsumption: 80, variance: 25 },
      { id: 5, name: "Security System", baseConsumption: 8, variance: 3 },
    ]
  }

  subscribe(callback) {
    this.subscribers.add(callback)
    if (!this.isRunning) {
      this.start()
    }
    return () => this.unsubscribe(callback)
  }

  unsubscribe(callback) {
    this.subscribers.delete(callback)
    if (this.subscribers.size === 0) {
      this.stop()
    }
  }

  start() {
    if (this.isRunning) return

    this.isRunning = true
    this.interval = setInterval(() => {
      this.generateData()
    }, 2000) // Update every 2 seconds
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
    this.isRunning = false
  }

  generateData() {
    const now = new Date()
    const hour = now.getHours()

    // Simulate daily consumption patterns
    let multiplier = 1
    if (hour >= 6 && hour <= 8)
      multiplier = 1.3 // Morning peak
    else if (hour >= 9 && hour <= 17)
      multiplier = 1.1 // Work hours
    else if (hour >= 18 && hour <= 20)
      multiplier = 1.2 // Evening peak
    else multiplier = 0.7 // Night/off hours

    // Generate device data
    const deviceData = this.devices.map((device) => {
      const variance = (Math.random() - 0.5) * device.variance
      const consumption = Math.max(0, (device.baseConsumption + variance) * multiplier)
      const status = this.getDeviceStatus(consumption, device.baseConsumption)

      return {
        ...device,
        currentConsumption: Math.round(consumption * 100) / 100,
        status,
        efficiency: Math.round((device.baseConsumption / consumption) * 100),
        lastUpdate: now.toISOString(),
      }
    })

    // Calculate totals
    const totalConsumption = deviceData.reduce((sum, device) => sum + device.currentConsumption, 0)
    const activeAlerts = deviceData.filter(
      (device) => device.status === "Critical" || device.status === "Warning",
    ).length

    // Generate alerts if needed
    const alerts = this.generateAlerts(deviceData)

    const data = {
      timestamp: now.toISOString(),
      totalConsumption: Math.round(totalConsumption * 100) / 100,
      devices: deviceData,
      activeAlerts,
      alerts,
      forecast: this.generateForecast(totalConsumption),
      efficiency: Math.round((this.baseConsumption / totalConsumption) * 100),
    }

    // Notify all subscribers
    this.subscribers.forEach((callback) => callback(data))
  }

  getDeviceStatus(current, base) {
    const ratio = current / base
    if (ratio > 1.5) return "Critical"
    if (ratio > 1.2) return "Warning"
    if (ratio < 0.5) return "Offline"
    return "Normal"
  }

  generateAlerts(devices) {
    const alerts = []
    const now = new Date()

    devices.forEach((device) => {
      if (device.status === "Critical") {
        alerts.push({
          id: `alert-${device.id}-${Date.now()}`,
          type: "error",
          title: `High Consumption Alert`,
          message: `${device.name} is consuming ${device.currentConsumption} kWh (${Math.round((device.currentConsumption / device.baseConsumption - 1) * 100)}% above normal)`,
          timestamp: now.toISOString(),
          deviceId: device.id,
        })
      } else if (device.status === "Offline") {
        alerts.push({
          id: `alert-${device.id}-${Date.now()}`,
          type: "warning",
          title: `Device Offline`,
          message: `${device.name} appears to be offline or consuming very low power`,
          timestamp: now.toISOString(),
          deviceId: device.id,
        })
      }
    })

    return alerts
  }

  generateForecast(currentConsumption) {
    const trend = (Math.random() - 0.5) * 0.1 // ±10% trend
    const nextHour = Math.round(currentConsumption * (1 + trend) * 100) / 100
    const nextDay = Math.round(currentConsumption * 24 * (1 + trend * 2) * 100) / 100
    const nextMonth = Math.round(nextDay * 30 * (1 + trend * 3) * 100) / 100

    return {
      nextHour,
      nextDay,
      nextMonth,
      trend: trend > 0 ? "increasing" : "decreasing",
      confidence: Math.round((0.8 + Math.random() * 0.2) * 100),
    }
  }

  // Generate historical data for charts
  generateHistoricalData(period = "week") {
    const data = []
    const now = new Date()
    let points, interval, format

    switch (period) {
      case "hour":
        points = 60
        interval = 1 // minutes
        format = (date) => date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
        break
      case "day":
        points = 24
        interval = 60 // minutes
        format = (date) => date.toLocaleTimeString("en-US", { hour: "2-digit" })
        break
      case "week":
        points = 7
        interval = 24 * 60 // minutes
        format = (date) => date.toLocaleDateString("en-US", { weekday: "short" })
        break
      case "month":
        points = 30
        interval = 24 * 60 // minutes
        format = (date) => date.toLocaleDateString("en-US", { day: "numeric" })
        break
      default:
        points = 7
        interval = 24 * 60
        format = (date) => date.toLocaleDateString("en-US", { weekday: "short" })
    }

    for (let i = points - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * interval * 60000)
      const hour = date.getHours()

      // Simulate realistic consumption patterns
      let baseValue = this.baseConsumption
      if (hour >= 6 && hour <= 8) baseValue *= 1.3
      else if (hour >= 9 && hour <= 17) baseValue *= 1.1
      else if (hour >= 18 && hour <= 20) baseValue *= 1.2
      else baseValue *= 0.7

      const variance = (Math.random() - 0.5) * 30
      const consumption = Math.max(50, baseValue + variance)

      data.push({
        time: format(date),
        consumption: Math.round(consumption * 100) / 100,
        timestamp: date.toISOString(),
      })
    }

    return data
  }
}

export const realTimeService = new RealTimeService()
