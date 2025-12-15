<template>
  <div class="keyboard-panel">
    <div class="workspace">
      <Keyboard 
        v-if="hasLayout"
        :layout="layout"
        :key-layout="keyLayout" 
        :key-colors="keyColors" 
        :selected-keys="selectedKeys"
        :key-performance-data="keyPerformanceData"
        display-mode="performance"
      />
      <div v-else class="loading">
        Loading keyboard layout...
      </div>
    </div>
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
  keyPerformanceData: any[][];
}>();
</script>

<style scoped>
.keyboard-panel {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 20px;
}

.workspace {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading {
  color: #666;
  font-size: 1.2em;
}
</style>
