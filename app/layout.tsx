import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import type { Metadata } from "next"
import { AntdRegistry } from "@ant-design/nextjs-registry"
import { ThemeProvider } from "./theme-config"
import { ConfigProvider } from "antd"

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
              {children}
            </ConfigProvider>
          </ThemeProvider>
        </AntdRegistry>
      </body>
    </html>
  )
}
