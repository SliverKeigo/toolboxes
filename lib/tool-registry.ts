import type React from "react"
// 工具注册表，用于集中管理所有工具
import type { ReactNode } from "react"
import UuidGenerator from "@/components/tools/uuid-generator"
import CaseConverter from "@/components/tools/case-converter"
import Base64Encoder from "@/components/tools/base64-encoder"
import JsonFormatter from "@/components/tools/json-formatter"
import JsonToTypeScript from "@/components/tools/json-to-typescript"
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
  "case-converter": {
    key: "case-converter",
    category: "text",
    title: "大小写转换",
    description: "转换文本大小写和格式",
    component: CaseConverter,
    implemented: true,
  },
  base64: {
    key: "base64",
    category: "encoding",
    title: "Base64编解码",
    description: "编码和解码Base64格式",
    component: Base64Encoder,
    implemented: true,
  },
  "json-formatter": {
    key: "json-formatter",
    category: "format",
    title: "JSON格式化",
    description: "格式化和验证JSON数据",
    component: JsonFormatter,
    implemented: true,
  },
  "json-to-typescript": {
    key: "json-to-typescript",
    category: "format",
    title: "JSON转TypeScript类型",
    description: "将JSON数据转换为TypeScript类型",
    component: JsonToTypeScript,
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
