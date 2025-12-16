<template>
  <div class="rgb-key-panel">
    <div class="key-grid">
      <div 
        v-for="item in rgbKeys" 
        :key="item.name" 
        class="key-item"
        @click="$emit('select-key', item.name)"
        :title="item.label"
      >
        <img :src="getIconPath(item.icon)" :alt="item.label" class="key-icon" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const rgbKeys = [
  { label: 'Light Power', name: 'Light Power', icon: '55296_MainLightPowerSwitch.svg' },
  { label: 'Light Switch', name: 'Light Switch', icon: '55297_MainLightSwitch.svg' },
  { label: 'Direction', name: 'Direction', icon: '55298_MainLightDirection.svg' },
  { label: 'Mode', name: 'Mode', icon: '55299_MainLightMode.svg' },
  { label: 'Color Palette', name: 'Color', icon: '55300_MainLightColorPalette.svg' },
  { label: 'Brightness +', name: 'Bright+', icon: '55301_MainLightBrightness+.svg' },
  { label: 'Brightness -', name: 'Bright-', icon: '55302_MainLightBrightness-.svg' },
  { label: 'Speed +', name: 'Speed+', icon: '55303_MainLightSpeed+.svg' },
  { label: 'Speed -', name: 'Speed-', icon: '55304_MainLightSpeed-.svg' },
];

const getIconPath = (filename: string) => {
  return new URL(`../../../../../assets/images/KeyIcon/rgb/${filename}`, import.meta.url).href;
};

defineEmits(['select-key']);
</script>

<style scoped>
.rgb-key-panel {
  width: 100%;
  padding: 10px 0;
  display: flex;
  justify-content: center;
}

.key-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  max-width: 1200px;
}

.key-item {
  width: 50px;
  height: 50px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

.key-item:hover {
  border-color: #2196F3;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(33, 150, 243, 0.15);
}

.key-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
  opacity: 0.7;
  transition: opacity 0.2s;
  filter: invert(0.8) sepia(0) saturate(0) hue-rotate(0deg) brightness(0.8) contrast(1.2);
}

.key-item:hover .key-icon {
  opacity: 1;
  filter: invert(0) sepia(0) saturate(0) hue-rotate(0deg) brightness(0) contrast(1);
}
</style>
