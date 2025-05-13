// 工具接口定义，方便后续扩展
export type ToolProps = {
  title: string;
  component: React.ComponentType<any> | null;
  implemented: boolean;
};
