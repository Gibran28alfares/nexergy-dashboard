import { configureStore, createSlice } from "@reduxjs/toolkit"

// Initial state
const initialState = {
  view: "dashboard",
  timeFilter: "week",
  location: "all",
  realTimeData: {
    currentConsumption: 0,
    totalDevices: 0,
    activeAlerts: 0,
    lastUpdate: new Date().toISOString(),
  },
  notifications: [],
  isRealTimeEnabled: true,
}

// Main slice
const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setView: (state, action) => {
      state.view = action.payload
    },
    setTimeFilter: (state, action) => {
      state.timeFilter = action.payload
    },
    setLocation: (state, action) => {
      state.location = action.payload
    },
    updateRealTimeData: (state, action) => {
      state.realTimeData = { ...state.realTimeData, ...action.payload }
      state.realTimeData.lastUpdate = new Date().toISOString()
    },
    addNotification: (state, action) => {
      state.notifications.unshift({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      })
      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50)
      }
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload)
    },
    toggleRealTime: (state) => {
      state.isRealTimeEnabled = !state.isRealTimeEnabled
    },
  },
})

export const {
  setView,
  setTimeFilter,
  setLocation,
  updateRealTimeData,
  addNotification,
  removeNotification,
  toggleRealTime,
} = appSlice.actions

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
  },
})
