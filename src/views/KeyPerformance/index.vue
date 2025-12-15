<template>
  <div class="page-container">
    <div class="content-wrapper">
      <div class="keyboard-wrapper">
        <KeyboardPanel 
          :has-layout="deviceStore.keyLayout.length > 0"
          :layout="K61_LAYOUT"
          :key-layout="deviceStore.keyLayout" 
          :key-colors="activeKeyColors" 
          :selected-keys="[]"
          :key-performance-data="performanceStore.keyPerformanceData"
        />
      </div>
      
      <div class="setting-wrapper">
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
import { ref, reactive, onUnmounted, onMounted, watch } from 'vue';
import { useDeviceStore } from '../../stores/device';
import { useLightingStore } from '../../stores/lighting';
import { usePerformanceStore } from '../../stores/performance';
import { K61_LAYOUT } from '../../config/layout';
import service from '../../service';
import KeyboardPanel from './components/KeyboardPanel.vue';
import SettingPanel from './components/SettingPanel.vue';

const deviceStore = useDeviceStore();
const lightingStore = useLightingStore();
const performanceStore = usePerformanceStore();

const isTesting = ref(false);
const maxTravel = ref(0);
const activeKeyColors = reactive<Record<string, string>>({});
const lastTriggered = ref<{row: number, col: number} | null>(null);
let timer: number | null = null;
const hasLoadedConfig = ref(false);

// Load config when keyLayout is ready
const loadPerformanceConfig = async () => {
  // Only load if device is connected and keyLayout is loaded
  if (!deviceStore.connectedDevice || !deviceStore.keyLayout || deviceStore.keyLayout.length === 0) {
    return;
  }
  
  // Prevent duplicate loading (only if already successfully loaded)
  if (hasLoadedConfig.value && performanceStore.isLoaded) {
    return;
  }
  
  try {
    await performanceStore.readConfig();
    // Only mark as loaded if readConfig succeeded (isLoaded will be set by the store)
    if (performanceStore.isLoaded) {
      hasLoadedConfig.value = true;
      console.log('[KeyPerformance] Config loaded in view:', performanceStore.config);
      // Load all keys' performance data for display
      await performanceStore.readAllKeysPerformance();
    } else {
      console.warn('[KeyPerformance] readConfig did not set isLoaded=true');
    }
  } catch (e) {
    console.error('Failed to load performance config:', e);
    hasLoadedConfig.value = false; // Reset on error
  }
};

// Watch config changes for debugging
watch(
  () => performanceStore.config.travel,
  (newVal) => {
    console.log('[KeyPerformance] Config.travel changed to:', newVal);
  },
  { immediate: true }
);

// Watch for keyLayout changes (when device connects)
watch(
  () => [deviceStore.connectedDevice, deviceStore.keyLayout],
  ([connected, layout]) => {
    // Reset flag when device disconnects
    if (!connected) {
      hasLoadedConfig.value = false;
      return;
    }
    
    // Load when device is connected and layout is ready
    if (connected && layout && (layout as number[][]).length > 0) {
      loadPerformanceConfig();
    }
  },
  { immediate: true }
);

// Also try to load on mount if already connected
onMounted(async () => {
  await loadPerformanceConfig();
});

const applyConfig = async () => {
  await performanceStore.applyConfig();
};

const toggleTest = async (e: Event) => {
  const checked = (e.target as HTMLInputElement).checked;
  isTesting.value = checked;
  
  // Immediately blur to prevent Space key from re-toggling
  (e.target as HTMLInputElement).blur();
  
  if (checked) {
    // Don't call service.startAdjusting() - that's for calibration mode
    // which triggers firmware LED takeover.
    // Just start polling directly for key press testing.
    startPolling();
  } else {
    stopPolling();
  }
};

const startPolling = () => {
  if (timer) clearInterval(timer);
  
  // Use detected rows/cols or default
  const rows = lightingStore.lightAreas[0]?.row || deviceStore.deviceInfo?.row || 5;
  const cols = lightingStore.lightAreas[0]?.col || deviceStore.deviceInfo?.col || 14;

  timer = setInterval(async () => {
    try {
      const travelData = await service.getRealTimeTravel(rows, cols);
      const triggerData = await service.getKeyTriggerState(rows, cols);
      
      let currentMax = 0;
      let maxRow = -1;
      let maxCol = -1;
      
      // Only update keys that are valid in the layout (keyValue != 0)
      travelData.forEach((rowVals, rIndex) => {
        rowVals.forEach((val, cIndex) => {
          const keyId = `${rIndex},${cIndex}`;
          
          // Check if this key is valid in the layout
          const isValidKey = deviceStore.keyLayout?.[rIndex]?.[cIndex] !== 0;
          if (!isValidKey) return; // Skip empty keys
          
          if (val > currentMax) {
            currentMax = val;
            maxRow = rIndex;
            maxCol = cIndex;
          }
          
          // Color logic:
          // Triggered (triggerData[r][c] > 0): Green
          // Pressed (val > 0.1): Blue scale
          
          if (triggerData[rIndex] && triggerData[rIndex][cIndex] > 0) {
             activeKeyColors[keyId] = '#00ff00'; // Triggered
             lastTriggered.value = { row: rIndex, col: cIndex };
          } else if (val > 0.2) {
             // Calculate opacity based on travel
             const opacity = Math.min(val / 2.0, 1);
             activeKeyColors[keyId] = `rgba(0, 100, 255, ${opacity})`;
          } else {
             delete activeKeyColors[keyId];
          }
        });
      });
      
      maxTravel.value = currentMax;
      if (maxRow >= 0 && maxCol >= 0) {
        console.log(`Max travel at (${maxRow},${maxCol}): ${currentMax.toFixed(2)}mm`);
      }
      
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
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  min-height: 0;
}
</style>
