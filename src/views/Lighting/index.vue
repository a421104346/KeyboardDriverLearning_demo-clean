<template>
  <div class="page-container">
    <div class="content-wrapper">
      <div class="keyboard-wrapper">
        <KeyboardPanel 
          :layout="K61_LAYOUT" 
          :key-layout="deviceStore.keyLayout"
          :key-colors="keyColors" 
          :selected-keys="selectedKeys"
          @key-click="handleKeyClick"
        />
      </div>
      
      <div class="setting-wrapper">
        <SettingPanel @apply-all="applyColorToAll" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import { useDeviceStore } from '../../stores/device';
import { useLightingStore } from '../../stores/lighting';
import { K61_LAYOUT } from '../../config/layout';
import KeyboardPanel from './components/KeyboardPanel.vue';
import SettingPanel from './components/SettingPanel.vue';

const deviceStore = useDeviceStore();
const lightingStore = useLightingStore();

const keyColors = reactive<Record<string, string>>({});
const selectedKeys = ref<string[]>([]);

const loadConfig = async () => {
  if (deviceStore.connectedDevice) {
    await lightingStore.readConfig();
  }
};

onMounted(() => {
  loadConfig();
});

watch(() => deviceStore.connectedDevice, (newDevice) => {
  if (newDevice) {
    loadConfig();
  }
});

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

const handleKeyClick = async (coords: { row: number, col: number }) => {
  if (!deviceStore.connectedDevice) return;
  
  // 检查当前模式：只有 Static/Custom (mode 0) 才能设置单个键的 RGB
  const currentMode = lightingStore.lightConfig.mode;
  if (currentMode !== 0) {
    deviceStore.addLog(`Cannot set key color in mode ${currentMode}. Please switch to Static/Custom mode first.`);
    return;
  }
  
  const keyId = `${coords.row},${coords.col}`;
  keyColors[keyId] = lightingStore.selectedColor;

  const rgb = hexToRgb(lightingStore.selectedColor);
  const point = {
    position: { row: coords.row, col: coords.col },
    rgb: rgb
  };
  await lightingStore.setRGB([point]);
};

const applyColorToAll = async () => {
  if (!deviceStore.connectedDevice) return;
  
  const currentMode = lightingStore.lightConfig.mode;
  const rgb = hexToRgb(lightingStore.selectedColor);

  // If Static/Custom Mode (0), use setRGB
  if (currentMode === 0) {
    const points: any[] = [];
    
    // Iterate based on actual keyLayout matrix from device
    deviceStore.keyLayout.forEach((row, rIndex) => {
      row.forEach((keyValue, cIndex) => {
        if (keyValue === 0) return; // Skip empty keys
        points.push({
          position: { row: rIndex, col: cIndex },
          rgb: rgb
        });
        keyColors[`${rIndex},${cIndex}`] = lightingStore.selectedColor;
      });
    });

    await lightingStore.setRGB(points);
  } else {
    // If Dynamic Mode, update Color Panel instead
    // This allows changing color without changing the motion mode
    
    // Create a panel with the selected color repeated (typically 8 slots)
    // We fill all slots to ensure consistency regardless of which slot the mode uses
    const newPanel = Array(8).fill(rgb);
    
    await lightingStore.setColorPanel(newPanel);
    
    // Also ensure we are using the first color slot
    // Some modes might cycle through colors, but for single-color dynamic modes, this sets the base color
    await lightingStore.setColorID(0);
    
    // Update local key colors just for visual feedback (optional)
    deviceStore.keyLayout.forEach((row, rIndex) => {
      row.forEach((keyValue, cIndex) => {
        if (keyValue === 0) return;
        keyColors[`${rIndex},${cIndex}`] = lightingStore.selectedColor;
      });
    });
    
    deviceStore.addLog(`Applied color to Dynamic Mode ${currentMode}`);
  }
};
</script>

<style scoped>
.page-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: #f0f2f5; /* Light gray background like the screenshot */
  display: flex;
  justify-content: center;
}

/* Dark mode override if the app is dark */
:global(body) {
  background-color: #f0f2f5;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1600px; /* Max width to prevent too wide on large screens */
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  gap: 20px; /* Space between keyboard and settings */
}

.keyboard-wrapper {
  flex: 0 0 auto;
  height: 45%;
  background: transparent; /* Or a card background if desired */
  border-radius: 12px;
  overflow: hidden;
  /* box-shadow: 0 4px 12px rgba(0,0,0,0.1); */
}

.setting-wrapper {
  flex: 1;
  background: #fff; /* White card background */
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  min-height: 0; /* Important for flex child scrolling */
}
</style>
