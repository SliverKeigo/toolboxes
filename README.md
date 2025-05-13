# 在线工具箱

一个基于 Next.js 和 HeroUI 构建的现代化在线工具箱网站，提供各种实用的开发工具。

## 功能特性

- 🎨 支持亮色/暗色主题切换
- 📱 响应式设计，支持移动端
- 🚀 基于 Next.js 15，性能优异

## 技术栈

- [Next.js 15](https://nextjs.org/) - React 框架
- [HeroUI](https://heroui.pro/) - 现代UI组件库
- [TypeScript](https://www.typescriptlang.org/) - 类型安全
- [React 18](https://reactjs.org/) - 用户界面库
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的CSS框架

## 开始使用

### 环境要求

- Node.js 18.0.0 或更高版本
- npm、yarn 或 pnpm 包管理器

### 安装

克隆项目

```bash
git clone https://github.com/SliverKeigo/toolboxes.git
cd toolboxes
```

安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

启动开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 构建生产版本

```bash
npm run build
npm run start
# 或
yarn build
yarn start
# 或
pnpm build
pnpm start
```

## 项目结构

```txt
├── app/               # Next.js 应用目录
├── components/        # React 组件
│   ├── layout/        # 布局组件
│   ├── ui/            # UI组件
│   └── tools/         # 工具组件
├── public/            # 静态资源
├── lib/               # 工具函数和配置
├── styles/            # 全局样式
├── config/            # 配置文件
└── types/             # TypeScript类型定义
```

## 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进这个项目。

## 许可证

MIT License
