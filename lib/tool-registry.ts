import type React from "react"
// 工具注册表，用于集中管理所有工具
import type { ReactNode } from "react"
import UuidGenerator from "@/components/tools/uuid-generator"

export interface ToolInfo {
  key: string
  category: string
  title: string
  description?: string
  icon?: ReactNode
  component: React.ComponentType<any> | null
  implemented: boolean
}

// 这个注册表可以在后续扩展时使用，目前简单实现
export const toolRegistry: Record<string, ToolInfo> = {
  "uuid-generator": {
    key: "uuid-generator",
    category: "generator",
    title: "UUID生成器",
    description: "生成随机的UUID标识符",
    component: UuidGenerator,
    implemented: true,
  },
}

export function getToolByKey(category: string, key: string): ToolInfo | undefined {
  const fullKey = `${category}/${key}`
  return Object.values(toolRegistry).find((tool) => `${tool.category}/${tool.key}` === fullKey)
}

export function getToolsByCategory(category: string): ToolInfo[] {
  return Object.values(toolRegistry).filter((tool) => tool.category === category)
}

export function getAllTools(): ToolInfo[] {
  return Object.values(toolRegistry)
}