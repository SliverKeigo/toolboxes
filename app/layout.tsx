import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import type { Metadata } from "next"
import { AntdRegistry } from "@ant-design/nextjs-registry"
import { ThemeProvider } from "./theme-config"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "工具站 | 实用在线工具集合",
  description: "提供各种实用的在线工具，包括UUID生成器等",
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
          <ThemeProvider>{children}</ThemeProvider>
        </AntdRegistry>
      </body>
    </html>
  )
}
