# 键盘驱动重构笔记：参考 H-Hub 架构

**日期**: 2025-12-15
**分支**: `keyperformance`

## 1. 重构背景

为了实现更复杂的按键性能设置（如 Rapid Trigger、死区调节）以及更稳定的灯光控制，原有的 `device.ts` + `performance.ts` 结构显得力不从心。状态分散、逻辑耦合导致“状态同步”困难。

参考了成熟项目 `H-Hub` 的源码，发现其采用了一种高度模块化且以“数据为中心”的 Store 设计模式，决定以此为蓝本重构 Demo。

## 2. 核心架构对比

### 2.1 原 Demo 架构 (Before)
*   **Store**:
    *   `device.ts`: 负责连接，同时维护 `keyLayout` (简单的二维数组)。
    *   `performance.ts`: 负责 UI 设置，同时也包含了一部分配置读取逻辑，状态管理混乱。
*   **痛点**:
    *   按键的性能数据（RT、行程）没有和按键本身绑定。
    *   “选中按键”的逻辑缺失，导致只能做全局设置，难做单键设置。
    *   UI 组件直接依赖 SDK 调用，缺乏中间层缓冲。

### 2.2 H-Hub 架构 (Reference)
*   **Store**:
    *   `key-data.ts`: **核心**。维护一个巨大的 `keyboard` 二维数组，每个元素包含按键的所有属性（键值、性能参数、灯光颜色等）。负责初始化和管理“选中按键列表”。
    *   `performance.ts`: **代理**。只负责维护“当前设置面板”的 UI 状态。应用设置时，遍历 `key-data` 中的选中按键并下发 SDK。
*   **优势**:
    *   **数据集中**：所有按键状态都在 `keyboard` 数组里，一目了然。
    *   **逻辑解耦**：UI 只管显示，Store 负责数据映射。
    *   **批量操作**：天然支持多选编辑。

## 3. 重构实现

### 3.1 类型定义 (`src/types/keyboard.ts`)
定义了 `KeyData` 接口，包含 `row`, `col`, `keyValue` 以及所有性能参数 (`travel`, `isRT` 等)。这是整个系统的基石。

### 3.2 新增 `src/stores/keyboard.ts`
对应 H-Hub 的 `key-data.ts`。
*   **State**: `keyboard: KeyData[][]`, `selectedKeyList: string[]`。
*   **Actions**:
    *   `init()`: 初始化矩阵，读取布局，**批量读取所有按键性能数据**。
    *   `selectKey()`: 实现单选/多选逻辑。

### 3.3 重构 `src/stores/performance.ts`
*   **State**: 只保留 `config` (UI 绑定的对象)。
*   **Actions**:
    *   `readConfigFromSelection()`: 从 `keyboardStore` 中选中的第一个按键读取数据到 UI。
    *   `applyConfig()`: 将 UI 的值应用到 `keyboardStore` 中所有选中的按键，并调用 SDK。

### 3.4 页面适配
*   **KeyPerformance/index.vue**:
    *   不再直接使用 `deviceStore.keyLayout`。
    *   使用 `keyboardStore` 初始化数据。
    *   通过 `handleKeyClick` 处理按键选中，并触发 UI 更新。
*   **UI 组件**: 修复了 `KeyboardPanel.vue` 事件透传缺失的问题。

## 4. 发现的问题与解决方案

1.  **Store 循环依赖**:
    *   *问题*: `keyboard.ts` 需要调用 `performance` 的逻辑，而 `performance` 又依赖 `keyboard` 的数据。
    *   *解决*: 保持单向依赖。`performance` store 依赖 `keyboard` store（读取选中按键）。`keyboard` store 只负责数据维护，不直接调用 `performance` 的业务逻辑。

2.  **事件透传**:
    *   *问题*: `KeyboardPanel` 封装了 `Keyboard` 组件，但没有 `emits` 定义，导致点击事件断层。
    *   *解决*: 在 `KeyboardPanel.vue` 中显式定义 `defineEmits(['key-click'])` 并转发事件。

3.  **状态同步**:
    *   *问题*: 切换设备或重连时状态未更新。
    *   *解决*: 在 `KeyPerformance/index.vue` 中添加 `watch(deviceStore.connectedDevice)`，触发 `initData` 重新加载。

## 5. 未来展望

*   **改键功能**: 只需要在 `keyboardStore` 中修改 `keyValue` 字段，并参考 `performance.ts` 创建一个 `remap.ts` 即可。
*   **宏功能**: 同样模式，新增 `macro.ts` store。
*   **灯光同步**: 将 `lighting.ts` 也迁移到这种模式，让 `keyData` 包含单键灯光数据，实现更精细的控制。

