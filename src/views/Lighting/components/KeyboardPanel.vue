<template>
  <div class="keyboard-panel">
    <Keyboard 
      :layout="layout" 
      :key-layout="keyLayout"
      :key-colors="displayKeyColors" 
      :selected-keys="selectedKeys"
      @key-click="onKeyClick"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Keyboard from '../../../components/Keyboard.vue';

const props = defineProps<{
  layout: any;
  keyLayout: any[][];
  keyColors: Record<string, string>;
  selectedKeys: string[];
}>();

const displayKeyColors = computed(() => {
  const colors: Record<string, string> = {};
  for (const key in props.keyColors) {
    const color = props.keyColors[key];
    // If color is black (LED off), use default keycap color (#333)
    if (color === '#000000') {
      colors[key] = '#333333';
    } else {
      colors[key] = color;
    }
  }
  return colors;
});

const emit = defineEmits(['key-click']);

const onKeyClick = (coords: { row: number, col: number }) => {
  emit('key-click', coords);
};
</script>

<style scoped>
.keyboard-panel {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  /* background: radial-gradient(circle at center, #252525 0%, #121212 100%);  Removed for transparency */
  position: relative;
  overflow: hidden;
  padding: 20px;
  /* border-bottom: 1px solid #333; Removed */
}
</style>
