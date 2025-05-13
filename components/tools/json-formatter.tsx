"use client"

import { useState } from "react"
import { Button, Input, Textarea, Card, CardBody, CardHeader, CardFooter, RadioGroup, Radio, Divider } from "@heroui/react"

type FormatMode = "pretty" | "compact"

export default function JsonFormatter() {
  const [inputJson, setInputJson] = useState<string>("")
  const [outputJson, setOutputJson] = useState<string>("")
  const [mode, setMode] = useState<FormatMode>("pretty")
  const [indentSize, setIndentSize] = useState<number>(2)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string>("")

  // 格式化JSON
  const formatJson = () => {
    setError(null)

    if (!inputJson.trim()) {
      setError("请输入需要格式化的JSON")
      setTimeout(() => setError(null), 3000)
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
      setError("没有可复制的内容")
      setTimeout(() => setError(null), 3000)
      return
    }

    navigator.clipboard.writeText(outputJson).then(
      () => {
        setSuccessMessage("已复制到剪贴板")
        setTimeout(() => setSuccessMessage(""), 3000)
      },
      () => {
        setError("复制失败")
        setTimeout(() => setError(null), 3000)
      },
    )
  }

  // 修复常见的JSON错误
  const fixJson = () => {
    if (!inputJson.trim()) {
      setError("请输入需要修复的JSON")
      setTimeout(() => setError(null), 3000)
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
      setSuccessMessage("JSON已修复")
      setTimeout(() => setSuccessMessage(""), 3000)
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
    <div className="flex flex-col gap-6 w-full">
      {successMessage && (
        <div className="bg-success-100 text-success-500 p-2 rounded-md">{successMessage}</div>
      )}
      {error && (
        <div className="bg-danger-100 text-danger-500 p-2 rounded-md">{error}</div>
      )}

      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium">输入JSON</h3>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <Textarea
            minRows={8}
            value={inputJson}
            onChange={(e) => setInputJson(e.target.value)}
            placeholder="请输入需要格式化的JSON..."
          />
          <div className="flex gap-2">
            <Button onClick={generateExample} variant="flat">
              生成示例
            </Button>
            <Button color="primary" onClick={fixJson}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              尝试修复
            </Button>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium">格式化选项</h3>
        </CardHeader>
        <CardBody>
          <div className="flex flex-wrap gap-4">
            <div>
              <h4 className="text-medium font-medium mb-2">格式</h4>
              <RadioGroup 
                orientation="horizontal" 
                value={mode}
                onValueChange={(value) => setMode(value as FormatMode)}
              >
                <Radio value="pretty">美化</Radio>
                <Radio value="compact">压缩</Radio>
              </RadioGroup>
            </div>

            {mode === "pretty" && (
              <div>
                <h4 className="text-medium font-medium mb-2">缩进大小</h4>
                <RadioGroup 
                  orientation="horizontal" 
                  value={indentSize.toString()}
                  onValueChange={(value) => setIndentSize(parseInt(value))}
                >
                  <Radio value="2">缩进2空格</Radio>
                  <Radio value="4">缩进4空格</Radio>
                </RadioGroup>
              </div>
            )}
          </div>
          
          <div className="mt-4">
            <Button color="primary" onClick={formatJson}>
              格式化JSON
            </Button>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="flex justify-between items-center">
          <h3 className="text-lg font-medium">格式化结果</h3>
          <Button 
            color="primary" 
            variant="flat" 
            onClick={copyToClipboard}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            复制结果
          </Button>
        </CardHeader>
        <CardBody>
          <Textarea 
            minRows={8} 
            value={outputJson} 
            isReadOnly 
            placeholder="格式化后的JSON将显示在这里" 
          />
        </CardBody>
      </Card>
      
      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium">JSON格式化说明</h3>
        </CardHeader>
        <CardBody>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <span className="font-semibold">美化：</span>
              <span>将JSON格式化为易读的格式，带有缩进和换行</span>
            </li>
            <li>
              <span className="font-semibold">压缩：</span>
              <span>移除所有空格和换行，生成最小体积的JSON</span>
            </li>
            <li>
              <span className="font-semibold">修复：</span>
              <span>尝试修复常见的JSON错误，如单引号、缺少引号的键名、尾部逗号等</span>
            </li>
          </ul>
        </CardBody>
      </Card>
    </div>
  )
}
