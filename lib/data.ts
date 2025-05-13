// 定义类型接口
export interface Tool {
  key: string;
  title: string;
  implemented: boolean;
}

export interface Category {
  key: string;
  icon: string;
  title: string;
  tools: Tool[];
}

// 工具分类映射表
export const categoryMap = {
  text: "文本工具",
  encoding: "编码转换",
  format: "格式化工具",
  generator: "生成工具",
};

// 工具分类和工具列表
export const categories: Category[] = [
  {
    key: "generator",
    icon: "🔑",
    title: "生成工具",
    tools: [{ key: "uuid-generator", title: "UUID生成器", implemented: true }],
  },
  {
    key: "text",
    icon: "📝",
    title: "文本工具",
    tools: [{ key: "case-converter", title: "大小写转换", implemented: true }],
  },
  {
    key: "encoding",
    icon: "💻",
    title: "编码转换",
    tools: [
      { key: "base64", title: "Base64编解码", implemented: true },
      { key: "qr-code-generator", title: "二维码生成器", implemented: true },
    ],
  },
  {
    key: "format",
    icon: "🗄️",
    title: "格式化工具",
    tools: [
      { key: "json-formatter", title: "JSON格式化", implemented: true },
      {
        key: "json-to-typescript",
        title: "JSON转TypeScript类型",
        implemented: true,
      },
    ],
  },
];
