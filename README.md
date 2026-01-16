# H-Hub Web Demo

🎮 一个基于 WebHID 的键盘灯光控制和按键测试工具，纯 Web 技术实现。

> **注意**：本项目基于 [H-Hub](https://github.com/xingjiu666/H-Hub) 的 SDK 开发，作为学习和演示用途。感谢原作者 xingjiu 的开源贡献。

## ✨ 功能特性

- 🌈 **RGB 灯光控制**：实时调整键盘灯光颜色，支持单键和全局设置
- 🎯 **按键测试**：实时显示按键行程（Travel）和触发状态
- 🎨 **VIA 风格 UI**：现代化的暗色主题界面
- 🔌 **WebHID 通信**：无需驱动，浏览器直接连接 HID 设备
- 📱 **响应式设计**：支持不同屏幕尺寸

## 🛠️ 技术栈

- **框架**：Vue 3 (Composition API)
- **构建工具**：Vite
- **语言**：TypeScript
- **状态管理**：Pinia
- **路由**：Vue Router
- **设备通信**：WebHID API + H-Hub SDK

## 🚀 快速开始

### 环境要求

- Node.js 18+
- pnpm (推荐) 或 npm
- 支持 WebHID 的浏览器（Chrome/Edge 89+）

### 安装

```bash
pnpm install
```

### 开发

```bash
pnpm dev
```

然后在浏览器中打开 `http://localhost:5173`

### 预览模式（默认）

公开仓库已移除第三方 SDK，默认使用 Mock 数据即可预览前端展示。

1. 启动开发服务后进入首页
2. 点击“进入预览”即可浏览各页面

### 接入真实设备（私有环境）

1. 在私有环境准备授权的 SDK，并通过全局变量注入：

```html
<script src="/path/to/hsdk.js"></script>
<script>
  window.__HSDK__ = { HSDK: window.HSDK };
</script>
```

2. 在 `.env.local` 中启用 SDK：

```bash
VITE_SDK_ENABLED=true
```

> 公开仓库不包含 SDK 代码，避免第三方授权风险。

### 构建

```bash
pnpm build
```

## 📖 使用说明

1. **预览**：点击“进入预览”即可体验 UI（无需设备）
2. **连接设备**：点击 "Authorize device +"，选择你的键盘（需支持 H-Hub 协议）
3. **Lighting 页面**：调整灯光开关、模式、亮度，选择颜色并点击按键应用
4. **Key Test 页面**：开启测试模式，按下按键查看实时行程和触发状态

## 🎯 支持的设备

- Vendor ID: `0x34B7`
- Product ID: `0xFFFF`
- 协议：H-Hub Protocol

## 📝 项目结构

```
src/
├── components/       # UI 组件
│   ├── Keyboard.vue  # 键盘可视化
│   ├── LightOptions.vue
│   └── DeviceModal.vue
├── views/            # 页面
│   ├── Lighting.vue  # 灯光控制页
│   └── KeyTest.vue   # 按键测试页
├── stores/           # Pinia 状态管理
│   ├── device.ts     # 设备连接
│   └── lighting.ts   # 灯光配置
├── config/           # 配置文件
│   ├── layout.ts     # 键盘布局
│   └── keymap.ts     # 键码映射
└── service/          # 设备服务（默认 Mock，可接入私有 SDK）
```

## ⚠️ 注意事项

- **浏览器兼容性**：需要支持 WebHID API（Chrome/Edge 89+，Firefox 不支持）
- **权限**：连接真实设备时需授权设备访问
- **设备支持**：仅支持使用 H-Hub 协议的键盘

## 📄 许可证

本项目使用的 SDK 来自 [H-Hub 项目](https://github.com/xingjiu666/H-Hub)。

界面和应用代码采用 MIT License。

## 🙏 致谢

- [H-Hub](https://github.com/xingjiu666/H-Hub) - 核心 SDK 和协议参考
- [VIA](https://www.usevia.app/) - UI 设计灵感

## 👤 作者

[Your Name / GitHub Username]

---

**免责声明**：本项目仅供学习和个人使用。使用本软件修改键盘配置可能影响设备行为，请谨慎操作。

