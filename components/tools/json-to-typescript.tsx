"use client"

import { useState } from "react"
import { Card, Input, Button, Space, message, Typography } from "antd"
import { CopyOutlined } from "@ant-design/icons"

const { TextArea } = Input
const { Title } = Typography

function convertToTypeStructure(obj: any): any {
  if (obj === null) return "null"
  
  if (typeof obj !== 'object') {
    return typeof obj
  }
  
  if (Array.isArray(obj)) {
    if (obj.length === 0) return "array"
    return [convertToTypeStructure(obj[0])]
  }
  
  const result: Record<string, any> = {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = convertToTypeStructure(obj[key])
    }
  }
  
  return result
}

function normalizeTypeName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9]/g, ' ')
    .split(' ')
    .map((word, index) => {
      if (index === 0) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join('')
}

function inferType(value: any): string {
  if (value === null) return 'null'
  if (typeof value === 'string') {
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
      return 'Date'
    }
    if (value.startsWith('http://') || value.startsWith('https://')) {
      return 'string'
    }
    return 'string'
  }
  if (typeof value === 'number') {
    if (Number.isInteger(value)) return 'number'
    return 'number'
  }
  if (typeof value === 'boolean') return 'boolean'
  if (Array.isArray(value)) {
    if (value.length === 0) return 'any[]'
    return `${inferType(value[0])}[]`
  }
  if (typeof value === 'object') return 'object'
  return 'any'
}

function generateTypeDefinition(typeStruct: any, rootName = 'Root'): string {
  const typeMap = new Map()
  const visited = new Set()
  
  function processType(obj: any, typeName: string) {
    if (visited.has(typeName)) return
    visited.add(typeName)
    
    let typeDef = `export interface ${typeName} {\n`
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key]
        const pascalCaseKey = normalizeTypeName(key)
        
        if (typeof value === 'string') {
          const inferredType = inferType(value)
          typeDef += `  ${key}: ${inferredType};\n`
        } else if (Array.isArray(value)) {
          if (typeof value[0] === 'string') {
            const inferredType = inferType(value[0])
            typeDef += `  ${key}: ${inferredType}[];\n`
          } else {
            const arrayTypeName = `${pascalCaseKey}Item`
            typeMap.set(arrayTypeName, value[0])
            processType(value[0], arrayTypeName)
            typeDef += `  ${key}: ${arrayTypeName}[];\n`
          }
        } else if (typeof value === 'object') {
          const nestedTypeName = pascalCaseKey
          typeMap.set(nestedTypeName, value)
          processType(value, nestedTypeName)
          typeDef += `  ${key}: ${nestedTypeName};\n`
        }
      }
    }
    
    typeDef += '}\n\n'
    typeMap.set(typeName, typeDef)
  }
  
  processType(typeStruct, normalizeTypeName(rootName))
  
  let result = ''
  const sortedTypes = Array.from(typeMap.keys()).sort()
  for (const type of sortedTypes) {
    if (typeof typeMap.get(type) === 'string') {
      result += typeMap.get(type)
    }
  }
  
  return result
}

function jsonToTypeScript(jsonObj: any, rootName = 'Root'): string {
  try {
    const typeStruct = convertToTypeStructure(jsonObj)
    return generateTypeDefinition(typeStruct, rootName)
  } catch (error) {
    throw new Error('JSON 解析失败：' + (error as Error).message)
  }
}

export default function JsonToTypeScript() {
  const [jsonInput, setJsonInput] = useState("")
  const [typeOutput, setTypeOutput] = useState("")
  const [rootName, setRootName] = useState("Root")

  const handleConvert = () => {
    try {
      const jsonObj = JSON.parse(jsonInput)
      const result = jsonToTypeScript(jsonObj, rootName)
      setTypeOutput(result)
    } catch (error) {
      message.error('JSON 格式错误，请检查输入')
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(typeOutput)
    message.success('已复制到剪贴板')
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Card>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <div>
            <Title level={5}>根类型名称</Title>
            <Input
              value={rootName}
              onChange={(e) => setRootName(e.target.value)}
              placeholder="输入根类型名称"
              style={{ width: 200 }}
            />
          </div>
          <div>
            <Title level={5}>JSON 输入</Title>
            <TextArea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="请输入 JSON 数据"
              autoSize={{ minRows: 6, maxRows: 12 }}
            />
          </div>
          <Button type="primary" onClick={handleConvert}>
            转换为 TypeScript 类型
          </Button>
        </Space>
      </Card>

      {typeOutput && (
        <Card
          title="TypeScript 类型定义"
          extra={
            <Button
              icon={<CopyOutlined />}
              onClick={handleCopy}
            >
              复制
            </Button>
          }
        >
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{typeOutput}</pre>
        </Card>
      )}
    </Space>
  )
} 