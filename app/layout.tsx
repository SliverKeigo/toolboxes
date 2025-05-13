import type { Metadata } from "next";
import type React from "react";

import { Inter } from "next/font/google";

import "../styles/globals.css";

import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "工具站 | 实用在线开发工具集合",
  description:
    "免费在线开发工具箱，提供JSON格式化、二维码生成、UUID生成、Base64编码解码等多种实用工具，帮助开发者提高工作效率",
  keywords: [
    "在线工具",
    "开发工具",
    "JSON格式化",
    "二维码生成器",
    "UUID生成器",
    "Base64编码",
    "程序员工具",
    "前端工具",
  ],
  authors: [{ name: "Keigo", url: "https://github.com/SliverKeigo" }],
  creator: "Keigo",
  publisher: "工具站",
  robots: "index, follow",
  themeColor: "#ffffff",
  metadataBase: new URL("https://toolbox.sliverkeigo.fun/"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://toolbox.sliverkeigo.fun",
    title: "工具站 | 实用在线开发工具集合",
    description:
      "免费在线开发工具箱，提供JSON格式化、二维码生成、UUID生成、Base64编码解码等多种实用工具，帮助开发者提高工作效率",
    siteName: "工具站",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "工具站 - 实用在线开发工具集合",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "工具站 | 实用在线开发工具集合",
    description:
      "免费在线开发工具箱，提供JSON格式化、二维码生成、UUID生成、Base64编码解码等多种实用工具",
    images: ["/og-image.png"],
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="zh-CN">
      <body suppressHydrationWarning className={inter.className}>
        <Providers themeProps={{ attribute: "class", enableSystem: true }}>
          <div className="antialiased">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
