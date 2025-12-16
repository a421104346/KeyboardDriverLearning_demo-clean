<template>
  <div class="layer-panel fn3-style">
    <Keyboard 
      v-if="hasLayout"
      :layout="layout"
      :key-layout="keyLayout" 
      :key-colors="keyColors" 
      :selected-keys="selectedKeys"
      display-mode="assignment"
      :custom-content="customContent"
      @key-click="$emit('key-click', $event)"
    />
    <div v-else class="loading">Loading...</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Keyboard from '../../../../../components/Keyboard.vue';

const props = defineProps<{
  hasLayout: boolean;
  layout: any[];
  keyLayout: any[][];
  keyColors: Record<string, string>;
  selectedKeys: string[];
}>();

defineEmits(['key-click']);

const customContent = computed(() => {
  const map: Record<string, { type: 'text' | 'icon', value: string }> = {};
  
  if (!props.layout) return map;

  // Set all keys to blank
  props.layout.forEach((row: any[], rIndex: number) => {
    row.forEach((_col: any, cIndex: number) => {
      const key = `${rIndex},${cIndex}`;
      map[key] = { type: 'text', value: '' };
    });
  });

  return map;
});
</script>

<style scoped>
.layer-panel {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
