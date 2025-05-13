"use client";

import { useState, useRef, useEffect } from "react";
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
  Spinner,
} from "@heroui/react";
import { QRCodeCanvas } from "qrcode.react";

type InputType = "text" | "url" | "image";
type QRCodeStyle = "solid" | "gradient";

export default function QRCodeGenerator() {
  const [activeTab, setActiveTab] = useState<string>("text");
  const [inputText, setInputText] = useState<string>("");
  const [qrValue, setQrValue] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");

  // 二维码样式设置
  const [qrStyle, setQrStyle] = useState<QRCodeStyle>("solid");
  const [fgColor, setFgColor] = useState<string>("#000000");
  const [bgColor, setBgColor] = useState<string>("#FFFFFF");
  const [gradientStart, setGradientStart] = useState<string>("#000000");
  const [gradientEnd, setGradientEnd] = useState<string>("#0000FF");
  const [gradientDirection, setGradientDirection] = useState<
    "horizontal" | "vertical" | "diagonal"
  >("horizontal");

  const qrRef = useRef<HTMLCanvasElement>(null);

  // 处理标签切换
  const handleTabChange = (type: InputType) => {
    setActiveTab(type);

    // 切换标签时清除输入内容
    setInputText("");
    setUploadedImageUrl("");
    setQrValue("");
  };

  // 处理文本输入
  const handleTextInput = () => {
    if (!inputText.trim()) {
      setErrorMessage("请输入内容");
      setTimeout(() => setErrorMessage(""), 3000);

      return;
    }
    setQrValue(inputText);
  };

  // Telegraph图片上传
  const uploadToTelegraph = async (file: File) => {
    setIsUploading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const formData = new FormData();

      formData.append("image", file);

      const imgbbApiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error(
          `上传失败 (${response.status}): ${response.statusText}`,
        );
      }

      const data = await response.json();

      if (data.success && data.data && data.data.url) {
        const imageUrl = data.data.url;

        setUploadedImageUrl(imageUrl);
        setQrValue(imageUrl);
        setSuccessMessage("图片已上传成功，二维码已生成");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        throw new Error(data.error?.message || "上传失败，无法获取图片链接");
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "图片上传失败，可能是网络问题或服务不可用",
      );
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setIsUploading(false);
    }
  };

  // 处理文件上传
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const fileInput = e.target;

      if (!fileInput.files || !fileInput.files[0]) return;

      const file = fileInput.files[0];
      // 检查文件大小 - 增加到2MB
      const fileSizeInMB = file.size / (1024 * 1024);

      if (fileSizeInMB > 5) {
        setErrorMessage(
          `文件过大 (${fileSizeInMB.toFixed(2)}MB)，请使用小于5MB的文件`,
        );
        setTimeout(() => setErrorMessage(""), 5000);

        return;
      }

      // 不压缩，直接上传
      await uploadToTelegraph(file);
    } catch (err) {
      setErrorMessage(
        `文件上传过程中发生错误,${err instanceof Error ? err.message : "未知错误"}`,
      );
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  // 下载二维码
  const downloadQRCode = () => {
    const canvas = document.getElementById("qr-code") as HTMLCanvasElement;

    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");

      downloadLink.href = pngUrl;
      downloadLink.download = "qrcode.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      setSuccessMessage("二维码已下载");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  // 复制二维码图片
  const copyQRCode = async () => {
    try {
      const canvas = document.getElementById("qr-code") as HTMLCanvasElement;

      if (!canvas) return;

      // 将 canvas 转换为 blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, "image/png");
      });

      // 创建 ClipboardItem
      const item = new ClipboardItem({ "image/png": blob });

      await navigator.clipboard.write([item]);

      setSuccessMessage("二维码已复制到剪贴板");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setErrorMessage("复制失败，请重试");
      setTimeout(() => setErrorMessage(err as string), 3000);
    }
  };

  // 应用渐变效果
  useEffect(() => {
    if (qrStyle === "gradient" && qrRef.current) {
      const canvas = qrRef.current;
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      // 获取二维码图像数据
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // 创建渐变
      let gradient;

      if (gradientDirection === "horizontal") {
        gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      } else if (gradientDirection === "vertical") {
        gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      } else {
        gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      }

      gradient.addColorStop(0, gradientStart);
      gradient.addColorStop(1, gradientEnd);

      // 创建临时canvas来绘制渐变
      const tempCanvas = document.createElement("canvas");

      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext("2d");

      if (!tempCtx) return;

      // 绘制渐变背景
      tempCtx.fillStyle = gradient;
      tempCtx.fillRect(0, 0, canvas.width, canvas.height);

      // 获取渐变图像数据
      const gradientData = tempCtx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height,
      ).data;

      // 将渐变应用到二维码的黑色部分
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0) {
          data[i] = gradientData[i];
          data[i + 1] = gradientData[i + 1];
          data[i + 2] = gradientData[i + 2];
        }
      }

      // 更新canvas
      ctx.putImageData(imageData, 0, 0);
    }
  }, [qrStyle, gradientStart, gradientEnd, gradientDirection, qrValue]);

  // 为二维码添加说明，如果是文件，限制文件大小
  useEffect(() => {
    if (qrValue && activeTab === "image") {
      // 计算二维码的大小提示
      const qrDataSizeKB = qrValue.length / 1024;
      let qrCapacityWarning = "";

      // 最佳、可扫描和超出容量的阈值
      if (qrDataSizeKB > 2000) {
        qrCapacityWarning = "二维码数据量极大，大多数扫描器无法读取";
      } else if (qrDataSizeKB > 1000) {
        qrCapacityWarning = "二维码数据量很大，部分扫描器可能无法读取";
      } else if (qrDataSizeKB > 500) {
        qrCapacityWarning = "二维码数据量较大，扫描时请确保图像清晰";
      }

      if (qrCapacityWarning) {
        setErrorMessage(qrCapacityWarning);
        setTimeout(() => setErrorMessage(""), 8000);
      }
    }
  }, [qrValue, activeTab]);

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
          <h3 className="text-lg font-medium">创建二维码</h3>
        </CardHeader>
        <CardBody className="flex flex-col gap-6">
          <div>
            <h4 className="text-medium font-medium mb-2">输入类型</h4>
            <Tabs
              aria-label="输入类型"
              color="primary"
              selectedKey={activeTab}
              variant="bordered"
              onSelectionChange={(key) => handleTabChange(key as InputType)}
            >
              <Tab key="text" title="文本" />
              <Tab key="url" title="网址" />
              <Tab key="image" title="图片" />
            </Tabs>
          </div>

          <div>
            <h4 className="text-medium font-medium mb-2">输入内容</h4>
            {activeTab === "text" || activeTab === "url" ? (
              <Textarea
                minRows={6}
                placeholder={
                  activeTab === "url" ? "请输入网址..." : "请输入文本..."
                }
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            ) : (
              <div className="flex flex-col gap-2">
                <input
                  accept="image/*"
                  className="hidden"
                  id="file-upload"
                  type="file"
                  onChange={handleFileUpload}
                />
                <div className="flex flex-wrap gap-4 mb-2">
                  <Button
                    color="primary"
                    isDisabled={isUploading}
                    variant="flat"
                    onClick={() =>
                      document.getElementById("file-upload")?.click()
                    }
                  >
                    {isUploading ? (
                      <>
                        <Spinner className="mr-2" size="sm" />
                        上传中...
                      </>
                    ) : (
                      "选择图片"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div>
            <h4 className="text-medium font-medium mb-2">二维码样式</h4>
            <RadioGroup
              orientation="horizontal"
              value={qrStyle}
              onValueChange={(value) => setQrStyle(value as QRCodeStyle)}
            >
              <Radio value="solid">纯色</Radio>
              <Radio value="gradient">渐变</Radio>
            </RadioGroup>

            <div className="mt-4">
              {qrStyle === "solid" ? (
                <div className="flex gap-4">
                  <div>
                    <label className="block mb-1" htmlFor="fgColor">
                      前景色
                    </label>
                    <input
                      className="w-16 h-8"
                      id="fgColor"
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mb-1" htmlFor="bgColor">
                      背景色
                    </label>
                    <input
                      className="w-16 h-8"
                      id="bgColor"
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-4">
                  <div>
                    <label className="block mb-1" htmlFor="gradientStart">
                      起始色
                    </label>
                    <input
                      className="w-16 h-8"
                      id="gradientStart"
                      type="color"
                      value={gradientStart}
                      onChange={(e) => setGradientStart(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mb-1" htmlFor="gradientEnd">
                      结束色
                    </label>
                    <input
                      className="w-16 h-8"
                      id="gradientEnd"
                      type="color"
                      value={gradientEnd}
                      onChange={(e) => setGradientEnd(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mb-1" htmlFor="gradientDirection">
                      渐变方向
                    </label>
                    <select
                      className="p-2 rounded-md border border-gray-300 dark:border-gray-700"
                      id="gradientDirection"
                      value={gradientDirection}
                      onChange={(e) =>
                        setGradientDirection(e.target.value as any)
                      }
                    >
                      <option value="horizontal">水平</option>
                      <option value="vertical">垂直</option>
                      <option value="diagonal">对角</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <Button
              color="primary"
              isDisabled={
                activeTab === "text" || activeTab === "url"
                  ? !inputText.trim()
                  : !uploadedImageUrl && !isUploading
              }
              onClick={() => {
                if (activeTab === "text" || activeTab === "url") {
                  handleTextInput();
                }
              }}
            >
              生成二维码
            </Button>
          </div>
        </CardBody>
      </Card>

      {qrValue && (
        <Card>
          <CardHeader className="flex justify-between items-center">
            <h3 className="text-lg font-medium">二维码预览</h3>
            <div className="flex gap-2">
              <Button color="primary" variant="flat" onClick={copyQRCode}>
                复制图片
              </Button>
              <Button color="primary" onClick={downloadQRCode}>
                下载二维码
              </Button>
            </div>
          </CardHeader>
          <CardBody className="flex justify-center p-6">
            <QRCodeCanvas
              ref={qrRef}
              bgColor={qrStyle === "solid" ? bgColor : "#FFFFFF"}
              fgColor={qrStyle === "solid" ? fgColor : "#000000"}
              id="qr-code"
              includeMargin={true}
              level="H"
              size={256}
              value={qrValue}
            />
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium">使用说明</h3>
        </CardHeader>
        <CardBody>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <span className="font-semibold">文本：</span>
              <span>支持输入任意文本内容生成二维码</span>
            </li>
            <li>
              <span className="font-semibold">网址：</span>
              <span>输入网址生成可跳转的二维码</span>
            </li>
            <li>
              <span className="font-semibold">图片：</span>
              <span>
                上传图片生成含有图片链接的二维码，扫描二维码后可直接查看图片。
              </span>
            </li>
            <li>
              <span className="font-semibold">样式：</span>
              <span>支持纯色和渐变两种样式，可以自定义颜色和渐变方向</span>
            </li>
            <li>
              <span className="font-semibold">复制：</span>
              <span>支持直接复制二维码图片或图片链接到剪贴板</span>
            </li>
          </ul>
        </CardBody>
      </Card>
    </div>
  );
}
