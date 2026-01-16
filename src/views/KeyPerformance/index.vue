<template>
  <div class="page-container" v-animate-stagger>
    <div class="content-wrapper">
      <div class="keyboard-wrapper stagger-enter">
        <KeyboardPanel 
          :key="refreshKey"
          :has-layout="isInitialized"
          :layout="K61_LAYOUT"
          :key-layout="keyLayout" 
          :key-colors="activeKeyColors" 
          :selected-keys="keyboardStore.selectedKeyList"
          :key-performance-data="keyboardStore.keyboard"
          @key-click="handleKeyClick"
        />
      </div>
      
      <div class="setting-wrapper stagger-enter">
        <SettingPanel 
          :is-testing="isTesting"
          :max-travel="maxTravel"
          :is-loading="performanceStore.isLoading"
          :is-loaded="performanceStore.isLoaded"
          @toggle-test="toggleTest"
          @apply-config="applyConfig"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue';
import { useDeviceStore } from '../../stores/device';
import { useKeyboardStore } from '../../stores/keyboard';
import { usePerformanceStore } from '../../stores/performance';
import { useLightingStore } from '../../stores/lighting';
import { K61_LAYOUT } from '../../config/layout';
import service from '../../service';
import KeyboardPanel from './components/KeyboardPanel.vue';
import SettingPanel from './components/SettingPanel/index.vue';

const deviceStore = useDeviceStore();
const keyboardStore = useKeyboardStore();
const performanceStore = usePerformanceStore();
const lightingStore = useLightingStore();

const isTesting = ref(false);
const maxTravel = ref(0);
const activeKeyColors = reactive<Record<string, string>>({});
let timer: number | null = null;

// Derived State
const isInitialized = computed(() => keyboardStore.isInitialized);
const refreshKey = ref(0);

// Map KeyData[][] to number[][] for Keyboard component compatibility
const keyLayout = computed(() => {
  if (!keyboardStore.keyboard || keyboardStore.keyboard.length === 0) return [];
  return keyboardStore.keyboard.map(row => row.map(k => k.keyValue[0]));
});

// Force refresh when initialized
watch(isInitialized, (newVal) => {
  if (newVal) {
    refreshKey.value++;
  }
});

// Initialization Logic
const initData = async () => {
  if (deviceStore.currentDevice) {
    if (!keyboardStore.isInitialized) {
      await keyboardStore.init();
    }
    // Select all keys by default if none selected
    if (keyboardStore.selectedKeyList.length === 0) {
       keyboardStore.selectAll();
    }
    performanceStore.readConfigFromSelection();
    // Force refresh after manual init
    refreshKey.value++;
  }
};

onMounted(initData);

watch(() => deviceStore.currentDevice, (connected) => {
  if (connected) initData();
});

const handleKeyClick = ({ row, col }: { row: number, col: number }) => {
  // Toggle selection (multi-select behavior)
  keyboardStore.selectKey(row, col, true);
  performanceStore.readConfigFromSelection();
};

const applyConfig = async () => {
  await performanceStore.applyConfig();
};

// Test Mode Logic (Reused)
const toggleTest = async (e: Event) => {
  const checked = (e.target as HTMLInputElement).checked;
  isTesting.value = checked;
  (e.target as HTMLInputElement).blur();
  
  if (checked) {
    startPolling();
  } else {
    stopPolling();
  }
};

const startPolling = () => {
  if (timer) clearInterval(timer);
  
  const rows = lightingStore.lightAreas[0]?.row || deviceStore.deviceInfo?.row || 5;
  const cols = lightingStore.lightAreas[0]?.col || deviceStore.deviceInfo?.col || 14;

  timer = setInterval(async () => {
    try {
      const travelData = await service.getRealTimeTravel(rows, cols);
      const triggerData = await service.getKeyTriggerState(rows, cols);
      
      let currentMax = 0;
      let maxRow = -1;
      let maxCol = -1;
      
      travelData.forEach((rowVals, rIndex) => {
        rowVals.forEach((val, cIndex) => {
          const keyId = `${rIndex},${cIndex}`;
          
          // Check if valid key in keyboard store
          const key = keyboardStore.keyboard[rIndex]?.[cIndex];
          if (!key || key.keyValue[0] === 0) return;
          
          if (val > currentMax) {
            currentMax = val;
            maxRow = rIndex;
            maxCol = cIndex;
          }
          
          if (triggerData[rIndex] && triggerData[rIndex][cIndex] > 0) {
             activeKeyColors[keyId] = '#00ff00'; 
          } else if (val > 0.2) {
             const opacity = Math.min(val / 2.0, 1);
             activeKeyColors[keyId] = `rgba(0, 100, 255, ${opacity})`;
          } else {
             delete activeKeyColors[keyId];
          }
        });
      });
      
      maxTravel.value = currentMax;
      
    } catch (e) {
      console.error(e);
    }
  }, 50);
};

const stopPolling = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};

onUnmounted(() => {
  stopPolling();
  if (isTesting.value) {
    service.finishAdjusting();
  }
});
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
  /* background: #fff; */ /* Moved to SettingPanel content */
  /* border-radius: 12px; */
  /* overflow: hidden; */ 
  /* box-shadow: 0 4px 12px rgba(0,0,0,0.05); */
  min-height: 0;
  display: flex;
  flex-direction: column;
}
</style>