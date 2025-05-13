"use client";

import { useState } from "react";
import {
  Button,
  Textarea,
  Card,
  CardBody,
  CardHeader,
  RadioGroup,
  Radio,
} from "@heroui/react";

type CaseType =
  | "upper"
  | "lower"
  | "title"
  | "sentence"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab";

export default function CaseConverter() {
  const [inputText, setInputText] = useState<string>("");
  const [outputText, setOutputText] = useState<string>("");
  const [caseType, setCaseType] = useState<CaseType>("upper");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // 转换文本大小写
  const convertCase = () => {
    if (!inputText.trim()) {
      setErrorMessage("请输入需要转换的文本");
      setTimeout(() => setErrorMessage(""), 3000);

      return;
    }

    let result = "";

    switch (caseType) {
      case "upper":
        result = inputText.toUpperCase();
        break;
      case "lower":
        result = inputText.toLowerCase();
        break;
      case "title":
        result = inputText
          .toLowerCase()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        break;
      case "sentence":
        result = inputText
          .toLowerCase()
          .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
        break;
      case "camel":
        result = inputText
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
          .replace(/^[A-Z]/, (c) => c.toLowerCase());
        break;
      case "pascal":
        result = inputText
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
          .replace(/^[a-z]/, (c) => c.toUpperCase());
        break;
      case "snake":
        result = inputText
          .toLowerCase()
          .replace(/\s+/g, "_")
          .replace(/[^a-zA-Z0-9_]/g, "");
        break;
      case "kebab":
        result = inputText
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-zA-Z0-9-]/g, "");
        break;
      default:
        result = inputText;
    }

    setOutputText(result);
  };

  // 复制到剪贴板
  const copyToClipboard = () => {
    if (!outputText) {
      setErrorMessage("没有可复制的内容");
      setTimeout(() => setErrorMessage(""), 3000);

      return;
    }

    navigator.clipboard.writeText(outputText).then(
      () => {
        setSuccessMessage("已复制到剪贴板");
        setTimeout(() => setSuccessMessage(""), 3000);
      },
      () => {
        setErrorMessage("复制失败");
        setTimeout(() => setErrorMessage(""), 3000);
      },
    );
  };

  // 交换输入和输出
  const swapTexts = () => {
    const temp = inputText;

    setInputText(outputText);
    setOutputText(temp);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {successMessage && (
        <div className="bg-success-100 text-success-500 p-2 rounded-md">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="bg-danger-100 text-danger-500 p-2 rounded-md">
          {errorMessage}
        </div>
      )}

      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium">输入文本</h3>
        </CardHeader>
        <CardBody>
          <Textarea
            minRows={6}
            placeholder="请输入需要转换的文本..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium">转换选项</h3>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
            <RadioGroup
              className="flex-wrap"
              orientation="horizontal"
              size="sm"
              value={caseType}
              onValueChange={(value) => setCaseType(value as CaseType)}
            >
              <Radio value="upper">大写</Radio>
              <Radio value="lower">小写</Radio>
              <Radio value="title">标题格式</Radio>
              <Radio value="sentence">句子格式</Radio>
              <Radio value="camel">驼峰格式</Radio>
              <Radio value="pascal">帕斯卡格式</Radio>
              <Radio value="snake">蛇形格式</Radio>
              <Radio value="kebab">短横线格式</Radio>
            </RadioGroup>
          </div>

          <div className="flex gap-2">
            <Button color="primary" onClick={convertCase}>
              转换
            </Button>
            <Button color="primary" variant="flat" onClick={swapTexts}>
              <svg
                className="h-4 w-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              交换输入输出
            </Button>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="flex justify-between items-center">
          <h3 className="text-lg font-medium">转换结果</h3>
          <Button color="primary" variant="flat" onClick={copyToClipboard}>
            <svg
              className="mr-1"
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
            复制结果
          </Button>
        </CardHeader>
        <CardBody>
          <Textarea isReadOnly minRows={6} value={outputText} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium">格式说明</h3>
        </CardHeader>
        <CardBody>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <span className="font-semibold">大写：</span>
              <span>将所有字母转换为大写。例如：HELLO WORLD</span>
            </li>
            <li>
              <span className="font-semibold">小写：</span>
              <span>将所有字母转换为小写。例如：hello world</span>
            </li>
            <li>
              <span className="font-semibold">标题格式：</span>
              <span>每个单词的首字母大写。例如：Hello World</span>
            </li>
            <li>
              <span className="font-semibold">句子格式：</span>
              <span>
                每个句子的首字母大写。例如：Hello world. This is a sentence.
              </span>
            </li>
            <li>
              <span className="font-semibold">驼峰格式：</span>
              <span>
                第一个单词小写，后续单词首字母大写，无空格。例如：helloWorld
              </span>
            </li>
            <li>
              <span className="font-semibold">帕斯卡格式：</span>
              <span>每个单词首字母大写，无空格。例如：HelloWorld</span>
            </li>
            <li>
              <span className="font-semibold">蛇形格式：</span>
              <span>所有字母小写，单词间用下划线连接。例如：hello_world</span>
            </li>
            <li>
              <span className="font-semibold">短横线格式：</span>
              <span>所有字母小写，单词间用短横线连接。例如：hello-world</span>
            </li>
          </ul>
        </CardBody>
      </Card>
    </div>
  );
}
