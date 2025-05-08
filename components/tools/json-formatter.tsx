"use client"

import { useState } from "react"
import { Button, Input, Space, Typography, Radio, Row, Col, Divider, message, Alert } from "antd"
import { CopyOutlined, FormatPainterOutlined, CompressOutlined } from "@ant-design/icons"

const { Title, Text } = Typography
const { TextArea } = Input

type FormatMode = "pretty" | "compact"

export default function JsonFormatter() {
  const [inputJson, setInputJson] = useState<string>("")
  const [outputJson, setOutputJson] = useState<string>("")
  const [mode, setMode] = useState<FormatMode>("pretty")
  const [indentSize, setIndentSize] = useState<number>(2)
  const [error, setError] = useState<string | null>(null)
  const [messageApi, contextHolder] = message.useMessage()

  // 格式化JSON
  const formatJson = () => {
    setError(null)

    if (!inputJson.trim()) {
      messageApi.warning("请输入需要格式化的JSON")
      return
    }

    try {
      // 解析JSON以验证其有效性
      const parsedJson = JSON.parse(inputJson)

      // 根据模式格式化
      if (mode === "pretty") {
        setOutputJson(JSON.stringify(parsedJson, null, indentSize))
      } else {
        setOutputJson(JSON.stringify(parsedJson))
      }
    } catch (e) {
      setError(`JSON解析错误: ${e instanceof Error ? e.message : String(e)}`)
    }
  }

  // 复制到剪贴板
  const copyToClipboard = () => {
    if (!outputJson) {
      messageApi.warning("没有可复制的内容")
      return
    }

    navigator.clipboard.writeText(outputJson).then(
      () => {
        messageApi.success("已复制到剪贴板")
      },
      () => {
        messageApi.error("复制失败")
      },
    )
  }

  // 修复常见的JSON错误
  const fixJson = () => {
    if (!inputJson.trim()) {
      messageApi.warning("请输入需要修复的JSON")
      return
    }

    try {
      // 尝试修复一些常见错误
      const fixedJson = inputJson
        // 替换单引号为双引号
        .replace(/'/g, '"')
        // 给没有引号的键名添加双引号
        .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3')
        // 移除尾部逗号
        .replace(/,\s*([}\]])/g, "$1")
        // 修复布尔值和null
        .replace(/:(\s*)(True|False)/g, (match, p1, p2) => `:${p1}${p2.toLowerCase()}`)
        .replace(/:(\s*)None/g, `:${1}null`)

      // 验证修复后的JSON
      JSON.parse(fixedJson)

      setInputJson(fixedJson)
      setError(null)
      messageApi.success("JSON已修复")
    } catch (e) {
      setError(`无法自动修复JSON: ${e instanceof Error ? e.message : String(e)}`)
    }
  }

  // 生成示例JSON
  const generateExample = () => {
    const example = {
      name: "JSON格式化工具",
      version: "1.0.0",
      features: ["格式化", "压缩", "验证"],
      settings: {
        indentSize: 2,
        colorize: true,
        autoFix: false,
      },
      stats: {
        usageCount: 1024,
        rating: 4.8,
      },
      isActive: true,
    }

    setInputJson(JSON.stringify(example))
    setError(null)
  }

  return (
    <div>
      {contextHolder}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Title level={4}>输入JSON</Title>
            <TextArea
              rows={8}
              value={inputJson}
              onChange={(e) => setInputJson(e.target.value)}
              placeholder="请输入需要格式化的JSON..."
            />
            <Space>
              <Button onClick={generateExample}>生成示例</Button>
              <Button type="primary" onClick={fixJson} icon={<FormatPainterOutlined />}>
                尝试修复
              </Button>
            </Space>
          </Space>
        </Col>

        <Col span={24}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Title level={4}>格式化选项</Title>
            <Space>
              <Radio.Group value={mode} onChange={(e) => setMode(e.target.value)}>
                <Radio.Button value="pretty">
                  美化
                </Radio.Button>
                <Radio.Button value="compact">
                  压缩
                </Radio.Button>
              </Radio.Group>

              {mode === "pretty" && (
                <Radio.Group value={indentSize} onChange={(e) => setIndentSize(e.target.value)} optionType="button">
                  <Radio.Button value={2}>缩进2空格</Radio.Button>
                  <Radio.Button value={4}>缩进4空格</Radio.Button>
                </Radio.Group>
              )}
            </Space>
          </Space>
        </Col>

        <Col span={24}>
          <Button type="primary" onClick={formatJson}>
            格式化JSON
          </Button>
        </Col>

        {error && (
          <Col span={24}>
            <Alert message="错误" description={error} type="error" showIcon closable />
          </Col>
        )}

        <Col span={24}>
          <Divider />
          <Space direction="vertical" style={{ width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Title level={4}>格式化结果</Title>
              <Button type="primary" icon={<CopyOutlined />} onClick={copyToClipboard}>
                复制结果
              </Button>
            </div>
            <TextArea rows={8} value={outputJson} readOnly placeholder="格式化后的JSON将显示在这里" />
          </Space>
        </Col>

        <Col span={24}>
          <Divider />
          <Title level={4}>JSON格式化说明</Title>
          <ul style={{ paddingLeft: "20px" }}>
            <li>
              <Text strong>美化：</Text>
              <Text>将JSON格式化为易读的格式，带有缩进和换行</Text>
            </li>
            <li>
              <Text strong>压缩：</Text>
              <Text>移除所有空格和换行，生成最小体积的JSON</Text>
            </li>
            <li>
              <Text strong>修复：</Text>
              <Text>尝试修复常见的JSON错误，如单引号、缺少引号的键名、尾部逗号等</Text>
            </li>
          </ul>
        </Col>
      </Row>
    </div>
  )
}
