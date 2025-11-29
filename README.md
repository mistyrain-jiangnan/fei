# 情侣甜蜜小工具

一个基于 React + TypeScript + Firebase 的多功能情侣互动应用，包含飞行棋游戏、惩罚游戏、姿势卡牌、番茄时钟等多个趣味模块。

## 📋 功能特性

### 🎮 互动游戏
- **情侣飞行棋** - 7x7 网格飞行棋，支持三种难度（热身/亲昵/挑战）
- **惩罚游戏** - 多级难度惩罚卡牌系统
- **番茄时钟** - 情侣专用番茄工作法计时器

### 🎴 卡牌系统
- **姿势卡牌** - 可爱/有趣/深度三种主题
- **任务库管理** - 自定义添加/编辑/删除任务卡牌

### ☁️ 数据同步
- 基于 Firebase Firestore 的实时数据同步
- 支持多设备数据共享

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

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

## 📦 技术栈

- **框架**: React 18+ with TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **后端服务**: Firebase (Firestore + Auth)
- **代码规范**: ESLint + TypeScript

## 📁 项目结构

```
fei/
├── src/
│   ├── components/
│   │   ├── common/              # 通用组件
│   │   │   ├── Modal.tsx        # 模态框组件
│   │   │   ├── Toggle.tsx       # 开关组件
│   │   │   └── TaskResultModal.tsx  # 任务结果模态框
│   │   ├── modals/              # 模态框组件
│   │   │   └── GlobalSettingsModal.tsx  # 全局设置
│   │   └── screens/             # 屏幕组件
│   │       ├── HomeScreen.tsx           # 主页
│   │       ├── TaskEditorScreen.tsx     # 任务编辑器(待创建)
│   │       ├── ChessGameScreen.tsx      # 飞行棋游戏(待创建)
│   │       ├── PunishmentGameScreen.tsx # 惩罚游戏(待创建)
│   │       ├── PositionCardsScreen.tsx  # 姿势卡牌(待创建)
│   │       └── PomodoroScreen.tsx       # 番茄时钟(待创建)
│   ├── utils/
│   │   ├── firebase.ts          # Firebase 初始化
│   │   └── helpers.ts           # 工具函数
│   ├── types/
│   │   └── index.ts             # TypeScript 类型定义
│   ├── constants/
│   │   └── index.ts             # 常量定义
│   ├── App.tsx                  # 主应用组件
│   ├── main.tsx                 # 入口文件
│   └── index.css                # 全局样式
├── index.html                   # HTML 模板
├── package.json                 # 项目配置
├── tsconfig.json                # TypeScript 配置
├── vite.config.ts               # Vite 配置
├── tailwind.config.js           # Tailwind CSS 配置
└── postcss.config.js            # PostCSS 配置
```

## 🔧 配置说明

### Firebase 配置

项目使用 Firebase 作为后端服务，需要在运行时提供以下全局变量：

- `__app_id`: 应用ID
- `__firebase_config`: Firebase 配置对象（JSON字符串）
- `__initial_auth_token`: 初始认证令牌（可选）

### 环境变量

可以通过 Vite 的环境变量系统配置 Firebase：

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 📝 开发说明

### 待完成的组件

以下屏幕组件需要从 `index.tsx` 中提取并创建独立文件：

1. `ChessGameScreen.tsx` - 飞行棋游戏屏幕
2. `PunishmentGameScreen.tsx` - 惩罚游戏屏幕
3. `PositionCardsScreen.tsx` - 姿势卡牌屏幕
4. `PomodoroScreen.tsx` - 番茄时钟屏幕

### 添加新功能

1. 在 `src/components/screens/` 创建新的屏幕组件
2. 在 `App.tsx` 中导入并注册到 `renderScreen()` 函数
3. 在 `HomeScreen.tsx` 中添加对应的导航按钮

## 🎨 样式系统

项目使用 Tailwind CSS，所有样式类都基于 Tailwind 的工具类。自定义动画和样式定义在 `src/index.css` 中。

## 📄 许可证

MIT

## 👥 贡献

欢迎提交 Issue 和 Pull Request！

## 🐛 问题反馈

如果遇到问题，请在 GitHub Issues 中提交。
