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
  Tabs,
  Tab,
} from "@heroui/react";

type ConversionMode = "encode" | "decode";
type InputType = "text" | "file";

export default function Base64Encoder() {
  const [inputText, setInputText] = useState<string>("");
  const [outputText, setOutputText] = useState<string>("");
  const [mode, setMode] = useState<ConversionMode>("encode");
  const [inputType, setInputType] = useState<InputType>("text");
  const [fileList, setFileList] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");

  // 编码/解码文本
  const convertText = () => {
    setError(null);

    if (inputType === "text") {
      if (!inputText.trim()) {
        setError("请输入需要转换的文本");
        setTimeout(() => setError(null), 3000);

        return;
      }

      try {
        if (mode === "encode") {
          // 编码为Base64
          const encoded = btoa(unescape(encodeURIComponent(inputText)));

          setOutputText(encoded);
        } else {
          // 从Base64解码
          const decoded = decodeURIComponent(escape(atob(inputText.trim())));

          setOutputText(decoded);
        }
      } catch (e) {
        setError(`转换失败: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
  };

  // 处理文件上传
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const fileInput = e.target;

    if (!fileInput.files || !fileInput.files[0]) return;

    const file = fileInput.files[0];
    const reader = new FileReader();

    if (mode === "encode") {
      reader.onload = (e) => {
        if (e.target?.result) {
          const base64String = (e.target.result as string).split(",")[1];

          setOutputText(base64String);
        }
      };
      reader.readAsDataURL(file);
    } else {
      reader.onload = (e) => {
        if (e.target?.result) {
          try {
            const text = e.target.result as string;
            const decoded = decodeURIComponent(escape(atob(text.trim())));

            setOutputText(decoded);
          } catch (e) {
            setError(`解码失败: ${e instanceof Error ? e.message : String(e)}`);
          }
        }
      };
      reader.readAsText(file);
    }

    setFileList([file]);
  };

  // 复制到剪贴板
  const copyToClipboard = () => {
    if (!outputText) {
      setError("没有可复制的内容");
      setTimeout(() => setError(null), 3000);

      return;
    }

    navigator.clipboard.writeText(outputText).then(
      () => {
        setSuccessMessage("已复制到剪贴板");
        setTimeout(() => setSuccessMessage(""), 3000);
      },
      () => {
        setError("复制失败");
        setTimeout(() => setError(null), 3000);
      },
    );
  };

  // 交换输入和输出
  const swapTexts = () => {
    if (inputType !== "text") {
      setError("文件模式下无法交换");
      setTimeout(() => setError(null), 3000);

      return;
    }

    const temp = inputText;

    setInputText(outputText);
    setOutputText(temp);
    setMode(mode === "encode" ? "decode" : "encode");
  };

  // 下载Base64为文件
  const downloadBase64 = () => {
    if (!outputText) {
      setError("没有可下载的内容");
      setTimeout(() => setError(null), 3000);

      return;
    }

    try {
      const link = document.createElement("a");

      if (mode === "encode") {
        // 下载Base64编码的文本
        const blob = new Blob([outputText], { type: "text/plain" });

        link.href = URL.createObjectURL(blob);
        link.download = "encoded_base64.txt";
      } else {
        // 下载解码后的文件
        link.href = "data:application/octet-stream;base64," + inputText;
        link.download = "decoded_file";
      }

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSuccessMessage("下载成功");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (e) {
      setError(`下载失败: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {successMessage && (
        <div className="bg-success-100 text-success-500 p-2 rounded-md">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="bg-danger-100 text-danger-500 p-2 rounded-md">
          {error}
        </div>
      )}

      <Card>
        <CardBody className="flex flex-col gap-6">
          <div>
            <h4 className="text-medium font-medium mb-2">转换模式</h4>
            <RadioGroup
              orientation="horizontal"
              value={mode}
              onValueChange={(value) => setMode(value as ConversionMode)}
            >
              <Radio value="encode">编码为Base64</Radio>
              <Radio value="decode">从Base64解码</Radio>
            </RadioGroup>
          </div>

          <div>
            <h4 className="text-medium font-medium mb-2">输入类型</h4>
            <Tabs
              aria-label="输入类型"
              className="mb-2"
              color="primary"
              variant="bordered"
            >
              <Tab
                key="text"
                title="文本"
                onClick={() => setInputType("text")}
              />
              <Tab
                key="file"
                title="文件"
                onClick={() => setInputType("file")}
              />
            </Tabs>
          </div>

          <div>
            <h4 className="text-medium font-medium mb-2">
              输入{inputType === "text" ? "文本" : "文件"}
            </h4>
            {inputType === "text" ? (
              <Textarea
                minRows={6}
                placeholder={
                  mode === "encode"
                    ? "请输入需要编码的文本..."
                    : "请输入需要解码的Base64..."
                }
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            ) : (
              <div className="flex flex-col gap-2">
                <input
                  className="hidden"
                  id="file-upload"
                  type="file"
                  onChange={handleFileUpload}
                />
                <Button
                  color="primary"
                  variant="flat"
                  onClick={() =>
                    document.getElementById("file-upload")?.click()
                  }
                >
                  选择文件
                </Button>
                {fileList.length > 0 && (
                  <span className="text-sm">{fileList[0].name}</span>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {inputType === "text" && (
              <Button color="primary" onClick={convertText}>
                {mode === "encode" ? "编码" : "解码"}
              </Button>
            )}
            {inputType === "text" && (
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
                交换并切换模式
              </Button>
            )}
            <Button color="primary" variant="flat" onClick={downloadBase64}>
              下载{mode === "encode" ? "编码" : "解码"}结果
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
          <Textarea
            isReadOnly
            minRows={6}
            placeholder={
              mode === "encode"
                ? "Base64编码结果将显示在这里"
                : "解码结果将显示在这里"
            }
            value={outputText}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium">Base64说明</h3>
        </CardHeader>
        <CardBody>
          <p className="mb-3">
            Base64是一种基于64个可打印字符来表示二进制数据的表示方法。常用于在处理文本数据的场合，
            表示、传输、存储一些二进制数据，包括MIME的电子邮件及XML的一些复杂数据。
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <span className="font-semibold">编码：</span>
              <span>将普通文本或二进制数据转换为Base64格式</span>
            </li>
            <li>
              <span className="font-semibold">解码：</span>
              <span>将Base64格式的数据转换回原始文本或二进制数据</span>
            </li>
          </ul>
        </CardBody>
      </Card>
    </div>
  );
}
