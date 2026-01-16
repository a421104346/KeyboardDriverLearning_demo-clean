<template>
  <div class="page-container" v-animate-stagger>
    <div class="content-wrapper">
      <div class="keyboard-wrapper stagger-enter">
        <KeyboardPanel 
          v-model:current-layer="currentLayer"
          :has-layout="isInitialized"
          :layout="K61_LAYOUT"
          :key-layout="keyLayout" 
          :key-colors="activeKeyColors" 
          :selected-keys="keyboardStore.selectedKeyList"
          @key-click="handleKeyClick"
        />
      </div>
      
      <div class="setting-wrapper stagger-enter">
        <SettingPanel 
          @assign-key="handleAssignKey"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useDeviceStore } from '../../stores/device';
import { useKeyboardStore } from '../../stores/keyboard';
import { K61_LAYOUT } from '../../config/layout';
import KeyboardPanel from './components/KeyboardPanel/index.vue';
import SettingPanel from './components/SettingPanel/index.vue';

const deviceStore = useDeviceStore();
const keyboardStore = useKeyboardStore();

const currentLayer = ref(0);
const activeKeyColors = reactive<Record<string, string>>({});

// Derived State
const isInitialized = computed(() => keyboardStore.isInitialized);

// Map KeyData[][] to number[][] based on current layer
const keyLayout = computed(() => {
  if (!keyboardStore.keyboard || keyboardStore.keyboard.length === 0) return [];
  
  const layer = Number(currentLayer.value);
  
  return keyboardStore.keyboard.map((row, rIndex) => row.map((k, cIndex) => {
    // --- FORCE MOCK FOR LAYERS ---
    
    // Layer 1 (Fn1): Ensure keys are rendered
    if (layer === 1) {
      return k.keyValue[0] || 1; 
    }

    // Layer 2/3 (Fn2/Fn3): Always return 1 to show keycaps
    if (layer > 1) {
      return 1;
    }

    // If we have actual multi-layer data in store, use it
    if (k.keyValue.length > layer) {
      const val = k.keyValue[layer];
      if (val !== undefined) return val;
    }

    // Layer 0: Always fallback to base layer data
    return k.keyValue[0];
  }));
});

// Initialization Logic
const initData = async () => {
  if (deviceStore.currentDevice) {
    if (!keyboardStore.isInitialized) {
      await keyboardStore.init();
    }
    // Select all keys by default if none selected is not required here, 
    // maybe we want to select the first one or none.
    // keeping selection logic simple for now.
  }
};

onMounted(initData);

watch(() => deviceStore.currentDevice, (connected) => {
  if (connected) initData();
});

const handleKeyClick = ({ row, col }: { row: number, col: number }) => {
  // Single selection for assignment usually makes sense, but we can support multi
  // For now, let's just toggle selection like in KeyPerformance
  keyboardStore.selectKey(row, col, true);
};

const handleAssignKey = (key: string) => {
  console.log('Assign key:', key, 'to selected keys:', keyboardStore.selectedKeyList);
  // Here we would call the service to update the key assignment
  // service.setKeyAssignment(...)
};
</script>

<style scoped>
.page-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: transparent;
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
