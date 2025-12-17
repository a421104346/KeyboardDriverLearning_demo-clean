<template>
  <div 
    class="key-item" 
    draggable="true" 
    @dragstart="handleDragStart"
    :title="keyLabel"
  >
    <img v-if="iconPath" :src="iconPath" :alt="keyLabel" class="key-icon" />
    <span v-else>{{ keyLabel }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getKeyLabel } from '@/config/keymap';

const props = defineProps<{
  keyData: {
    value?: number;
    name?: string;
    label?: string;
    icon?: string;
    type?: string;
  };
}>();

// Load all SVG icons eagerly
const iconModules = import.meta.glob('/src/assets/images/KeyIcon/**/*.svg', { eager: true, import: 'default' });

const keyLabel = computed(() => {
  if (props.keyData.label) return props.keyData.label;
  if (props.keyData.value) return getKeyLabel(props.keyData.value);
  return '';
});

const iconPath = computed(() => {
  if (props.keyData.icon && props.keyData.type) {
    const folder = props.keyData.type === 'media' ? 'media' : 'mouse';
    // Construct the path key to look up in iconModules
    const pathKey = `/src/assets/images/KeyIcon/${folder}/${props.keyData.icon}`;
    return (iconModules[pathKey] as string) || null;
  }
  return null;
});

const handleDragStart = (e: DragEvent) => {
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/plain', JSON.stringify({ 
      keyValue: props.keyData.value || 0,
    }));
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

.key-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
  /* Filter to match design (dark icons) */
  filter: invert(0.8) sepia(0) saturate(0) hue-rotate(0deg) brightness(0.8) contrast(1.2);
}

.key-item:hover .key-icon {
  filter: invert(0) sepia(0) saturate(0) hue-rotate(0deg) brightness(0) contrast(1);
}
</style>
