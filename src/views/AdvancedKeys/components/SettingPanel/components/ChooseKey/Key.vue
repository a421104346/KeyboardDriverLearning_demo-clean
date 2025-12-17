<template>
  <div 
    class="key-item" 
    draggable="true" 
    @dragstart="handleDragStart"
  >
    {{ keyLabel }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getKeyLabel } from '@/config/keymap';

const props = defineProps<{
  keyValue: number;
}>();

const keyLabel = computed(() => {
  return getKeyLabel(props.keyValue);
});

const handleDragStart = (e: DragEvent) => {
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/plain', JSON.stringify({ keyValue: props.keyValue }));
  }
};
</script>

<style scoped>
.key-item {
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: grab;
  font-size: 0.85rem;
  color: #333;
  transition: all 0.2s;
  user-select: none;
}

.key-item:hover {
  border-color: #2196F3;
  color: #2196F3;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.1);
}

.key-item:active {
  cursor: grabbing;
}
</style>

