"use client"

import { useState } from "react"
import { Button, Input, Space, Typography, Radio, Row, Col, Divider, message, Upload, Alert } from "antd"
import { CopyOutlined, SwapOutlined, UploadOutlined } from "@ant-design/icons"
import type { UploadFile } from "antd"

const { Title, Text } = Typography
const { TextArea } = Input

type ConversionMode = "encode" | "decode"
type InputType = "text" | "file"

export default function Base64Encoder() {
  const [inputText, setInputText] = useState<string>("")
  const [outputText, setOutputText] = useState<string>("")
  const [mode, setMode] = useState<ConversionMode>("encode")
  const [inputType, setInputType] = useState<InputType>("text")
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [messageApi, contextHolder] = message.useMessage()
  const [error, setError] = useState<string | null>(null)

  // 编码/解码文本
  const convertText = () => {
    setError(null)

    if (inputType === "text") {
      if (!inputText.trim()) {
        messageApi.warning("请输入需要转换的文本")
        return
      }

      try {
        if (mode === "encode") {
          // 编码为Base64
          const encoded = btoa(unescape(encodeURIComponent(inputText)))
          setOutputText(encoded)
        } else {
          // 从Base64解码
          const decoded = decodeURIComponent(escape(atob(inputText.trim())))
          setOutputText(decoded)
        }
      } catch (e) {
        setError(`转换失败: ${e instanceof Error ? e.message : String(e)}`)
      }
    }
  }

  // 处理文件上传
  const handleFileUpload = (info: any) => {
    setError(null)
    const file = info.file.originFileObj

    if (!file) return

    const reader = new FileReader()

    if (mode === "encode") {
      reader.onload = (e) => {
        if (e.target?.result) {
          const base64String = (e.target.result as string).split(",")[1]
          setOutputText(base64String)
        }
      }
      reader.readAsDataURL(file)
    } else {
      reader.onload = (e) => {
        if (e.target?.result) {
          try {
            const text = e.target.result as string
            const decoded = decodeURIComponent(escape(atob(text.trim())))
            setOutputText(decoded)
          } catch (e) {
            setError(`解码失败: ${e instanceof Error ? e.message : String(e)}`)
          }
        }
      }
      reader.readAsText(file)
    }

    setFileList([info.file])
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
    if (inputType !== "text") {
      messageApi.warning("文件模式下无法交换")
      return
    }

    const temp = inputText
    setInputText(outputText)
    setOutputText(temp)
    setMode(mode === "encode" ? "decode" : "encode")
  }

  // 下载Base64为文件
  const downloadBase64 = () => {
    if (!outputText) {
      messageApi.warning("没有可下载的内容")
      return
    }

    try {
      const link = document.createElement("a")

      if (mode === "encode") {
        // 下载Base64编码的文本
        const blob = new Blob([outputText], { type: "text/plain" })
        link.href = URL.createObjectURL(blob)
        link.download = "encoded_base64.txt"
      } else {
        // 下载解码后的文件
        link.href = "data:application/octet-stream;base64," + inputText
        link.download = "decoded_file"
      }

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (e) {
      setError(`下载失败: ${e instanceof Error ? e.message : String(e)}`)
    }
  }

  return (
    <div>
      {contextHolder}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Title level={4}>转换模式</Title>
            <Radio.Group value={mode} onChange={(e) => setMode(e.target.value)}>
              <Radio.Button value="encode">编码为Base64</Radio.Button>
              <Radio.Button value="decode">从Base64解码</Radio.Button>
            </Radio.Group>
          </Space>
        </Col>

        <Col span={24}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Title level={4}>输入类型</Title>
            <Radio.Group value={inputType} onChange={(e) => setInputType(e.target.value)}>
              <Radio.Button value="text">文本</Radio.Button>
              <Radio.Button value="file">文件</Radio.Button>
            </Radio.Group>
          </Space>
        </Col>

        <Col span={24}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Title level={4}>输入{inputType === "text" ? "文本" : "文件"}</Title>

            {inputType === "text" ? (
              <TextArea
                rows={6}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={mode === "encode" ? "请输入需要编码的文本..." : "请输入需要解码的Base64..."}
              />
            ) : (
              <Upload fileList={fileList} beforeUpload={() => false} onChange={handleFileUpload} maxCount={1}>
                <Button icon={<UploadOutlined />}>选择文件</Button>
              </Upload>
            )}
          </Space>
        </Col>

        <Col span={24}>
          <Space>
            {inputType === "text" && (
              <Button type="primary" onClick={convertText}>
                {mode === "encode" ? "编码" : "解码"}
              </Button>
            )}
            {inputType === "text" && (
              <Button icon={<SwapOutlined />} onClick={swapTexts}>
                交换并切换模式
              </Button>
            )}
            <Button type="primary" onClick={downloadBase64}>
              下载{mode === "encode" ? "编码" : "解码"}结果
            </Button>
          </Space>
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
              <Title level={4}>转换结果</Title>
              <Button type="primary" icon={<CopyOutlined />} onClick={copyToClipboard}>
                复制结果
              </Button>
            </div>
            <TextArea
              rows={6}
              value={outputText}
              readOnly
              placeholder={mode === "encode" ? "Base64编码结果将显示在这里" : "解码结果将显示在这里"}
            />
          </Space>
        </Col>

        <Col span={24}>
          <Divider />
          <Title level={4}>Base64说明</Title>
          <Text>
            Base64是一种基于64个可打印字符来表示二进制数据的表示方法。常用于在处理文本数据的场合，
            表示、传输、存储一些二进制数据，包括MIME的电子邮件及XML的一些复杂数据。
          </Text>
          <ul style={{ paddingLeft: "20px", marginTop: "10px" }}>
            <li>
              <Text strong>编码：</Text>
              <Text>将普通文本或二进制数据转换为Base64格式</Text>
            </li>
            <li>
              <Text strong>解码：</Text>
              <Text>将Base64格式的数据转换回原始文本或二进制数据</Text>
            </li>
          </ul>
        </Col>
      </Row>
    </div>
  )
}
