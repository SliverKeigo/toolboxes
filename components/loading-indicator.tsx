"use client"

import { Spin } from "antd"
import { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export default function LoadingIndicator() {
  const [loading, setLoading] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // 创建一个路由变化的标记
    const url = pathname + searchParams.toString()

    // 路由开始变化时
    const handleRouteChangeStart = () => {
      setLoading(true)
    }

    // 路由变化完成时
    const handleRouteChangeComplete = () => {
      setLoading(false)
    }

    // 监听路由变化
    window.addEventListener("beforeunload", handleRouteChangeStart)

    // 使用URL变化来检测路由变化完成
    setLoading(false)

    return () => {
      window.removeEventListener("beforeunload", handleRouteChangeStart)
    }
  }, [pathname, searchParams])

  // 如果不在加载状态，不渲染任何内容
  if (!loading) return null

  // 加载状态的样式
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 9999,
      }}
    >
      <Spin size="large" tip="加载中..." />
    </div>
  )
}
