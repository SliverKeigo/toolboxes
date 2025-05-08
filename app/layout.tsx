import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import type { Metadata } from "next"
import { AntdRegistry } from "@ant-design/nextjs-registry"
import { ThemeProvider } from "./theme-config"
import LoadingIndicator from "@/components/loading-indicator"
import Script from "next/script"
import { ConfigProvider } from "antd"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "工具站 | 实用在线工具集合",
  description: "提供各种实用的在线工具",
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
