"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Textarea,
  Card,
  CardBody,
  CardHeader,
} from "@heroui/react";

function convertToTypeStructure(obj: any): any {
  if (obj === null) return "null";

  if (typeof obj !== "object") {
    return typeof obj;
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) return "array";

    return [convertToTypeStructure(obj[0])];
  }

  const result: Record<string, any> = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = convertToTypeStructure(obj[key]);
    }
  }

  return result;
}

function normalizeTypeName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9]/g, " ")
    .split(" ")
    .map((word, index) => {
      if (index === 0) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }

      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("");
}

function inferType(value: any): string {
  if (value === null) return "null";
  if (typeof value === "string") {
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
      return "Date";
    }
    if (value.startsWith("http://") || value.startsWith("https://")) {
      return "string";
    }

    return "string";
  }
  if (typeof value === "number") {
    if (Number.isInteger(value)) return "number";

    return "number";
  }
  if (typeof value === "boolean") return "boolean";
  if (Array.isArray(value)) {
    if (value.length === 0) return "any[]";

    return `${inferType(value[0])}[]`;
  }
  if (typeof value === "object") return "object";

  return "any";
}

function generateTypeDefinition(typeStruct: any, rootName = "Root"): string {
  const typeMap = new Map();
  const visited = new Set();

  function processType(obj: any, typeName: string) {
    if (visited.has(typeName)) return;
    visited.add(typeName);

    let typeDef = `export interface ${typeName} {\n`;

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        const pascalCaseKey = normalizeTypeName(key);

        if (typeof value === "string") {
          const inferredType = inferType(value);

          typeDef += `  ${key}: ${inferredType};\n`;
        } else if (Array.isArray(value)) {
          if (typeof value[0] === "string") {
            const inferredType = inferType(value[0]);

            typeDef += `  ${key}: ${inferredType}[];\n`;
          } else {
            const arrayTypeName = `${pascalCaseKey}Item`;

            typeMap.set(arrayTypeName, value[0]);
            processType(value[0], arrayTypeName);
            typeDef += `  ${key}: ${arrayTypeName}[];\n`;
          }
        } else if (typeof value === "object") {
          const nestedTypeName = pascalCaseKey;

          typeMap.set(nestedTypeName, value);
          processType(value, nestedTypeName);
          typeDef += `  ${key}: ${nestedTypeName};\n`;
        }
      }
    }

    typeDef += "}\n\n";
    typeMap.set(typeName, typeDef);
  }

  processType(typeStruct, normalizeTypeName(rootName));

  let result = "";
  const sortedTypes = Array.from(typeMap.keys()).sort();

  for (const type of sortedTypes) {
    if (typeof typeMap.get(type) === "string") {
      result += typeMap.get(type);
    }
  }

  return result;
}

function jsonToTypeScript(jsonObj: any, rootName = "Root"): string {
  try {
    const typeStruct = convertToTypeStructure(jsonObj);

    return generateTypeDefinition(typeStruct, rootName);
  } catch (error) {
    throw new Error("JSON 解析失败：" + (error as Error).message);
  }
}

export default function JsonToTypeScript() {
  const [jsonInput, setJsonInput] = useState("");
  const [typeOutput, setTypeOutput] = useState("");
  const [rootName, setRootName] = useState("Root");
  const [errorMessage, setErrorMessage] = useState("");

  const handleConvert = () => {
    try {
      setErrorMessage("");
      const jsonObj = JSON.parse(jsonInput);
      const result = jsonToTypeScript(jsonObj, rootName);

      setTypeOutput(result);
    } catch (error) {
      setErrorMessage(`JSON 格式错误，请检查输入: ${(error as Error).message}`);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(typeOutput);
    // 复制成功提示可以使用浏览器原生API或第三方库
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <Card>
        <CardBody className="flex flex-col gap-4">
          <div>
            <h3 className="text-lg font-medium mb-2">根类型名称</h3>
            <Input
              className="max-w-xs"
              placeholder="输入根类型名称"
              value={rootName}
              onChange={(e) => setRootName(e.target.value)}
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">JSON 输入</h3>
            <Textarea
              maxRows={12}
              minRows={6}
              placeholder="请输入 JSON 数据"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
            />
            {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}
          </div>
          <Button color="primary" onClick={handleConvert}>
            转换为 TypeScript 类型
          </Button>
        </CardBody>
      </Card>

      {typeOutput && (
        <Card>
          <CardHeader className="flex justify-between items-center">
            <h3 className="text-lg font-medium">TypeScript 类型定义</h3>
            <Button color="primary" variant="flat" onClick={handleCopy}>
              <svg
                fill="none"
                height="20"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="20"
              >
                <rect height="13" rx="2" ry="2" width="13" x="9" y="9" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              复制
            </Button>
          </CardHeader>
          <CardBody>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-auto whitespace-pre-wrap">
              {typeOutput}
            </pre>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium">TypeScript类型转换说明</h3>
        </CardHeader>
        <CardBody>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <span className="font-semibold">类型推断：</span>
              <span>
                自动推断JSON数据的类型，包括字符串、数字、布尔值、数组和对象
              </span>
            </li>
            <li>
              <span className="font-semibold">嵌套对象：</span>
              <span>自动处理嵌套的对象结构，生成对应的接口定义</span>
            </li>
            <li>
              <span className="font-semibold">数组处理：</span>
              <span>智能处理数组类型，包括空数组和包含对象的数组</span>
            </li>
            <li>
              <span className="font-semibold">命名规范：</span>
              <span>自动将属性名转换为符合TypeScript命名规范的接口名称</span>
            </li>
            <li>
              <span className="font-semibold">循环引用：</span>
              <span>自动处理对象之间的循环引用关系</span>
            </li>
          </ul>
        </CardBody>
      </Card>
    </div>
  );
}
