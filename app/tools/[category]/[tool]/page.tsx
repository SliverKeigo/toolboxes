"use client"

import { useParams, useRouter } from "next/navigation"
import { Layout, Typography, Breadcrumb, Card, Button, Alert } from "antd"
import Link from "next/link"
import { ArrowLeftOutlined } from "@ant-design/icons"
import UuidGenerator from "@/components/tools/uuid-generator"
import { ToolProps } from "@/components/tools/tool-interface"

const { Content } = Layout
const { Title } = Typography

// 工具分类映射表
const categoryMap = {
  text: "文本工具",
  encoding: "编码转换",
  format: "格式化工具",
  generator: "生成工具",
}

// 工具映射表
const toolMap: Record<string, ToolProps> = {
  "generator/uuid-generator": {
    title: "UUID生成器",
    component: UuidGenerator,
    implemented: true,
  },
  "text/case-converter": {
    title: "大小写转换",
    component: null,
    implemented: false,
  },
  "encoding/base64": {
    title: "Base64编解码",
    component: null,
    implemented: false,
  },
  "format/json-formatter": {
    title: "JSON格式化",
    component: null,
    implemented: false,
  },
}

export default function ToolPage() {
  const params = useParams()
  const router = useRouter()
  const category = params.category as string
  const tool = params.tool as string

  const toolKey = `${category}/${tool}`
  const toolInfo = toolMap[toolKey]

  if (!toolInfo) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Content style={{ padding: "0 50px", marginTop: 24 }}>
          <Alert
            message="工具不存在"
            description="您访问的工具不存在或正在开发中"
            type="error"
            showIcon
            action={
              <Button size="small" type="primary" onClick={() => router.push("/")}>
                返回首页
              </Button>
            }
          />
        </Content>
      </Layout>
    )
  }

  const ToolComponent = toolInfo.component
  const categoryName = categoryMap[category as keyof typeof categoryMap] || "未知分类"

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "0 50px", marginTop: 24 }}>
        <Breadcrumb
          items={[{ title: <Link href="/">首页</Link> }, { title: categoryName }, { title: toolInfo.title }]}
          style={{ margin: "16px 0" }}
        />
        <div style={{ display: "flex", marginBottom: 16 }}>
          <Link href="/">
            <Button icon={<ArrowLeftOutlined />}>返回首页</Button>
          </Link>
        </div>
        <Card>
          <Title level={2}>{toolInfo.title}</Title>

          {!toolInfo.implemented && (
            <Alert
              message="开发中"
              description="此工具正在开发中，敬请期待"
              type="warning"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}

          {toolInfo.implemented && ToolComponent && <ToolComponent />}
        </Card>
      </Content>
    </Layout>
  )
}