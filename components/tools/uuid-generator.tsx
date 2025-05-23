"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Input,
  Switch,
  Card,
  CardBody,
  CardHeader,
} from "@heroui/react";

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState<number>(5);
  const [hyphen, setHyphen] = useState<boolean>(true);
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // 生成UUID v4
  const generateUUID = (): string => {
    let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;

      return v.toString(16);
    });

    if (!hyphen) {
      uuid = uuid.replace(/-/g, "");
    }

    if (uppercase) {
      uuid = uuid.toUpperCase();
    }

    return uuid;
  };

  // 生成多个UUID
  const generateUUIDs = () => {
    const newUuids: string[] = [];

    for (let i = 0; i < count; i++) {
      newUuids.push(generateUUID());
    }
    setUuids(newUuids);
  };

  // 复制到剪贴板
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
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

  // 复制所有UUID
  const copyAllUUIDs = () => {
    const text = uuids.join("\n");

    navigator.clipboard.writeText(text).then(
      () => {
        setSuccessMessage("已复制所有UUID到剪贴板");
        setTimeout(() => setSuccessMessage(""), 3000);
      },
      () => {
        setErrorMessage("复制失败");
        setTimeout(() => setErrorMessage(""), 3000);
      },
    );
  };

  // 初始化生成UUID
  useEffect(() => {
    generateUUIDs();
  }, []);

  // 当选项改变时重新生成
  useEffect(() => {
    if (uuids.length > 0) {
      generateUUIDs();
    }
  }, [hyphen, uppercase]);

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
          <h3 className="text-lg font-medium">选项</h3>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-medium" htmlFor="count">
                生成数量:
              </label>
              <Input
                className="max-w-xs"
                id="count"
                max={100}
                min={1}
                type="number"
                value={count.toString()}
                onChange={(e) => setCount(parseInt(e.target.value) || 1)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium" htmlFor="hyphen">
                包含连字符:
              </label>
              <Switch isSelected={hyphen} onValueChange={setHyphen} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium" htmlFor="uppercase">
                大写字母:
              </label>
              <Switch isSelected={uppercase} onValueChange={setUppercase} />
            </div>
          </div>

          <div>
            <Button color="primary" onClick={generateUUIDs}>
              <svg
                className="h-4 w-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              重新生成
            </Button>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="flex justify-between items-center">
          <h3 className="text-lg font-medium">生成结果</h3>
          <Button color="primary" variant="flat" onClick={copyAllUUIDs}>
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
            复制全部
          </Button>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col gap-2">
            {uuids.map((uuid, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input isReadOnly className="flex-1" value={uuid} />
                <Button
                  isIconOnly
                  variant="light"
                  onClick={() => copyToClipboard(uuid)}
                >
                  <svg
                    fill="none"
                    height="18"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="18"
                  >
                    <rect height="13" rx="2" ry="2" width="13" x="9" y="9" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </Button>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
