"use client"

import { Layout, Menu, Typography, Card, Row, Col, theme } from "antd"
import { CodeOutlined, FileTextOutlined, DatabaseOutlined, KeyOutlined } from "@ant-design/icons"
import Link from "next/link"
import { useState } from "react"

const { Header, Content, Sider } = Layout
const { Title, Text } = Typography

// 工具分类
const categories = [
  {
    key: "generator",
    icon: <KeyOutlined />,
    title: "生成工具",
    tools: [{ key: "uuid-generator", title: "UUID生成器", implemented: true }],
  },
  {
    key: "text",
    icon: <FileTextOutlined />,
    title: "文本工具",
    tools: [{ key: "case-converter", title: "大小写转换", implemented: true }],
  },
  {
    key: "encoding",
    icon: <CodeOutlined />,
    title: "编码转换",
    tools: [{ key: "base64", title: "Base64编解码", implemented: true }],
  },
  {
    key: "format",
    icon: <DatabaseOutlined />,
    title: "格式化工具",
    tools: [{ key: "json-formatter", title: "JSON格式化", implemented: true }],
  },
]

export default function Home() {
  const { token } = theme.useToken()
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          background: token.colorPrimary,
          padding: "0 24px",
        }}
      >
        <Title level={3} style={{ margin: 0, color: "white" }}>
          工具站
        </Title>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: token.colorBgContainer }} breakpoint="lg" collapsedWidth={0}>
          <Menu
            mode="inline"
            defaultSelectedKeys={["all"]}
            selectedKeys={[selectedCategory]}
            style={{ height: "100%", borderRight: 0 }}
            onSelect={({ key }) => setSelectedCategory(key)}
            items={[
              {
                key: "all",
                icon: <KeyOutlined />,
                label: "所有工具",
              },
              ...categories.map((category) => ({
                key: category.key,
                icon: category.icon,
                label: category.title,
              })),
            ]}
          />
        </Sider>
        <Layout style={{ padding: "0 24px 24px" }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              background: token.colorBgContainer,
              borderRadius: token.borderRadiusLG,
              marginTop: 16,
            }}
          >
            {selectedCategory !== "all" && (
              <Title level={4} style={{ marginBottom: 16 }}>
                {categories.find((c) => c.key === selectedCategory)?.title}
              </Title>
            )}

            <Row gutter={[16, 16]}>
              {categories
                .filter((category) => selectedCategory === "all" || category.key === selectedCategory)
                .flatMap((category) =>
                  category.tools.map((tool) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={`${category.key}-${tool.key}`}>
                      <Link href={`/tools/${category.key}/${tool.key}`} style={{ textDecoration: "none" }}>
                        <Card
                          hoverable
                          style={{
                            height: "100%",
                            borderColor: tool.implemented ? token.colorPrimary : undefined,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              textAlign: "center",
                            }}
                          >
                            <div style={{ fontSize: 24, marginBottom: 8 }}>{category.icon}</div>
                            <Title level={5} style={{ marginTop: 0, marginBottom: 4 }}>
                              {tool.title}
                            </Title>
                            <Text type="secondary">{category.title}</Text>
                            {!tool.implemented && (
                              <Text type="warning" style={{ marginTop: 8 }}>
                                开发中
                              </Text>
                            )}
                          </div>
                        </Card>
                      </Link>
                    </Col>
                  )),
                )}
            </Row>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}
