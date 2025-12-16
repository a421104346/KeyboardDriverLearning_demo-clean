<template>
  <div class="layer-panel fn1-style">
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

// Use glob import with absolute path to ensure matching
const icons = import.meta.glob('/src/assets/images/KeyIcon/**/*.svg', { eager: true, import: 'default' });

const getIcon = (path: string) => {
  const fullPath = `/src/assets/images/KeyIcon/${path}`;
  const icon = icons[fullPath];
  if (!icon) {
    console.warn(`Icon not found: ${fullPath}`);
    // Debug: print available keys
    // console.log('Available icons:', Object.keys(icons));
    return '';
  }
  return icon as string;
};

const customContent = computed(() => {
  const map: Record<string, { type: 'text' | 'icon', value: string }> = {};
  
  if (!props.layout) return map;

  // Row 0
  map['0,0'] = { type: 'icon', value: getIcon('kb control/54022_CheckTheBatteryLevel.svg') };
  for(let i=1; i<=12; i++) {
     map[`0,${i}`] = { type: 'text', value: `F${i}` };
  }
  
  // Icons
  map['1,13'] = { type: 'icon', value: getIcon('rgb/55301_MainLightBrightness+.svg') }; 
  map['1,11'] = { type: 'icon', value: getIcon('rgb/55299_MainLightMode.svg') };
  map['1,12'] = { type: 'icon', value: getIcon('rgb/55300_MainLightColorPalette.svg') };
  map['2,13'] = { type: 'icon', value: getIcon('rgb/55302_MainLightBrightness-.svg') };
  map['3,13'] = { type: 'icon', value: getIcon('rgb/55304_MainLightSpeed-.svg') };
  map['4,13']  = { type: 'icon', value: getIcon('rgb/55303_MainLightSpeed+.svg') };

  // Set everything else to blank
  props.layout.forEach((row: any[], rIndex: number) => {
    row.forEach((_col: any, cIndex: number) => {
      const key = `${rIndex},${cIndex}`;
      if (!map[key]) {
        map[key] = { type: 'text', value: '' };
      }
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
