# H-Hub Web Demo 改进计划

本文档用于指导后续在 Cursor 中的重构与优化工作，重点关注架构、可维护性与交互体验。

## 目标

- 将当前 Demo 打造成结构清晰、易扩展的键盘配置工具（接近 VIA 的体验）。
- 降低与 H-Hub SDK 绑定的耦合度，方便后续替换或升级 SDK。
- 提升灯光和按键测试等高频交互场景下的性能和流畅度。

---

## 一、架构与状态管理

### 1.1 分层结构优化

建立清晰的分层架构，确保各层职责明确：

```
src/
├── sdk/              # H-Hub SDK 与 WebHID 通信层
├── service/          # 业务逻辑与数据访问层
├── stores/           # Pinia 状态管理（UI 相关）
├── components/       # 可复用 UI 组件
├── views/            # 页面级组件
├── types/            # 统一类型定义
├── config/           # 配置文件（布局、按键映射等）
├── utils/            # 工具函数（节流、防抖等）
└── assets/           # 静态资源
```

- **SDK 层**（`src/sdk/`）：仅负责封装 H-Hub SDK 与 WebHID 通信逻辑，暴露清晰的接口。
- **Service 层**（`src/service/`）：处理业务逻辑，依赖 SDK，不关心 UI。
- **Store 层**（`src/stores/`）：只暴露与 UI 相关的状态与 action，例如 `useDeviceStore`、`useLightingStore`、`useKeyTestStore`。
- **组件层**（`src/components/` & `src/views/`）：接收 store 状态与 action，不直接操作 SDK 实例。

### 1.2 设备连接状态机

为设备连接流程设计完整的状态机，避免状态不一致：

```typescript
// types/device.ts
export type DeviceConnectionState = 
  | 'idle'           // 初始化
  | 'authorizing'    // 等待用户授权 WebHID
  | 'authorized'     // 已授权，未连接
  | 'connecting'     // 正在连接
  | 'connected'      // 已连接
  | 'disconnecting'  // 正在断开
  | 'error';         // 错误状态

export interface DeviceState {
  state: DeviceConnectionState;
  currentDevice: HHubDeviceInfo | null;
  error: string | null;
  supportedFeatures: string[];
}
```

所有 UI（按钮禁用、提示条、加载动画等）都基于该状态机渲染，减少组件内零散的 `if (device)` 判断。

**示例：**
```typescript
// stores/device.ts
export const useDeviceStore = defineStore('device', () => {
  const state = ref<DeviceConnectionState>('idle');
  const currentDevice = ref<HHubDeviceInfo | null>(null);
  const error = ref<string | null>(null);

  const isConnecting = computed(() => state.value === 'connecting');
  const isConnected = computed(() => state.value === 'connected');
  const canConnect = computed(() => ['idle', 'authorized'].includes(state.value));

  const connect = async () => {
    state.value = 'connecting';
    try {
      currentDevice.value = await hHubClient.connect();
      state.value = 'connected';
      error.value = null;
    } catch (e) {
      state.value = 'error';
      error.value = (e as Error).message;
    }
  };

  return { state, currentDevice, error, isConnecting, isConnected, canConnect, connect };
});
```

---

## 二、类型与 SDK 封装

### 2.1 统一类型定义

在 `src/types/` 下创建集中的类型定义文件，避免 `any` 和类型散落：

```typescript
// types/device.ts
export interface HHubDeviceInfo {
  id: string;
  name: string;
  vendorId: number;
  productId: number;
  serialNumber?: string;
  version: string;
  supportedFeatures: FeatureSet;
}

export interface FeatureSet {
  lighting: boolean;
  keyTest: boolean;
  keyRemap: boolean;
  macro: boolean;
}

// types/lighting.ts
export type LightingMode = 'static' | 'breathing' | 'wave' | 'rainbow' | 'custom';

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface LightingProfile {
  mode: LightingMode;
  color: RGBColor;
  brightness: number;      // 0-100
  speed: number;            // 0-255 (部分模式)
  perKeyMode?: boolean;
  keyLights: Map<string, RGBColor>;  // 单键颜色
}

export interface LightingState {
  profiles: LightingProfile[];
  activeProfile: number;
  isApplying: boolean;
}

// types/keytest.ts
export interface KeyTravelData {
  keyId: string;
  keyName: string;
  currentTravel: number;    // 0-100 (%)
  isPressed: boolean;
  triggerPoint?: number;
}

export interface KeyTestState {
  enabled: boolean;
  data: Map<string, KeyTravelData>;
  lastUpdate: number;
}
```

### 2.2 SDK 封装与适配层

创建 `HHubClient` 类，作为 H-Hub SDK 与业务层之间的适配器：

```typescript
// sdk/HHubClient.ts
export class HHubClient {
  private device: HIDDevice | null = null;
  private hHubSDK: any;  // 实际 H-Hub SDK 实例

  async requestDevice(): Promise<HHubDeviceInfo> {
    // 调用 WebHID API 请求设备
    // 返回标准的 HHubDeviceInfo 类型
  }

  async connect(deviceInfo: HHubDeviceInfo): Promise<HHubDeviceInfo> {
    // 连接逻辑
  }

  async disconnect(): Promise<void> {
    // 断开连接
  }

  async setLighting(profile: LightingProfile): Promise<void> {
    // 应用灯光配置
  }

  async startKeyTest(): Promise<void> {
    // 开始按键测试
  }

  onKeyTestData(callback: (data: KeyTravelData[]) => void): void {
    // 监听按键测试数据
  }

  // ... 其他方法
}

export const hHubClient = new HHubClient();
```

**好处：**
- 如需替换 SDK，只需修改 `HHubClient` 实现，不影响 store 和组件。
- 统一的接口和类型，降低耦合。
- 便于单测和 mock。

---

## 三、Lighting 页面优化

### 3.1 请求节流与合并

灯光调节（颜色、亮度、模式等）时频繁发送 HID 报文会导致设备卡顿。使用节流与防抖合并请求：

```typescript
// utils/throttle.ts
export function throttle<T extends (...args: any[]) => Promise<void>>(
  fn: T,
  delay: number
): T {
  let pending = false;
  let lastArgs: any[] | null = null;

  return (async (...args: any[]) => {
    lastArgs = args;
    if (pending) return;
    pending = true;
    await fn(...args);
    pending = false;
    if (lastArgs) {
      await fn(...lastArgs);
      lastArgs = null;
    }
  }) as T;
}

// stores/lighting.ts
export const useLightingStore = defineStore('lighting', () => {
  const lighting = ref<LightingState>({
    profiles: [],
    activeProfile: 0,
    isApplying: false,
  });

  // 节流版本的灯光应用
  const applyLightingThrottled = throttle(async (profile: LightingProfile) => {
    lighting.value.isApplying = true;
    try {
      await hHubClient.setLighting(profile);
      lighting.value.profiles[lighting.value.activeProfile] = profile;
    } finally {
      lighting.value.isApplying = false;
    }
  }, 100);

  const updateColor = (color: RGBColor) => {
    const profile = lighting.value.profiles[lighting.value.activeProfile];
    profile.color = color;
    applyLightingThrottled(profile);
  };

  const updateBrightness = (brightness: number) => {
    const profile = lighting.value.profiles[lighting.value.activeProfile];
    profile.brightness = brightness;
    applyLightingThrottled(profile);
  };

  return { lighting, updateColor, updateBrightness };
});
```

### 3.2 配置与布局解耦

将键盘布局和按键映射作为配置文件，通过 props 传入组件：

```typescript
// config/layout.ts
export const KEYBOARD_LAYOUTS = {
  '60': {
    name: '60%',
    rows: [
      ['Esc', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
      ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
      // ...
    ],
  },
  '75': { /* ... */ },
  'full': { /* ... */ },
};

export type LayoutType = keyof typeof KEYBOARD_LAYOUTS;

export interface LayoutConfig {
  type: LayoutType;
  rows: string[][];
  keyWidth: number;
  keyHeight: number;
  gap: number;
}

export function getLayoutConfig(type: LayoutType): LayoutConfig {
  // 返回配置对象
}
```

在组件中使用：

```vue
<!-- views/Lighting.vue -->
<template>
  <div class="lighting-container">
    <Keyboard
      :layout-config="currentLayout"
      :keymap="keymap"
      @key-click="onKeyClick"
    />
    <LightOptions
      :profile="currentProfile"
      @update:color="updateColor"
      @update:brightness="updateBrightness"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useLightingStore } from '@/stores/lighting';
import { getLayoutConfig } from '@/config/layout';

const lightingStore = useLightingStore();

const currentLayout = computed(() => getLayoutConfig('60'));
const currentProfile = computed(() => lightingStore.lighting.profiles[lightingStore.lighting.activeProfile]);

const updateColor = (color: RGBColor) => {
  lightingStore.updateColor(color);
};
</script>
```

---

## 四、按键测试（Key Test）优化

### 4.1 更新频率控制

如果行程数据刷新频率高（>30fps），使用 `requestAnimationFrame` 合并更新：

```typescript
// stores/keytest.ts
export const useKeyTestStore = defineStore('keytest', () => {
  const keytest = ref<KeyTestState>({
    enabled: false,
    data: new Map(),
    lastUpdate: 0,
  });

  // 内部数据缓冲，未经处理的原始数据
  const rawDataBuffer = ref<KeyTravelData[]>([]);
  let animationFrameId: number | null = null;

  const startKeyTest = async () => {
    keytest.value.enabled = true;
    
    // 监听 SDK 的按键数据
    hHubClient.onKeyTestData((data: KeyTravelData[]) => {
      rawDataBuffer.value = data;
      
      // 使用 requestAnimationFrame 合并更新
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(() => {
          keytest.value.data = new Map(rawDataBuffer.value.map(d => [d.keyId, d]));
          keytest.value.lastUpdate = Date.now();
          animationFrameId = null;
        });
      }
    });
  };

  const stopKeyTest = () => {
    keytest.value.enabled = false;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  };

  return { keytest, startKeyTest, stopKeyTest };
});
```

### 4.2 数据与展示分离

在组件层只做映射和渲染，使用小组件提升可读性和复用性：

```vue
<!-- components/KeyTravelIndicator.vue -->
<template>
  <div class="key-indicator" :class="{ pressed: isPressed }">
    <div class="key-label">{{ keyName }}</div>
    <div class="travel-bar">
      <div class="travel-fill" :style="{ width: currentTravel + '%' }"></div>
    </div>
    <div class="travel-text">{{ currentTravel }}%</div>
  </div>
</template>

<script setup lang="ts">
import { KeyTravelData } from '@/types/keytest';

defineProps<{
  data: KeyTravelData;
}>();

const currentTravel = computed(() => props.data.currentTravel);
const isPressed = computed(() => props.data.isPressed);
const keyName = computed(() => props.data.keyName);
</script>

<style scoped>
.key-indicator {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.key-indicator.pressed {
  background-color: #e8f5e9;
  border-color: #4caf50;
}

.travel-bar {
  width: 100%;
  height: 20px;
  background-color: #f0f0f0;
  border-radius: 2px;
  overflow: hidden;
}

.travel-fill {
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #8bc34a);
  transition: width 0.05s linear;
}
</style>

<!-- views/KeyTest.vue -->
<template>
  <div class="keytest-container">
    <div class="keytest-controls">
      <button @click="startTest" :disabled="keytestStore.keytest.enabled">
        Start Test
      </button>
      <button @click="stopTest" :disabled="!keytestStore.keytest.enabled">
        Stop Test
      </button>
    </div>

    <div class="keytest-grid">
      <KeyTravelIndicator
        v-for="(data, keyId) in keytestStore.keytest.data"
        :key="keyId"
        :data="data"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useKeyTestStore } from '@/stores/keytest';
import KeyTravelIndicator from '@/components/KeyTravelIndicator.vue';

const keytestStore = useKeyTestStore();

const startTest = () => keytestStore.startKeyTest();
const stopTest = () => keytestStore.stopKeyTest();
</script>
```

---

## 五、组件拆分与复用

### 5.1 提炼通用 UI 组件

将复杂页面拆分为细粒度组件，统一样式与交互：

```
src/components/
├── color/
│   ├── ColorPicker.vue        # 颜色选择器
│   └── ColorPreview.vue       # 颜色预览
├── lighting/
│   ├── ModeSelector.vue       # 灯光模式选择
│   ├── BrightnessSlider.vue   # 亮度滑块
│   └── SpeedSlider.vue        # 速度滑块
├── device/
│   ├── DeviceSelector.vue     # 设备选择下拉
│   └── DeviceStatus.vue       # 设备状态显示
├── keyboard/
│   ├── Keyboard.vue           # 主键盘布局
│   └── KeyPreview.vue         # 单个按键预览
└── common/
    ├── Button.vue
    ├── Modal.vue
    └── Toast.vue
```

**示例：ColorPicker 组件**

```vue
<!-- components/color/ColorPicker.vue -->
<template>
  <div class="color-picker">
    <div class="color-preview" :style="{ backgroundColor: hexColor }"></div>
    
    <div class="color-input-group">
      <label>
        R
        <input v-model.number="modelValue.r" type="range" min="0" max="255" />
        <span>{{ modelValue.r }}</span>
      </label>
      <label>
        G
        <input v-model.number="modelValue.g" type="range" min="0" max="255" />
        <span>{{ modelValue.g }}</span>
      </label>
      <label>
        B
        <input v-model.number="modelValue.b" type="range" min="0" max="255" />
        <span>{{ modelValue.b }}</span>
      </label>
    </div>

    <input
      v-model="hexColor"
      type="text"
      placeholder="#RRGGBB"
      maxlength="7"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RGBColor } from '@/types/lighting';

const props = withDefaults(
  defineProps<{ modelValue?: RGBColor }>(),
  { modelValue: () => ({ r: 255, g: 255, b: 255 }) }
);

const emit = defineEmits<{ 'update:modelValue': [RGBColor] }>();

const hexColor = computed({
  get() {
    const { r, g, b } = props.modelValue;
    return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`.toUpperCase();
  },
  set(hex: string) {
    if (!/^#[0-9A-F]{6}$/i.test(hex)) return;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    emit('update:modelValue', { r, g, b });
  },
});
</script>
```

### 5.2 规范 Props 与 Emits

在所有组件中严格定义 `props` 和 `emits`，避免通过全局 store 直接修改深层状态：

```vue
<!-- 好的做法 -->
<template>
  <div class="modal">
    <div class="modal-header">
      <h2>{{ title }}</h2>
      <button @click="$emit('close')">×</button>
    </div>
    <div class="modal-body">
      <slot />
    </div>
    <div class="modal-footer">
      <button @click="$emit('confirm')">{{ confirmText }}</button>
      <button @click="$emit('cancel')">{{ cancelText }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  confirmText?: string;
  cancelText?: string;
}>();

defineEmits<{
  confirm: [];
  cancel: [];
  close: [];
}>();
</script>

<!-- 坏的做法 - 直接操作 store -->
<!-- ❌ 不要在组件内部直接修改 store 的深层属性 -->
<script>
// ❌ 错误示例
store.deviceList[0].status = 'connected';
</script>
```

---

## 六、工程与体验优化

### 6.1 路由与代码分割

使用 Vue Router 异步加载页面，减少首屏包体积：

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/lighting',
    component: () => import('@/views/Lighting.vue'),
  },
  {
    path: '/keytest',
    component: () => import('@/views/KeyTest.vue'),
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
```

在 Vite 配置中优化代码分割：

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'h-hub-sdk': ['@h-hub/sdk'],
          'vendor': ['vue', 'pinia'],
        },
      },
    },
  },
});
```

### 6.2 错误处理与用户提示

为不同错误场景设计统一的错误处理机制：

```typescript
// types/error.ts
export enum ErrorCode {
  DEVICE_NOT_FOUND = 'DEVICE_NOT_FOUND',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  CONNECTION_FAILED = 'CONNECTION_FAILED',
  UNSUPPORTED_DEVICE = 'UNSUPPORTED_DEVICE',
  SDK_ERROR = 'SDK_ERROR',
  UNKNOWN = 'UNKNOWN',
}

export interface AppError {
  code: ErrorCode;
  message: string;
  details?: string;
}

// utils/errorHandler.ts
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.DEVICE_NOT_FOUND]: '未找到支持的设备，请检查连接。',
  [ErrorCode.PERMISSION_DENIED]: '缺少 WebHID 权限，请在浏览器设置中授予权限。',
  [ErrorCode.CONNECTION_FAILED]: '连接失败，请重试或更换 USB 端口。',
  [ErrorCode.UNSUPPORTED_DEVICE]: '该设备不被支持，请检查固件版本。',
  [ErrorCode.SDK_ERROR]: 'SDK 错误，请查看控制台日志获取更多信息。',
  [ErrorCode.UNKNOWN]: '发生未知错误，请稍后重试。',
};

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return ERROR_MESSAGES[ErrorCode.UNKNOWN];
}

// stores/error.ts
export const useErrorStore = defineStore('error', () => {
  const errors = ref<AppError[]>([]);

  const addError = (error: AppError) => {
    errors.value.push(error);
    // 3 秒后自动移除
    setTimeout(() => {
      errors.value.shift();
    }, 3000);
  };

  const clearErrors = () => {
    errors.value = [];
  };

  return { errors, addError, clearErrors };
});
```

在主应用中展示错误提示：

```vue
<!-- App.vue -->
<template>
  <div class="app">
    <header>
      <h1>H-Hub Keyboard Demo</h1>
      <DeviceStatus />
    </header>

    <ErrorAlert v-if="errorStore.errors.length > 0" />

    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useErrorStore } from '@/stores/error';
import DeviceStatus from '@/components/device/DeviceStatus.vue';
import ErrorAlert from '@/components/common/ErrorAlert.vue';

const errorStore = useErrorStore();
</script>
```

---

## 七、文档与 README 补充

### 7.1 创建 `docs/architecture.md`

详细说明项目结构、数据流和 SDK 集成方式，便于后续维护和扩展。

### 7.2 创建 `docs/development-notes.md`

记录已知问题、与 H-Hub SDK 相关的协议细节、以及未来计划。

### 7.3 更新 `README.md`

补充：
- 项目简介与目标
- 快速开始（安装、运行）
- 项目结构说明
- 与 H-Hub SDK 的集成说明
- 已知问题与限制
- 未来计划（多布局支持、宏配置、配置导入导出等）

---

## 八、总结与实施步骤

### 推荐实施顺序

1. **第一阶段**：搭建基础架构
   - 创建 `types/` 和 `config/` 目录，定义关键类型。
   - 创建 `HHubClient` 适配层。
   - 重构 `stores/` 为 `device`, `lighting`, `keytest` 三个独立 store。

2. **第二阶段**：优化 Lighting 页面
   - 实现节流版本的灯光应用。
   - 拆分 `LightOptions.vue` 为细粒度组件。
   - 支持配置化的键盘布局。

3. **第三阶段**：优化 KeyTest 页面
   - 实现高频数据更新的 `requestAnimationFrame` 合并。
   - 拆分 `KeyTest.vue` 为 `KeyTravelIndicator` 等小组件。

4. **第四阶段**：工程优化
   - 添加错误处理与用户提示。
   - 配置代码分割与异步路由。
   - 补充文档。

### 预期收益

- ✅ 代码结构清晰，便于协作和维护。
- ✅ SDK 与 UI 解耦，方便后续升级或替换。
- ✅ 性能提升，灯光调节和按键测试流畅度明显改善。
- ✅ 用户体验改善，错误提示清晰，交互响应迅速。
- ✅ 为未来功能扩展（多设备、宏配置等）奠定基础。

---

**祝好运！** 如有任何疑问，欢迎继续沟通。
