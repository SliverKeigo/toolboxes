"use client";

import { useParams, useRouter } from "next/navigation";
import { Navbar, NavbarBrand, NavbarContent, Button } from "@heroui/react";
import Link from "next/link";
import { Suspense, useState, useEffect } from "react";
import { useTheme } from "next-themes";

import { categoryMap, categories, Category, Tool } from "@/lib/data";
import UuidGenerator from "@/components/tools/uuid-generator";
import CaseConverter from "@/components/tools/case-converter";
import Base64Encoder from "@/components/tools/base64-encoder";
import JsonFormatter from "@/components/tools/json-formatter";
import JsonToTypeScript from "@/components/tools/json-to-typescript";
import QRCodeGenerator from "@/components/tools/qr-code-generator";

// 工具映射表
const toolMap = {
  "generator/uuid-generator": {
    title: "UUID生成器",
    component: UuidGenerator,
    implemented: true,
  },
  "text/case-converter": {
    title: "大小写转换",
    component: CaseConverter,
    implemented: true,
  },
  "encoding/base64": {
    title: "Base64编解码",
    component: Base64Encoder,
    implemented: true,
  },
  "format/json-formatter": {
    title: "JSON格式化",
    component: JsonFormatter,
    implemented: true,
  },
  "format/json-to-typescript": {
    title: "JSON转TypeScript类型",
    component: JsonToTypeScript,
    implemented: true,
  },
  "encoding/qr-code-generator": {
    title: "二维码生成器",
    component: QRCodeGenerator,
    implemented: true,
  },
};

// 提取同分类工具组件以改善数据处理
const SameCategoryTools = ({
  category,
  currentTool,
  onNavigate,
}: {
  category: string;
  currentTool: string;
  onNavigate: (category: string, tool: string) => void;
}) => {
  const sameCategoryTools =
    categories
      .find((cat: Category) => cat.key === category)
      ?.tools.filter((t: Tool) => t.key !== currentTool) || [];

  if (sameCategoryTools.length === 0) return null;

  return (
    <>
      {sameCategoryTools.map((otherTool: Tool) => (
        <li key={otherTool.key}>
          <button
            className="w-full text-left py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
            onClick={() => onNavigate(category, otherTool.key)}
          >
            {otherTool.title}
          </button>
        </li>
      ))}
    </>
  );
};

export default function ToolPage() {
  const params = useParams();
  const router = useRouter();
  const category = params.category as string;
  const tool = params.tool as string;
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 只在客户端渲染完成后显示完整内容
  useEffect(() => {
    setMounted(true);
  }, []);

  const toolKey = `${category}/${tool}`;
  const toolInfo = toolMap[toolKey as keyof typeof toolMap];

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hero-background dark:bg-gray-900">
        <div className="w-16 h-16 border-4 border-t-hero-primary border-hero-primary/30 rounded-full animate-spin" />
      </div>
    );
  }

  if (!toolInfo) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-hero-background to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <Navbar className="sticky top-0 z-10 backdrop-blur-md border-b border-hero-border">
          <NavbarBrand>
            <Link className="font-bold text-xl no-underline" href="/">
              工具站
            </Link>
          </NavbarBrand>
          <NavbarContent justify="end">
            <Button
              isIconOnly
              aria-label="切换主题"
              variant="light"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? (
                <svg fill="none" height="20" viewBox="0 0 24 24" width="20">
                  <path
                    d="M12 18.5C15.5899 18.5 18.5 15.5899 18.5 12C18.5 8.41015 15.5899 5.5 12 5.5C8.41015 5.5 5.5 8.41015 5.5 12C5.5 15.5899 8.41015 18.5 12 18.5Z"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M19.14 19.14L19.01 19.01M19.01 4.99L19.14 4.86L19.01 4.99ZM4.86 19.14L4.99 19.01L4.86 19.14ZM12 2.08V2V2.08ZM12 22V21.92V22ZM2.08 12H2H2.08ZM22 12H21.92H22ZM4.99 4.99L4.86 4.86L4.99 4.99Z"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                </svg>
              ) : (
                <svg fill="none" height="20" viewBox="0 0 24 24" width="20">
                  <path
                    d="M21.0672 11.8568L20.4253 11.469L21.0672 11.8568ZM12.1143 2.90397L12.5021 2.26207V2.26207L12.1143 2.90397ZM21.25 12C21.25 17.1086 17.1086 21.25 12 21.25V22.75C17.9371 22.75 22.75 17.9371 22.75 12H21.25ZM12 21.25C6.89137 21.25 2.75 17.1086 2.75 12H1.25C1.25 17.9371 6.06294 22.75 12 22.75V21.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75V1.25C6.06294 1.25 1.25 6.06294 1.25 12H2.75ZM15.5 14.25C12.3244 14.25 9.75 11.6756 9.75 8.5H8.25C8.25 12.5041 11.4959 15.75 15.5 15.75V14.25ZM20.4253 11.469C19.4172 13.1373 17.5882 14.25 15.5 14.25V15.75C18.1349 15.75 20.4407 14.3439 21.7092 12.2447L20.4253 11.469ZM9.75 8.5C9.75 6.41182 10.8627 4.5828 12.5021 3.56299L11.7265 2.26207C9.65324 3.5499 8.25 5.85292 8.25 8.5H9.75Z"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                </svg>
              )}
            </Button>
            <Link
              className="flex items-center"
              href="https://github.com/SliverKeigo/toolboxes"
              target="_blank"
            >
              <svg
                fill="currentColor"
                height="20"
                viewBox="0 0 24 24"
                width="20"
              >
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
              </svg>
            </Link>
          </NavbarContent>
        </Navbar>

        <div className="container mx-auto px-6 py-6 flex flex-1">
          <div className="w-64 hidden md:block">
            <div className="sticky top-20 pr-4">
              <h2 className="text-xl font-bold mb-4">工具分类</h2>
              <ul className="space-y-1">
                <li>
                  <Link
                    className="block py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
                    href="/"
                  >
                    返回首页
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex-1 pl-0 md:pl-6 flex items-center justify-center">
            <div className="bg-hero-background dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden max-w-md w-full">
              <div className="p-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-red-50 dark:bg-red-900/20 rounded-full mb-4 text-red-600 dark:text-red-400">
                  <svg
                    fill="none"
                    height="32"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="32"
                  >
                    <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  工具不存在
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  您访问的工具不存在或正在开发中
                </p>
                <button
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                  onClick={() => router.push("/")}
                >
                  返回首页
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const ToolComponent = toolInfo.component;
  const categoryName =
    categoryMap[category as keyof typeof categoryMap] || "未知分类";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-hero-background to-blue-50 dark:from-gray-900 dark:to-gray-800 animate-fade-in">
      <Navbar className="sticky top-0 z-10 backdrop-blur-md border-b border-hero-border">
        <NavbarBrand>
          <Link className="font-bold text-xl no-underline" href="/">
            工具站
          </Link>
        </NavbarBrand>
        <NavbarContent justify="end">
          <Button
            isIconOnly
            aria-label="切换主题"
            variant="light"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? (
              <svg fill="none" height="20" viewBox="0 0 24 24" width="20">
                <path
                  d="M12 18.5C15.5899 18.5 18.5 15.5899 18.5 12C18.5 8.41015 15.5899 5.5 12 5.5C8.41015 5.5 5.5 8.41015 5.5 12C5.5 15.5899 8.41015 18.5 12 18.5Z"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
                <path
                  d="M19.14 19.14L19.01 19.01M19.01 4.99L19.14 4.86L19.01 4.99ZM4.86 19.14L4.99 19.01L4.86 19.14ZM12 2.08V2V2.08ZM12 22V21.92V22ZM2.08 12H2H2.08ZM22 12H21.92H22ZM4.99 4.99L4.86 4.86L4.99 4.99Z"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>
            ) : (
              <svg fill="none" height="20" viewBox="0 0 24 24" width="20">
                <path
                  d="M21.0672 11.8568L20.4253 11.469L21.0672 11.8568ZM12.1143 2.90397L12.5021 2.26207V2.26207L12.1143 2.90397ZM21.25 12C21.25 17.1086 17.1086 21.25 12 21.25V22.75C17.9371 22.75 22.75 17.9371 22.75 12H21.25ZM12 21.25C6.89137 21.25 2.75 17.1086 2.75 12H1.25C1.25 17.9371 6.06294 22.75 12 22.75V21.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75V1.25C6.06294 1.25 1.25 6.06294 1.25 12H2.75ZM15.5 14.25C12.3244 14.25 9.75 11.6756 9.75 8.5H8.25C8.25 12.5041 11.4959 15.75 15.5 15.75V14.25ZM20.4253 11.469C19.4172 13.1373 17.5882 14.25 15.5 14.25V15.75C18.1349 15.75 20.4407 14.3439 21.7092 12.2447L20.4253 11.469ZM9.75 8.5C9.75 6.41182 10.8627 4.5828 12.5021 3.56299L11.7265 2.26207C9.65324 3.5499 8.25 5.85292 8.25 8.5H9.75Z"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>
            )}
          </Button>
          <Link
            className="flex items-center"
            href="https://github.com/SliverKeigo/toolboxes"
            target="_blank"
          >
            <svg fill="currentColor" height="20" viewBox="0 0 24 24" width="20">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
            </svg>
          </Link>
        </NavbarContent>
      </Navbar>
      <div className="container mx-auto py-6 px-4 flex flex-1 animate-slide-in">
        <div className="w-64 hidden md:block">
          <div className="sticky top-20 pr-4">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              工具分类
            </h2>
            <ul className="space-y-1">
              <li>
                <Link
                  className="block py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
                  href="/"
                >
                  返回首页
                </Link>
              </li>
              <li className="my-2 border-b border-gray-200 dark:border-gray-700" />
              <li>
                <div className="flex items-center py-2 px-3 rounded-md bg-hero-primary/10 text-hero-primary font-medium dark:bg-hero-primary-dark/20 dark:text-hero-primary-dark">
                  <span>{categoryName}</span>
                </div>
              </li>
              <li>
                <div className="py-2 px-3 rounded-md bg-hero-secondary/10 text-hero-secondary font-medium dark:bg-hero-secondary-dark/20 dark:text-hero-secondary-dark">
                  {toolInfo.title}
                </div>
              </li>
              <SameCategoryTools
                category={category}
                currentTool={tool}
                onNavigate={(c, t) => router.push(`/tools/${c}/${t}`)}
              />
            </ul>
          </div>
        </div>

        <div className="flex-1 pl-0 md:pl-6">
          <div className="flex flex-col gap-4 items-start mb-6">
            <nav className="flex text-sm mb-1">
              <Link
                className="text-gray-600 hover:text-hero-primary dark:text-gray-400 dark:hover:text-hero-primary-dark"
                href="/"
              >
                首页
              </Link>
              <span className="mx-2 text-gray-400 dark:text-gray-500">/</span>
              <span className="text-gray-600 dark:text-gray-400">
                {categoryName}
              </span>
              <span className="mx-2 text-gray-400 dark:text-gray-500">/</span>
              <span className="text-hero-primary dark:text-hero-primary-dark font-medium">
                {toolInfo.title}
              </span>
            </nav>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {toolInfo.title}
            </h1>
          </div>

          <div className="bg-hero-background dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6">
              {!toolInfo.implemented && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 p-4 rounded-lg mb-4">
                  <p className="text-lg font-bold flex items-center gap-2">
                    <svg
                      fill="none"
                      height="20"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="20"
                    >
                      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>开发中</span>
                  </p>
                  <p>此工具正在开发中，敬请期待</p>
                </div>
              )}

              {toolInfo.implemented && ToolComponent && (
                <Suspense
                  fallback={
                    <div className="flex justify-center py-10">
                      <div className="w-10 h-10 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin" />
                    </div>
                  }
                >
                  <ToolComponent />
                </Suspense>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
