# Todo App

一个现代化的任务管理应用，支持多用户、分类管理、优先级设置等功能。

## 功能特性

- **多用户支持** - 创建多个用户，每个用户有独立的任务列表
- **任务管理** - 创建、编辑、删除、完成任务
- **分类管理** - 工作、个人、学习、其他四种分类
- **优先级设置** - 低、中、高三种优先级
- **截止日期** - 设置任务截止日期，逾期提醒
- **拖拽排序** - 通过拖拽调整任务顺序
- **搜索过滤** - 按关键词、分类、优先级筛选任务
- **深色模式** - 支持明暗主题切换
- **本地存储** - 数据自动保存到浏览器本地

## 技术栈

- **React 19** - 前端框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Zustand** - 状态管理
- **Tailwind CSS** - 样式框架
- **Framer Motion** - 动画库
- **dnd-kit** - 拖拽功能
- **date-fns** - 日期处理
- **Lucide React** - 图标库

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 项目结构

```
src/
├── components/          # 组件目录
│   ├── TaskForm.tsx     # 任务表单（创建/编辑）
│   ├── TaskItem.tsx     # 任务项组件
│   ├── TaskList.tsx     # 任务列表
│   ├── TaskFilter.tsx   # 任务过滤
│   ├── UserSelector.tsx # 用户选择器
│   ├── ThemeToggle.tsx  # 主题切换
│   └── CategoryBadge.tsx# 分类标签
├── hooks/               # 自定义 Hooks
│   └── useTheme.ts      # 主题 Hook
├── store/               # 状态管理
│   ├── taskStore.ts     # 任务状态
│   └── userStore.ts     # 用户状态
├── types/               # 类型定义
│   └── index.ts
├── App.tsx              # 主应用组件
└── main.tsx             # 入口文件
```

## 许可证

MIT
