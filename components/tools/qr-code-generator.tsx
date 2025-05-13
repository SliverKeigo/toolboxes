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
} from "@heroui/react";
import { QRCodeCanvas } from "qrcode.react";

type InputType = "text" | "url" | "file" | "image" | "audio" | "video";
type QRCodeStyle = "solid" | "gradient";

export default function QRCodeGenerator() {
  const [inputType, setInputType] = useState<InputType>("text");
  const [inputText, setInputText] = useState<string>("");
  const [fileList, setFileList] = useState<File[]>([]);
  const [qrValue, setQrValue] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

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

  // 处理文本输入
  const handleTextInput = () => {
    if (!inputText.trim()) {
      setErrorMessage("请输入内容");
      setTimeout(() => setErrorMessage(""), 3000);

      return;
    }
    setQrValue(inputText);
  };

  // 处理文件上传
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;

    if (!fileInput.files || !fileInput.files[0]) return;

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      if (e.target?.result) {
        const base64String = (e.target.result as string).split(",")[1];

        setQrValue(base64String);
      }
    };
    reader.readAsDataURL(file);
    setFileList([file]);
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
            <Tabs aria-label="输入类型" color="primary" variant="bordered">
              <Tab
                key="text"
                title="文本"
                onClick={() => setInputType("text")}
              />
              <Tab key="url" title="网址" onClick={() => setInputType("url")} />
              <Tab
                key="file"
                title="文件"
                onClick={() => setInputType("file")}
              />
              <Tab
                key="image"
                title="图片"
                onClick={() => setInputType("image")}
              />
              <Tab
                key="audio"
                title="音频"
                onClick={() => setInputType("audio")}
              />
              <Tab
                key="video"
                title="视频"
                onClick={() => setInputType("video")}
              />
            </Tabs>
          </div>

          <div>
            <h4 className="text-medium font-medium mb-2">输入内容</h4>
            {inputType === "text" || inputType === "url" ? (
              <Textarea
                minRows={6}
                placeholder={
                  inputType === "url" ? "请输入网址..." : "请输入文本..."
                }
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            ) : (
              <div className="flex flex-col gap-2">
                <input
                  accept={
                    inputType === "image"
                      ? "image/*"
                      : inputType === "audio"
                        ? "audio/*"
                        : inputType === "video"
                          ? "video/*"
                          : "*"
                  }
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
                inputType === "file" ||
                inputType === "image" ||
                inputType === "audio" ||
                inputType === "video"
              }
              onClick={handleTextInput}
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
              <span className="font-semibold">文件：</span>
              <span>上传文件生成包含文件内容的二维码</span>
            </li>
            <li>
              <span className="font-semibold">图片/音频/视频：</span>
              <span>上传媒体文件生成包含媒体内容的二维码</span>
            </li>
            <li>
              <span className="font-semibold">样式：</span>
              <span>支持纯色和渐变两种样式，可以自定义颜色和渐变方向</span>
            </li>
            <li>
              <span className="font-semibold">复制：</span>
              <span>支持直接复制二维码图片到剪贴板</span>
            </li>
          </ul>
        </CardBody>
      </Card>
    </div>
  );
}
