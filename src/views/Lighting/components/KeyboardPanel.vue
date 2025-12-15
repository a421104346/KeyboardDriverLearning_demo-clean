<template>
  <div class="keyboard-panel">
    <Keyboard 
      :layout="layout" 
      :key-layout="keyLayout"
      :key-colors="keyColors" 
      :selected-keys="selectedKeys"
      @key-click="onKeyClick"
    />
  </div>
</template>

<script setup lang="ts">
import Keyboard from '../../../components/Keyboard.vue';

defineProps<{
  layout: any;
  keyLayout: any[][];
  keyColors: Record<string, string>;
  selectedKeys: string[];
}>();

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
