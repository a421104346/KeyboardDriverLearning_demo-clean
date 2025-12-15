<template>
  <div class="page-container">
    <div class="sidebar">
      <LightOptions 
        :config="lightingStore.lightConfig" 
        :selected-color="lightingStore.selectedColor"
        @update-config="lightingStore.updateConfig"
        @color-change="lightingStore.selectedColor = $event"
        @apply-all="applyColorToAll"
      />
      <div class="logs">
          <div v-for="(log, i) in deviceStore.logs" :key="i">{{ log }}</div>
      </div>
    </div>
    
    <div class="workspace">
      <Keyboard 
        :layout="K61_LAYOUT" 
        :key-layout="deviceStore.keyLayout"
        :key-colors="keyColors" 
        :selected-keys="selectedKeys"
        @key-click="handleKeyClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useDeviceStore } from '../stores/device';
import { useLightingStore } from '../stores/lighting';
import Keyboard from '../components/Keyboard.vue';
import LightOptions from '../components/LightOptions.vue';
import { K61_LAYOUT } from '../config/layout';

const deviceStore = useDeviceStore();
const lightingStore = useLightingStore();

const keyColors = reactive<Record<string, string>>({});
const selectedKeys = ref<string[]>([]);

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
  const rgb = hexToRgb(lightingStore.selectedColor);
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
};
</script>

<style scoped>
.page-container {
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
}

.sidebar {
  width: 340px;
  background: #181818;
  border-right: 1px solid #333;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
}

.workspace {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at center, #252525 0%, #121212 100%);
  position: relative;
  overflow: auto;
  padding: 40px;
}

.logs {
  flex: 1;
  background: #000;
  border-radius: 8px;
  padding: 10px;
  font-family: monospace;
  font-size: 0.8rem;
  color: #0f0;
  overflow-y: auto;
  max-height: 200px;
}
</style>

