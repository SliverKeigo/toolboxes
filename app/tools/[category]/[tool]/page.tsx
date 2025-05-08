"use client"

import { useParams, useRouter } from "next/navigation"
import { Layout, Typography, Breadcrumb, Card, Button, Alert, Tooltip, theme } from "antd"
import Link from "next/link"
import { ArrowLeftOutlined, BulbOutlined, BulbFilled } from "@ant-design/icons"
import UuidGenerator from "@/components/tools/uuid-generator"
import CaseConverter from "@/components/tools/case-converter"
import Base64Encoder from "@/components/tools/base64-encoder"
import JsonFormatter from "@/components/tools/json-formatter"
import JsonToTypeScript from "@/components/tools/json-to-typescript"
import { useTheme } from "@/app/theme-config"
import Image from "next/image"

const { Content, Header } = Layout
const { Title } = Typography

// 工具分类映射表
const categoryMap = {
  text: "文本工具",
  encoding: "编码转换",
  format: "格式化工具",
  generator: "生成工具",
}

// 工具映射表
const toolMap = {
  "generator/uuid-generator": {
    title: "UUID生成器",
    component: UuidGenerator,
    implemented: true,
  },
  "text/case-converter": {
    title: "大小写转换",
    component: CaseConverter,
    implemented: true,
  },
  "encoding/base64": {
    title: "Base64编解码",
    component: Base64Encoder,
    implemented: true,
  },
  "format/json-formatter": {
    title: "JSON格式化",
    component: JsonFormatter,
    implemented: true,
  },
  "format/json-to-typescript": {
    title: "JSON转TypeScript类型",
    component: JsonToTypeScript,
    implemented: true,
  },
}

export default function ToolPage() {
  const params = useParams()
  const router = useRouter()
  const { token } = theme.useToken()
  const { isDarkMode, toggleTheme } = useTheme()
  const category = params.category as string
  const tool = params.tool as string

  const toolKey = `${category}/${tool}`
  const toolInfo = toolMap[toolKey as keyof typeof toolMap]

  if (!toolInfo) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: token.colorPrimary,
            padding: "0 24px",
          }}
        >
          <Title level={3} style={{ margin: 0, color: "white" }}>
            工具站
          </Title>
          <Tooltip title={isDarkMode ? "切换到亮色模式" : "切换到暗色模式"}>
            <Button
              type="text"
              icon={
                isDarkMode ? <BulbFilled style={{ color: "white" }} /> : <BulbOutlined style={{ color: "white" }} />
              }
              onClick={toggleTheme}
              style={{ color: "white" }}
            />
          </Tooltip>
        </Header>
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
  const categoryName = categoryMap[category as keyof typeof categoryMap ] || "未知分类"

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: token.colorPrimary,
          padding: "0 24px",
        }}
      >
        <Title level={3} style={{ margin: 0, color: "white", display: "flex", alignItems: "center", gap: "8px" }}>
          <Image src="/logo.svg" alt="工具箱" width={32} height={32} />
          <Link href="/" style={{ color: "white", textDecoration: "none" }}>
            工具站
          </Link>
        </Title>
        <Tooltip title={isDarkMode ? "切换到亮色模式" : "切换到暗色模式"}>
          <Button
            type="text"
            icon={isDarkMode ? <BulbFilled style={{ color: "white" }} /> : <BulbOutlined style={{ color: "white" }} />}
            onClick={toggleTheme}
            style={{ color: "white" }}
          />
        </Tooltip>
      </Header>
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
