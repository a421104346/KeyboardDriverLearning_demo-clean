<template>
  <div class="keyboard-container">
    <div class="keyboard-frame">
      <template v-for="(row, rowIndex) in layout" :key="rowIndex">
        <template v-for="(keyCap, colIndex) in row" :key="`${rowIndex}-${colIndex}`">
          <div 
            v-if="keyCap.w > 0 && keyCap.h > 0 && keyLayout[rowIndex]?.[colIndex] !== 0"
            class="key-unit"
            :class="{ 'key-selected': isSelected(rowIndex, colIndex) }"
            :style="getKeyStyle(keyCap)"
            @click="handleKeyClick(rowIndex, colIndex)"
          >
            <div class="key-cap" :style="{ backgroundColor: getKeyColor(rowIndex, colIndex) }">
              <!-- Custom Content Support -->
              <template v-if="getCustomContent(rowIndex, colIndex)">
                <img 
                  v-if="getCustomContent(rowIndex, colIndex)?.type === 'icon'" 
                  :src="getCustomContent(rowIndex, colIndex)?.value" 
                  class="custom-icon"
                />
                <div v-else class="key-legend">{{ getCustomContent(rowIndex, colIndex)?.value }}</div>
              </template>
              
              <!-- Standard Label Fallback -->
              <div v-else class="key-legend">{{ getLabel(rowIndex, colIndex) }}</div>
              
              <!-- Performance Mode: Show trigger values -->
              <div v-if="displayMode === 'performance' && keyPerformanceData" class="performance-overlay">
                <!-- Top-left: Trigger Point -->
                <div class="perf-value top-left">
                  {{ getPerformanceValue(rowIndex, colIndex, 'travel') }}
                </div>
                
                <!-- Bottom: RT values (if RT enabled) -->
                <div v-if="getPerformanceValue(rowIndex, colIndex, 'isRT')" class="perf-value bottom">
                  <span class="rt-press">{{ getPerformanceValue(rowIndex, colIndex, 'rtPress') }}</span>
                  <span class="rt-release">{{ getPerformanceValue(rowIndex, colIndex, 'rtRelease') }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getKeyLabel } from '../config/keymap';

const props = defineProps<{
  layout: any[]; // The nested array from k61.json
  keyLayout: number[][]; // Matrix from device (keyValue)
  keyColors: Record<string, string>; 
  selectedKeys: string[];
  keyPerformanceData?: any[][]; // Optional: performance data for each key
  displayMode?: string; // 'normal' | 'performance'
  customContent?: Record<string, { type: 'text' | 'icon', value: string }>; // New prop
}>();

const emit = defineEmits(['key-click']);

const UNIT_SIZE = 54;
const GAP = 4;

const getKeyStyle = (keyCap: any) => {
  return {
    left: `${keyCap.x * (UNIT_SIZE + GAP)}px`,
    top: `${keyCap.y * (UNIT_SIZE + GAP)}px`,
    width: `${keyCap.w * UNIT_SIZE + (keyCap.w - 1) * GAP}px`,
    height: `${keyCap.h * UNIT_SIZE + (keyCap.h - 1) * GAP}px`,
  };
};

const getKeyColor = (row: number, col: number) => {
  const keyId = `${row},${col}`;
  return props.keyColors[keyId] || '#333333';
};

const isSelected = (row: number, col: number) => {
  const keyId = `${row},${col}`;
  return props.selectedKeys.includes(keyId);
};

const getCustomContent = (row: number, col: number) => {
  if (!props.customContent) return null;
  return props.customContent[`${row},${col}`];
};

const getLabel = (row: number, col: number) => {
  const keyValue = props.keyLayout?.[row]?.[col];
  if (!keyValue) return '';
  return getKeyLabel(keyValue);
};

const handleKeyClick = (row: number, col: number) => {
  emit('key-click', { row, col });
};

const getPerformanceValue = (row: number, col: number, field: string) => {
  if (!props.keyPerformanceData) return '';
  const data = props.keyPerformanceData[row]?.[col];
  if (!data) return '';
  
  const value = data[field];
  if (field === 'isRT') return value; // boolean
  if (typeof value === 'number') return value.toFixed(1);
  return '';
};
</script>

<style scoped>
.keyboard-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  background: #1a1a1a;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  overflow-x: auto;
  min-height: 400px;
}

.keyboard-frame {
  position: relative;
  width: 900px; 
  height: 300px;
  transform-origin: center;
}

.key-unit {
  position: absolute;
  box-sizing: border-box;
  transition: transform 0.1s ease;
  cursor: pointer;
}

.key-unit:active {
  transform: scale(0.95);
}

.key-cap {
  width: calc(100% - 6px);
  height: calc(100% - 6px);
  margin: 3px;
  background-color: #333;
  border-radius: 6px;
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #ccc;
  font-size: 12px;
  font-weight: 600;
  user-select: none;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}

.key-legend {
  font-size: 14px;
}

.custom-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
  /* Make icons white for dark keycaps. 
     brightness(0) turns it black, invert(1) turns it white. 
     This ensures consistency regardless of original SVG color. */
  filter: brightness(0) invert(1);
  opacity: 0.9;
}

.key-selected .key-cap {
  border-color: #fff;
  box-shadow: 0 0 8px rgba(255,255,255,0.5);
}

.key-unit:hover .key-cap {
  filter: brightness(1.2);
}

/* Performance Overlay */
.performance-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
}

.perf-value {
  position: absolute;
  padding: 2px 4px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 3px;
}

.perf-value.top-left {
  top: 2px;
  left: 2px;
  color: #4CAF50;
}

.perf-value.bottom {
  bottom: 2px;
  left: 2px;
  right: 2px;
  display: flex;
  justify-content: space-between;
  font-size: 9px;
}

.rt-press {
  color: #2196F3;
}

.rt-release {
  color: #FF9800;
}
</style>
