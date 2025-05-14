"use client";

import { useState, useRef } from "react";
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
  Input,
  Select,
  SelectItem,
} from "@heroui/react";

type FormatMode = "beautify" | "minify";
type ConversionType = "none" | "pxToRem" | "pxToRpx";

export default function CssBeautifier() {
  const [inputCss, setInputCss] = useState<string>("");
  const [outputCss, setOutputCss] = useState<string>("");
  const [mode, setMode] = useState<FormatMode>("beautify");
  const [conversionType, setConversionType] = useState<ConversionType>("none");
  const [baseSize, setBaseSize] = useState<number>(16);
  const [indentSize, setIndentSize] = useState<number>(2);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("format");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const downloadRef = useRef<HTMLAnchorElement>(null);

  // 格式化CSS
  const formatCss = () => {
    setError(null);
    setIsProcessing(true);

    if (!inputCss.trim()) {
      setError("请输入需要处理的CSS");
      setIsProcessing(false);
      setTimeout(() => setError(null), 3000);

      return;
    }

    try {
      if (mode === "beautify") {
        // 美化CSS
        const beautified = beautifyCss(inputCss, indentSize);

        setOutputCss(beautified);
      } else {
        // 压缩CSS
        const minified = minifyCss(inputCss);

        setOutputCss(minified);
      }

      setSuccessMessage("CSS格式化成功");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (e) {
      setError(`CSS处理错误: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // 净化CSS
  const cleanCss = () => {
    setError(null);
    setIsProcessing(true);

    if (!inputCss.trim()) {
      setError("请输入需要净化的CSS");
      setIsProcessing(false);
      setTimeout(() => setError(null), 3000);

      return;
    }

    try {
      // 移除注释
      let cleaned = inputCss.replace(/\/\*[\s\S]*?\*\//g, "");

      // 移除空行
      cleaned = cleaned.replace(/^\s*[\r\n]/gm, "");
      // 移除多余空格
      cleaned = cleaned.replace(/\s{2,}/g, " ");
      // 移除行末空格
      cleaned = cleaned.replace(/\s+}/g, "}");
      cleaned = cleaned.replace(/{\s+/g, "{ ");

      setOutputCss(cleaned);
      setSuccessMessage("CSS净化成功");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (e) {
      setError(`CSS净化错误: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // 整理CSS
  const organizeCss = () => {
    setError(null);
    setIsProcessing(true);

    if (!inputCss.trim()) {
      setError("请输入需要整理的CSS");
      setIsProcessing(false);
      setTimeout(() => setError(null), 3000);

      return;
    }

    try {
      // 简单整理：按选择器排序
      const cssBlocks = extractCssBlocks(inputCss);

      cssBlocks.sort((a, b) => a.selector.localeCompare(b.selector));

      let organized = cssBlocks
        .map((block) => {
          return `${block.selector} {\n${block.properties.trim()}\n}`;
        })
        .join("\n\n");

      setOutputCss(organized);
      setSuccessMessage("CSS整理成功");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (e) {
      setError(`CSS整理错误: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // 优化CSS
  const optimizeCss = () => {
    setError(null);
    setIsProcessing(true);

    if (!inputCss.trim()) {
      setError("请输入需要优化的CSS");
      setIsProcessing(false);
      setTimeout(() => setError(null), 3000);

      return;
    }

    try {
      // 简化颜色表示
      let optimized = inputCss.replace(
        /#([0-9a-f])\1([0-9a-f])\2([0-9a-f])\3/gi,
        "#$1$2$3",
      );

      // 简化0值
      optimized = optimized.replace(/(\s|:)0(?:px|em|rem|%)/g, "$10");

      // 合并相同选择器
      const cssBlocks = extractCssBlocks(optimized);
      const mergedBlocks = mergeSameSelectors(cssBlocks);

      optimized = mergedBlocks
        .map((block) => {
          return `${block.selector} {\n${block.properties.trim()}\n}`;
        })
        .join("\n\n");

      setOutputCss(optimized);
      setSuccessMessage("CSS优化成功");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (e) {
      setError(`CSS优化错误: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // 转换单位
  const convertUnits = () => {
    setError(null);
    setIsProcessing(true);

    if (!inputCss.trim()) {
      setError("请输入需要转换的CSS");
      setIsProcessing(false);
      setTimeout(() => setError(null), 3000);

      return;
    }

    try {
      let converted = inputCss;

      if (conversionType === "pxToRem") {
        // 转换px为rem
        converted = converted.replace(/(\d+)px/g, (match, value) => {
          const remValue = Number(value) / baseSize;

          return `${remValue.toFixed(4).replace(/\.?0+$/, "")}rem`;
        });
      } else if (conversionType === "pxToRpx") {
        // 转换px为rpx (通常小程序使用，比例为1:2)
        converted = converted.replace(/(\d+)px/g, (match, value) => {
          const rpxValue = Number(value) * 2;

          return `${rpxValue}rpx`;
        });
      }

      setOutputCss(converted);
      setSuccessMessage(
        `CSS单位转换成功 (${conversionType === "pxToRem" ? "px → rem" : "px → rpx"})`,
      );
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (e) {
      setError(`CSS转换错误: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // 复制到剪贴板
  const copyToClipboard = () => {
    if (!outputCss) {
      setError("没有可复制的内容");
      setTimeout(() => setError(null), 3000);

      return;
    }

    navigator.clipboard.writeText(outputCss).then(
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

  // 下载CSS文件
  const downloadCss = () => {
    if (!outputCss) {
      setError("没有可下载的内容");
      setTimeout(() => setError(null), 3000);

      return;
    }

    const blob = new Blob([outputCss], { type: "text/css" });
    const url = URL.createObjectURL(blob);

    if (downloadRef.current) {
      downloadRef.current.href = url;
      downloadRef.current.download = "styles.css";
      downloadRef.current.click();
      URL.revokeObjectURL(url);

      setSuccessMessage("CSS文件已下载");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  // 处理不同操作
  const handleAction = () => {
    switch (activeTab) {
      case "format":
        formatCss();
        break;
      case "clean":
        cleanCss();
        break;
      case "organize":
        organizeCss();
        break;
      case "optimize":
        optimizeCss();
        break;
      case "convert":
        convertUnits();
        break;
    }
  };

  // 生成示例CSS
  const generateExample = () => {
    const example = `
/* 示例CSS */
.header {
  background-color: #ffffff;
  padding: 20px;
  margin: 0;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

.header .nav {
  display: flex;
  justify-content: space-between;
}

.button {
  background-color: #3366ff;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.button:hover {
  background-color: #254EDB;
  transform: translateY(-2px);
}
`;

    setInputCss(example.trim());
    setError(null);
  };

  // 辅助函数: 美化CSS
  const beautifyCss = (css: string, indent: number): string => {
    // 移除现有的空白
    let result = css.replace(/\s+/g, " ").trim();

    // 在选择器后添加换行
    result = result.replace(/\s*{\s*/g, " {\n");

    // 在属性后添加换行
    result = result.replace(/;\s*/g, ";\n");

    // 在闭合括号前添加换行
    result = result.replace(/\s*}\s*/g, "\n}\n\n");

    // 缩进属性
    const indentStr = " ".repeat(indent);

    result = result.replace(/(\n)(?!})/g, `$1${indentStr}`);

    // 移除多余的空行
    result = result.replace(/\n\s*\n/g, "\n\n");

    return result.trim();
  };

  // 辅助函数: 压缩CSS
  const minifyCss = (css: string): string => {
    // 移除注释
    let result = css.replace(/\/\*[\s\S]*?\*\//g, "");

    // 移除空白
    result = result.replace(/\s+/g, " ");
    result = result.replace(/\s*{\s*/g, "{");
    result = result.replace(/\s*}\s*/g, "}");
    result = result.replace(/\s*:\s*/g, ":");
    result = result.replace(/\s*;\s*/g, ";");
    result = result.replace(/\s*,\s*/g, ",");

    // 移除最后一个分号
    result = result.replace(/;}/g, "}");

    return result.trim();
  };

  // 辅助函数: 提取CSS块
  const extractCssBlocks = (css: string) => {
    const blocks: { selector: string; properties: string }[] = [];
    const regex = /([^{]+)\s*{\s*([^}]*)\s*}/g;
    let match;

    while ((match = regex.exec(css)) !== null) {
      blocks.push({
        selector: match[1].trim(),
        properties: match[2].trim(),
      });
    }

    return blocks;
  };

  // 辅助函数: 合并相同选择器
  const mergeSameSelectors = (
    blocks: { selector: string; properties: string }[],
  ) => {
    const selectors: { [key: string]: string[] } = {};

    blocks.forEach((block) => {
      if (!selectors[block.selector]) {
        selectors[block.selector] = [];
      }

      // 将属性分割为单独的行
      const properties = block.properties.split(";").filter((p) => p.trim());

      selectors[block.selector].push(...properties);
    });

    const mergedBlocks: { selector: string; properties: string }[] = [];

    for (const selector in selectors) {
      // 移除重复属性，保留最后一个
      const uniqueProps: { [key: string]: string } = {};

      selectors[selector].forEach((prop) => {
        const [key, value] = prop.split(":").map((p) => p.trim());

        if (key) uniqueProps[key] = value;
      });

      // 转换回属性字符串
      const propertiesString = Object.entries(uniqueProps)
        .map(([key, value]) => `${key}: ${value};`)
        .join("\n");

      mergedBlocks.push({
        selector,
        properties: propertiesString,
      });
    }

    return mergedBlocks;
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
        <CardHeader>
          <h3 className="text-lg font-medium">输入CSS</h3>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <Textarea
            minRows={8}
            placeholder="请输入需要处理的CSS..."
            value={inputCss}
            onChange={(e) => setInputCss(e.target.value)}
          />
          <div className="flex gap-2">
            <Button variant="flat" onClick={generateExample}>
              生成示例
            </Button>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium">CSS处理选项</h3>
        </CardHeader>
        <CardBody>
          <Tabs
            aria-label="CSS处理选项"
            color="primary"
            selectedKey={activeTab}
            variant="bordered"
            onSelectionChange={(key) => setActiveTab(key as string)}
          >
            <Tab key="format" title="格式化" />
            <Tab key="clean" title="净化" />
            <Tab key="organize" title="整理" />
            <Tab key="optimize" title="优化" />
            <Tab key="convert" title="单位转换" />
          </Tabs>

          <div className="mt-4">
            {activeTab === "format" && (
              <div className="flex flex-wrap gap-4 min-h-16">
                <div>
                  <h4 className="text-medium font-medium mb-4">格式</h4>
                  <RadioGroup
                    orientation="horizontal"
                    value={mode}
                    onValueChange={(value) => setMode(value as FormatMode)}
                  >
                    <Radio value="beautify">美化</Radio>
                    <Radio value="minify">压缩</Radio>
                  </RadioGroup>
                </div>

                {mode === "beautify" && (
                  <div>
                    <h4 className="text-medium font-medium mb-2">缩进空格数</h4>
                    <Select
                      className="w-24"
                      value={String(indentSize)}
                      onChange={(e) => setIndentSize(Number(e.target.value))}
                    >
                      <SelectItem key="2">2</SelectItem>
                      <SelectItem key="4">4</SelectItem>
                      <SelectItem key="8">8</SelectItem>
                    </Select>
                  </div>
                )}
              </div>
            )}

            {activeTab === "convert" && (
              <div className="flex flex-wrap gap-6 min-h-16">
                <div>
                  <h4 className="text-medium font-medium mb-2">转换类型</h4>
                  <RadioGroup
                    orientation="horizontal"
                    value={conversionType}
                    onValueChange={(value) =>
                      setConversionType(value as ConversionType)
                    }
                  >
                    <Radio value="pxToRem">px → rem</Radio>
                    <Radio value="pxToRpx">px → rpx</Radio>
                  </RadioGroup>
                </div>

                {conversionType === "pxToRem" && (
                  <div>
                    <h4 className="text-medium font-medium mb-2">
                      根元素字体大小 (px)
                    </h4>
                    <Input
                      className="w-24"
                      min="1"
                      type="number"
                      value={String(baseSize)}
                      onChange={(e) => setBaseSize(Number(e.target.value))}
                    />
                  </div>
                )}
              </div>
            )}

            {(activeTab === "clean" ||
              activeTab === "organize" ||
              activeTab === "optimize") && (
              <div className="min-h-16 flex items-center">
                <p className="text-hero-foreground/60">
                  点击下方的应用按钮执行
                  {activeTab === "clean"
                    ? "净化"
                    : activeTab === "organize"
                      ? "整理"
                      : "优化"}
                  操作
                </p>
              </div>
            )}
          </div>

          <div className="mt-6">
            <Button
              color="primary"
              isLoading={isProcessing}
              onClick={handleAction}
            >
              {isProcessing ? "处理中..." : "应用"}
            </Button>
          </div>
        </CardBody>
      </Card>

      {outputCss && (
        <Card>
          <CardHeader className="flex justify-between items-center">
            <h3 className="text-lg font-medium">处理结果</h3>
            <div className="flex gap-2">
              <Button color="primary" variant="flat" onClick={copyToClipboard}>
                复制
              </Button>
              <Button color="primary" onClick={downloadCss}>
                下载CSS
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <Textarea
              readOnly
              className="font-mono text-sm"
              minRows={8}
              value={outputCss}
            />
          </CardBody>
        </Card>
      )}

      <a
        ref={downloadRef}
        aria-label="下载CSS文件"
        className="hidden"
        download="styles.css"
        href="/"
      />

      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium">功能说明</h3>
        </CardHeader>
        <CardBody>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <span className="font-semibold">格式化：</span>
              <span>美化或压缩CSS代码，使其更易阅读或减小文件大小</span>
            </li>
            <li>
              <span className="font-semibold">净化：</span>
              <span>移除注释和多余空白</span>
            </li>
            <li>
              <span className="font-semibold">整理：</span>
              <span>按选择器名称排序CSS规则</span>
            </li>
            <li>
              <span className="font-semibold">优化：</span>
              <span>合并相同选择器、简化颜色表示和零值表示</span>
            </li>
            <li>
              <span className="font-semibold">单位转换：</span>
              <span>将px单位转换为rem或rpx单位</span>
            </li>
            <li>
              <span className="font-semibold">复制：</span>
              <span>将结果复制到剪贴板</span>
            </li>
            <li>
              <span className="font-semibold">下载：</span>
              <span>将处理后的CSS保存为.css文件</span>
            </li>
          </ul>
        </CardBody>
      </Card>
    </div>
  );
}
