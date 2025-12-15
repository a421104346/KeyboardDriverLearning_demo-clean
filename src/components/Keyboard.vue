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
              <div class="key-legend">{{ getLabel(rowIndex, colIndex) }}</div>
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

const getLabel = (row: number, col: number) => {
  const keyValue = props.keyLayout?.[row]?.[col];
  if (!keyValue) return '';
  return getKeyLabel(keyValue);
};

const handleKeyClick = (row: number, col: number) => {
  emit('key-click', { row, col });
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

.key-selected .key-cap {
  border-color: #fff;
  box-shadow: 0 0 8px rgba(255,255,255,0.5);
}

.key-unit:hover .key-cap {
  filter: brightness(1.2);
}
</style>
