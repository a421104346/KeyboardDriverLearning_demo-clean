<template>
  <div class="keyboard-panel">
    <Keyboard 
      v-if="hasLayout"
      :layout="layout"
      :key-layout="keyLayout" 
      :key-colors="keyColors" 
      :selected-keys="selectedKeys"
      display-mode="assignment"
      @key-click="$emit('key-click', $event)"
    />
    <div v-else class="loading">Loading...</div>
  </div>
</template>

<script setup lang="ts">
import Keyboard from '../../../components/Keyboard.vue';

defineProps<{
  hasLayout: boolean;
  layout: any;
  keyLayout: any[][];
  keyColors: Record<string, string>;
  selectedKeys: string[];
}>();

defineEmits(['key-click']);
</script>

<style scoped>
.keyboard-panel {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
</style>
