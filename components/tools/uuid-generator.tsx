"use client"

import { useState, useEffect } from "react"
import { Button, Input, Space, Typography, Switch, InputNumber, Row, Col, Divider, message } from "antd"
import { CopyOutlined, ReloadOutlined } from "@ant-design/icons"

const { Title, Text } = Typography
const { TextArea } = Input

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([])
  const [count, setCount] = useState<number>(5)
  const [hyphen, setHyphen] = useState<boolean>(true)
  const [uppercase, setUppercase] = useState<boolean>(false)
  const [messageApi, contextHolder] = message.useMessage()

  // 生成UUID v4
  const generateUUID = (): string => {
    let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === "x" ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })

    if (!hyphen) {
      uuid = uuid.replace(/-/g, "")
    }

    if (uppercase) {
      uuid = uuid.toUpperCase()
    }

    return uuid
  }

  // 生成多个UUID
  const generateUUIDs = () => {
    const newUuids: string[] = []
    for (let i = 0; i < count; i++) {
      newUuids.push(generateUUID())
    }
    setUuids(newUuids)
  }

  // 复制到剪贴板
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        messageApi.success("已复制到剪贴板")
      },
      () => {
        messageApi.error("复制失败")
      },
    )
  }

  // 复制所有UUID
  const copyAllUUIDs = () => {
    const text = uuids.join("\n")
    navigator.clipboard.writeText(text).then(
      () => {
        messageApi.success("已复制所有UUID到剪贴板")
      },
      () => {
        messageApi.error("复制失败")
      },
    )
  }

  // 初始化生成UUID
  useEffect(() => {
    generateUUIDs()
  }, [])

  // 当选项改变时重新生成
  useEffect(() => {
    if (uuids.length > 0) {
      generateUUIDs()
    }
  }, [hyphen, uppercase])

  return (
    <div>
      {contextHolder}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Title level={4}>选项</Title>
            <Row gutter={16} align="middle">
              <Col xs={24} sm={8} md={6} lg={4}>
                <Text>生成数量:</Text>
              </Col>
              <Col xs={24} sm={16} md={18} lg={20}>
                <InputNumber
                  min={1}
                  max={100}
                  value={count}
                  onChange={(value) => setCount(value || 1)}
                  style={{ width: 120 }}
                />
              </Col>
            </Row>
            <Row gutter={16} align="middle">
              <Col xs={24} sm={8} md={6} lg={4}>
                <Text>包含连字符:</Text>
              </Col>
              <Col xs={24} sm={16} md={18} lg={20}>
                <Switch checked={hyphen} onChange={setHyphen} />
              </Col>
            </Row>
            <Row gutter={16} align="middle">
              <Col xs={24} sm={8} md={6} lg={4}>
                <Text>大写字母:</Text>
              </Col>
              <Col xs={24} sm={16} md={18} lg={20}>
                <Switch checked={uppercase} onChange={setUppercase} />
              </Col>
            </Row>
            <Button type="primary" icon={<ReloadOutlined />} onClick={generateUUIDs}>
              重新生成
            </Button>
          </Space>
        </Col>

        <Col span={24}>
          <Divider />
          <Space direction="vertical" style={{ width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Title level={4}>生成结果</Title>
              <Button type="primary" icon={<CopyOutlined />} onClick={copyAllUUIDs}>
                复制全部
              </Button>
            </div>
            <div style={{ marginTop: 16 }}>
              {uuids.map((uuid, index) => (
                <div key={index} style={{ marginBottom: 8, display: "flex", alignItems: "center" }}>
                  <Input value={uuid} readOnly style={{ marginRight: 8 }} />
                  <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(uuid)} type="text" />
                </div>
              ))}
            </div>
          </Space>
        </Col>
      </Row>
    </div>
  )
}