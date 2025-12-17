<template>
  <div class="page-container">
    <div class="content-wrapper">
      <div class="keyboard-wrapper">
        <KeyboardPanel 
          :has-layout="isInitialized"
          :layout="K61_LAYOUT"
          :key-layout="keyLayout" 
          :key-colors="activeKeyColors" 
          :selected-keys="keyboardStore.selectedKeyList"
          @key-click="handleKeyClick"
        />
      </div>
      
      <div class="setting-wrapper">
        <SettingPanel />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, watch, onMounted } from 'vue';
import { useDeviceStore } from '../../stores/device';
import { useKeyboardStore } from '../../stores/keyboard';
import { K61_LAYOUT } from '../../config/layout';
import KeyboardPanel from './components/KeyboardPanel.vue';
import SettingPanel from './components/SettingPanel/index.vue';

const deviceStore = useDeviceStore();
const keyboardStore = useKeyboardStore();

const activeKeyColors = reactive<Record<string, string>>({});

// Derived State
const isInitialized = computed(() => keyboardStore.isInitialized);

// Map KeyData[][] to number[][] (Default to Layer 0 for Advanced Keys base view)
const keyLayout = computed(() => {
  if (!keyboardStore.keyboard || keyboardStore.keyboard.length === 0) return [];
  // Use Layer 0 for advanced configuration
  return keyboardStore.keyboard.map(row => row.map(k => k.keyValue[0]));
});

// Initialization Logic
const initData = async () => {
  if (deviceStore.currentDevice) {
    if (!keyboardStore.isInitialized) {
      await keyboardStore.init();
    }
  }
};

onMounted(initData);

watch(() => deviceStore.currentDevice, (connected) => {
  if (connected) initData();
});

const handleKeyClick = ({ row, col }: { row: number, col: number }) => {
  // Toggle selection
  keyboardStore.selectKey(row, col, true);
};
</script>

<style scoped>
.page-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: #f0f2f5;
  display: flex;
  justify-content: center;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1600px;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  gap: 20px;
}

.keyboard-wrapper {
  flex: 0 0 auto;
  height: 45%;
  background: transparent;
  border-radius: 12px;
  overflow: hidden;
}

.setting-wrapper {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
</style>
