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
import { useState, useCallback } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

import { categories } from "@/lib/data";
import { SunFilledIcon, MoonFilledIcon, GithubIcon } from "@/components/icons";

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
  const router = useRouter();

  // 使用浅路由优化工具导航
  const navigateToTool = useCallback(
    (category: string, tool: string) => {
      router.push(`/tools/${category}/${tool}`, { scroll: false });
    },
    [router],
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-hero-background to-blue-50 dark:from-gray-900 dark:to-gray-800 animate-fade-in">
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
              <SunFilledIcon size={20} />
            ) : (
              <MoonFilledIcon size={20} />
            )}
          </Button>
          <Link
            className="flex items-center"
            href="https://github.com/SliverKeigo/toolboxes"
            target="_blank"
          >
            <GithubIcon size={20} />
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
                <Button
                  className={`w-full justify-start ${selectedCategory === "all" ? "bg-hero-primary/10 text-hero-primary font-medium dark:bg-hero-primary-dark/20 dark:text-hero-primary-dark" : ""}`}
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
                    className={`w-full justify-start ${selectedCategory === category.key ? "bg-hero-primary/10 text-hero-primary font-medium dark:bg-hero-primary-dark/20 dark:text-hero-primary-dark" : ""}`}
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
                    className="border border-hero-border bg-hero-background cursor-pointer"
                    onClick={() => navigateToTool(category.key, tool.key)}
                  >
                    <CardBody className="p-6 flex flex-col items-center text-center">
                      <h3 className="font-bold text-lg mb-2 text-hero-foreground group-hover:text-hero-primary transition-colors">
                        {tool.title}
                      </h3>
                      {selectedCategory === "all" && (
                        <p className="text-hero-foreground/60 text-sm">
                          {category.title}
                        </p>
                      )}
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
