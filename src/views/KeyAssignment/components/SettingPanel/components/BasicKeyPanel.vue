<template>
  <div class="key-grid-container">
    <div class="keyboard-layout">
      <div v-for="(row, rIndex) in basicKeyRows" :key="rIndex" class="keyboard-row">
        <div 
          v-for="key in row" 
          :key="key" 
          class="assignable-key"
          :style="getKeyStyle(key)"
          @click="$emit('select-key', key)"
        >
          {{ key }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const basicKeyRows = [
  ['ESC', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'],
  ['~', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
  ['Caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'Enter'],
  ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift'],
  ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Fn', 'Ctrl']
];

const getKeyStyle = (key: string) => {
  const baseWidth = 40;
  let width = baseWidth;
  
  switch (key) {
    case 'Backspace': width = baseWidth * 2; break;
    case 'Tab': width = baseWidth * 1.5; break;
    case '\\': width = baseWidth * 1.5; break;
    case 'Caps': width = baseWidth * 1.75; break;
    case 'Enter': width = baseWidth * 2.25; break;
    case 'Shift': width = baseWidth * 2.25; break; // Left Shift
    case 'Space': width = baseWidth * 6.25; break;
    case 'Ctrl':
    case 'Win':
    case 'Alt':
    case 'Fn': 
      width = baseWidth * 1.25; break;
  }

  // Adjust Right Shift slightly
  if (key === 'Shift') {
     width = baseWidth * 2.4; 
  }

  return {
    width: `${width}px`,
    flexGrow: key === 'Space' ? 0 : 0
  };
};

defineEmits(['select-key']);
</script>

<style scoped>
.key-grid-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.keyboard-layout {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px 0;
}

.keyboard-row {
  display: flex;
  gap: 6px;
  justify-content: center;
}

.assignable-key {
  height: 40px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.85rem;
  color: #333;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  transition: all 0.2s;
  user-select: none;
}

.assignable-key:hover {
  border-color: #2196F3;
  color: #2196F3;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(33, 150, 243, 0.1);
}
</style>

