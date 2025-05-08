import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import type { Metadata } from "next"
import { AntdRegistry } from "@ant-design/nextjs-registry"
import { ThemeProvider } from "./theme-config"
import { ConfigProvider } from "antd"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "在线工具箱",
  description: "一个现代化的在线工具箱网站，提供各种实用的开发工具",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

// 预加载所有工具组件
const preloadComponents = () => {
  const components = [
    () => import("@/components/tools/uuid-generator"),
    () => import("@/components/tools/case-converter"),
    () => import("@/components/tools/base64-encoder"),
    () => import("@/components/tools/json-formatter"),
    () => import("@/components/tools/json-to-typescript"),
  ]
  
  components.forEach(component => {
    component()
  })
}

// 在客户端预加载组件
if (typeof window !== 'undefined') {
  preloadComponents()
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <AntdRegistry>
          <ThemeProvider>
            <ConfigProvider>
              <Suspense fallback={
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100vh',
                  background: '#f0f2f5'
                }}>
                  <div style={{
                    textAlign: 'center',
                    padding: '20px',
                    borderRadius: '8px',
                    background: 'white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ fontSize: '24px', marginBottom: '16px' }}>加载中...</div>
                    <div style={{ color: '#666' }}>正在准备您的工具箱</div>
                  </div>
                </div>
              }>
                {children}
              </Suspense>
            </ConfigProvider>
          </ThemeProvider>
        </AntdRegistry>
      </body>
    </html>
  )
}
