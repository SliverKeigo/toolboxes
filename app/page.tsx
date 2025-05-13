"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  Button,
  Card,
  CardBody,
  CardFooter,
  Tabs,
  Tab,
  Divider,
} from "@heroui/react";
import Link from "next/link";
import { useState } from "react";
import { useTheme } from "next-themes";

import { categories } from "@/lib/data";

const tabOptions = [
  { key: "all", title: "🔍 所有工具" },
  ...categories.map((category) => ({
    key: category.key,
    title: `${category.icon} ${category.title}`,
  })),
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-hero-background to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Navbar className="sticky top-0 z-10 backdrop-blur-md border-b border-hero-border">
        <NavbarBrand>
          <span className="font-bold text-xl">工具站</span>
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

      <div className="container mx-auto py-6 px-4 flex flex-1">
        <div className="w-64 hidden md:block">
          <div className="sticky top-20 pr-4">
            <h2 className="text-xl font-bold mb-4">工具分类</h2>
            <ul className="space-y-1">
              <li>
                <Button
                  className={`w-full justify-start ${selectedCategory === "all" ? "bg-hero-primary/10 text-hero-primary font-medium" : ""}`}
                  variant={selectedCategory === "all" ? "flat" : "light"}
                  onClick={() => setSelectedCategory("all")}
                >
                  🔍 所有工具
                </Button>
              </li>
              <Divider className="my-2" />
              {categories.map((category) => (
                <li key={category.key}>
                  <Button
                    className={`w-full justify-start ${selectedCategory === category.key ? "bg-hero-primary/10 text-hero-primary font-medium" : ""}`}
                    variant={
                      selectedCategory === category.key ? "flat" : "light"
                    }
                    onClick={() => setSelectedCategory(category.key)}
                  >
                    {category.icon} {category.title}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex-1 pl-0 md:pl-6">
          <div className="md:hidden mb-6 overflow-x-auto pb-2">
            <Tabs
              aria-label="工具分类"
              classNames={{
                tabList: "gap-2",
                cursor: "bg-hero-primary",
                tab: "px-3 py-2 text-sm",
              }}
              selectedKey={selectedCategory}
              variant="solid"
              onSelectionChange={(key) => setSelectedCategory(key as string)}
            >
              {tabOptions.map((tab) => (
                <Tab key={tab.key} title={tab.title} />
              ))}
            </Tabs>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {categories
              .filter(
                (category) =>
                  selectedCategory === "all" ||
                  category.key === selectedCategory,
              )
              .flatMap((category) =>
                category.tools.map((tool) => (
                  <Card
                    key={`${category.key}-${tool.key}`}
                    isHoverable
                    isPressable
                    as={Link}
                    className="border border-hero-border bg-hero-background"
                    href={`/tools/${category.key}/${tool.key}`}
                  >
                    <CardBody className="p-6 flex flex-col items-center text-center">
                      <div className="w-16 h-16 flex items-center justify-center text-3xl bg-hero-primary/10 rounded-full mb-4">
                        {category.icon}
                      </div>
                      <h3 className="font-bold text-lg mb-2 text-hero-foreground group-hover:text-hero-primary transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-hero-foreground/60 text-sm">
                        {category.title}
                      </p>
                    </CardBody>
                    {!tool.implemented && (
                      <CardFooter className="py-2 text-center bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-t border-amber-200 dark:border-amber-800">
                        <div className="flex items-center justify-center gap-1 font-medium w-full">
                          <svg
                            fill="none"
                            height="16"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            width="16"
                          >
                            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          开发中
                        </div>
                      </CardFooter>
                    )}
                  </Card>
                )),
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
