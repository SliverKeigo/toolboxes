"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { ConfigProvider, theme as antTheme } from "antd"

// 自定义主题颜色
export const themeColors = {
  primary: "#6366f1", // 靛青色/靛蓝色
  success: "#10b981", // 翡翠绿
  warning: "#f59e0b", // 琥珀色
  error: "#ef4444", // 红色
  info: "#3b82f6", // 蓝色
}

// 创建主题上下文
type ThemeContextType = {
  isDarkMode: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
})

export const useTheme = () => useContext(ThemeContext)

// 主题提供者组件
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false)

  // 检查系统偏好
  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    setIsDarkMode(prefersDark)
  }, [])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const theme = {
    token: {
      colorPrimary: themeColors.primary,
      colorSuccess: themeColors.success,
      colorWarning: themeColors.warning,
      colorError: themeColors.error,
      colorInfo: themeColors.info,
      borderRadius: 6,
    },
    algorithm: isDarkMode ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <ConfigProvider theme={theme}>{children}</ConfigProvider>
    </ThemeContext.Provider>
  )
}
