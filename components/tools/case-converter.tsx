"use client"

import { useState } from "react"
import { Button, Input, Space, Typography, Radio, Row, Col, Divider, message } from "antd"
import { CopyOutlined, SwapOutlined } from "@ant-design/icons"

const { Title, Text } = Typography
const { TextArea } = Input

type CaseType = "upper" | "lower" | "title" | "sentence" | "camel" | "pascal" | "snake" | "kebab"

export default function CaseConverter() {
  const [inputText, setInputText] = useState<string>("")
  const [outputText, setOutputText] = useState<string>("")
  const [caseType, setCaseType] = useState<CaseType>("upper")
  const [messageApi, contextHolder] = message.useMessage()

  // 转换文本大小写
  const convertCase = () => {
    if (!inputText.trim()) {
      messageApi.warning("请输入需要转换的文本")
      return
    }

    let result = ""
    switch (caseType) {
      case "upper":
        result = inputText.toUpperCase()
        break
      case "lower":
        result = inputText.toLowerCase()
        break
      case "title":
        result = inputText
          .toLowerCase()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
        break
      case "sentence":
        result = inputText.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase())
        break
      case "camel":
        result = inputText
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
          .replace(/^[A-Z]/, (c) => c.toLowerCase())
        break
      case "pascal":
        result = inputText
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
          .replace(/^[a-z]/, (c) => c.toUpperCase())
        break
      case "snake":
        result = inputText
          .toLowerCase()
          .replace(/\s+/g, "_")
          .replace(/[^a-zA-Z0-9_]/g, "")
        break
      case "kebab":
        result = inputText
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-zA-Z0-9-]/g, "")
        break
      default:
        result = inputText
    }

    setOutputText(result)
  }

  // 复制到剪贴板
  const copyToClipboard = () => {
    if (!outputText) {
      messageApi.warning("没有可复制的内容")
      return
    }

    navigator.clipboard.writeText(outputText).then(
      () => {
        messageApi.success("已复制到剪贴板")
      },
      () => {
        messageApi.error("复制失败")
      },
    )
  }

  // 交换输入和输出
  const swapTexts = () => {
    const temp = inputText
    setInputText(outputText)
    setOutputText(temp)
  }

  return (
    <div>
      {contextHolder}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Title level={4}>输入文本</Title>
            <TextArea
              rows={6}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="请输入需要转换的文本..."
            />
          </Space>
        </Col>

        <Col span={24}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Title level={4}>转换选项</Title>
            <Radio.Group value={caseType} onChange={(e) => setCaseType(e.target.value)}>
              <Radio.Button value="upper">大写</Radio.Button>
              <Radio.Button value="lower">小写</Radio.Button>
              <Radio.Button value="title">标题格式</Radio.Button>
              <Radio.Button value="sentence">句子格式</Radio.Button>
              <Radio.Button value="camel">驼峰格式</Radio.Button>
              <Radio.Button value="pascal">帕斯卡格式</Radio.Button>
              <Radio.Button value="snake">蛇形格式</Radio.Button>
              <Radio.Button value="kebab">短横线格式</Radio.Button>
            </Radio.Group>
          </Space>
        </Col>

        <Col span={24}>
          <Space>
            <Button type="primary" onClick={convertCase}>
              转换
            </Button>
            <Button icon={<SwapOutlined />} onClick={swapTexts}>
              交换输入输出
            </Button>
          </Space>
        </Col>

        <Col span={24}>
          <Divider />
          <Space direction="vertical" style={{ width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Title level={4}>转换结果</Title>
              <Button type="primary" icon={<CopyOutlined />} onClick={copyToClipboard}>
                复制结果
              </Button>
            </div>
            <TextArea rows={6} value={outputText} readOnly />
          </Space>
        </Col>

        <Col span={24}>
          <Divider />
          <Title level={4}>格式说明</Title>
          <ul style={{ paddingLeft: "20px" }}>
            <li>
              <Text strong>大写：</Text>
              <Text>将所有字母转换为大写。例如：HELLO WORLD</Text>
            </li>
            <li>
              <Text strong>小写：</Text>
              <Text>将所有字母转换为小写。例如：hello world</Text>
            </li>
            <li>
              <Text strong>标题格式：</Text>
              <Text>每个单词的首字母大写。例如：Hello World</Text>
            </li>
            <li>
              <Text strong>句子格式：</Text>
              <Text>每个句子的首字母大写。例如：Hello world. This is a sentence.</Text>
            </li>
            <li>
              <Text strong>驼峰格式：</Text>
              <Text>第一个单词小写，后续单词首字母大写，无空格。例如：helloWorld</Text>
            </li>
            <li>
              <Text strong>帕斯卡格式：</Text>
              <Text>每个单词首字母大写，无空格。例如：HelloWorld</Text>
            </li>
            <li>
              <Text strong>蛇形格式：</Text>
              <Text>所有字母小写，单词间用下划线连接。例如：hello_world</Text>
            </li>
            <li>
              <Text strong>短横线格式：</Text>
              <Text>所有字母小写，单词间用短横线连接。例如：hello-world</Text>
            </li>
          </ul>
        </Col>
      </Row>
    </div>
  )
}
