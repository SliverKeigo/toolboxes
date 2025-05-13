import type { Metadata } from "next";
import type React from "react";

import { Suspense } from "react";
import { Inter } from "next/font/google";

import "../styles/globals.css";

import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "工具站 | 实用在线工具集合",
  description: "提供各种实用的在线工具",
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
          <div className="antialiased">
            <Suspense>{children}</Suspense>
          </div>
        </Providers>
      </body>
    </html>
  );
}
