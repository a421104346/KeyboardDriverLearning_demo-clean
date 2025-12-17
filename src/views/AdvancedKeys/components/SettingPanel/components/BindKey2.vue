<template>
  <div 
    class="bind-key2" 
    :class="{ 'has-value': keyValue !== 0, 'is-hovered': isHovered }"
    @dragover.prevent
    @dragenter.prevent="isHovered = true"
    @dragleave="isHovered = false"
    @drop="handleDrop"
  >
    <div class="bind-key2__content">
      {{ displayText }}
    </div>

    <!-- Clear Button -->
    <div v-if="keyValue !== 0" class="bind-key2__clear" @click.stop="$emit('clear')">
      <span>×</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { getKeyLabel } from '@/config/keymap';

const props = defineProps<{
  keyValue: number;
}>();

const emit = defineEmits(['clear', 'key-drop']);

const isHovered = ref(false);

const displayText = computed(() => {
  if (props.keyValue === 0) return '无';
  return getKeyLabel(props.keyValue);
});

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  isHovered.value = false;
  
  if (e.dataTransfer) {
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (data && typeof data.keyValue === 'number') {
        emit('key-drop', data.keyValue);
      }
    } catch (err) {
      console.error('Invalid drag data', err);
    }
  }
};
</script>

<style scoped>
.bind-key2 {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 56px;
  height: 56px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.bind-key2.is-hovered {
  border-color: #2196F3;
  background-color: #f0f7ff;
  border-style: dashed;
}

.bind-key2:hover {
  border-color: #2196F3;
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
}

.bind-key2.has-value {
  border-color: #333;
  background-color: #f5f5f5;
}

.bind-key2__content {
  color: #333;
  font-size: 14px;
  font-weight: 500;
  user-select: none;
}

.bind-key2__clear {
  position: absolute;
  top: -8px;
  right: -8px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #f44336;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 2;
  opacity: 0;
  transform: scale(0.8);
}

.bind-key2:hover .bind-key2__clear {
  opacity: 1;
  transform: scale(1);
}

.bind-key2__clear span {
  color: #fff;
  font-size: 14px;
  line-height: 1;
}

.bind-key2__clear:hover {
  background-color: #d32f2f;
  transform: scale(1.1);
}
</style>
