<template>
  <div class="keyboard-panel-container">
    <div class="layer-switcher">
      <div class="switcher-capsule">
        <div class="layer-label">Layer</div>
        <button 
          v-for="(layer, index) in layers" 
          :key="index"
          :class="{ active: currentLayer === index }"
          @click="$emit('update:currentLayer', index)"
        >
          {{ layer }}
        </button>
      </div>
    </div>

    <div class="panel-content">
      <component 
        :is="activeComponent"
        :has-layout="hasLayout"
        :layout="layout"
        :key-layout="keyLayout"
        :key-colors="keyColors"
        :selected-keys="selectedKeys"
        @key-click="$emit('key-click', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import StandardLayerPanel from './components/StandardLayerPanel.vue';
import Fn1LayerPanel from './components/Fn1LayerPanel.vue';
import Fn2LayerPanel from './components/Fn2LayerPanel.vue';
import Fn3LayerPanel from './components/Fn3LayerPanel.vue';

const props = defineProps<{
  currentLayer: number;
  hasLayout: boolean;
  layout: any;
  keyLayout: any[][];
  keyColors: Record<string, string>;
  selectedKeys: string[];
}>();

defineEmits(['key-click', 'update:currentLayer']);

const layers = ['Main', 'Fn1', 'Fn2', 'Fn3'];

const activeComponent = computed(() => {
  switch (props.currentLayer) {
    case 0: return StandardLayerPanel;
    case 1: return Fn1LayerPanel;
    case 2: return Fn2LayerPanel;
    case 3: return Fn3LayerPanel;
    default: return StandardLayerPanel;
  }
});
</script>

<style scoped>
.keyboard-panel-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  position: relative;
  justify-content: center;
  align-items: center;
}

.panel-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.layer-switcher {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0;
  margin-right: 20px;
}

.switcher-capsule {
  background: #fff;
  border-radius: 30px;
  padding: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  gap: 4px;
}

.layer-label {
  padding: 8px 0;
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
  text-align: center;
  width: 100%;
}

.switcher-capsule button {
  padding: 6px 16px;
  border: none;
  background: transparent;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
  color: #666;
  transition: all 0.2s;
}

.switcher-capsule button:hover {
  background: #f5f5f5;
  color: #333;
}

.switcher-capsule button.active {
  background: #000;
  color: #fff;
}
</style>

