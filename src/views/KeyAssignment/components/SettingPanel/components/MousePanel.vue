<template>
  <div class="mouse-key-panel">
    <div class="key-grid">
      <div 
        v-for="item in mouseKeys" 
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
const mouseKeys = [
  { label: 'Mouse Up', name: 'Mouse Up', icon: '6657_MouseUp.svg' },
  { label: 'Mouse Down', name: 'Mouse Down', icon: '6658_MouseDown.svg' },
  { label: 'Mouse Left', name: 'Mouse Left', icon: '6659_MouseLeft.svg' },
  { label: 'Mouse Right', name: 'Mouse Right', icon: '6660_MouseRight.svg' },
  { label: 'Wheel Up', name: 'Wheel Up', icon: '6661_MouseWheelUp.svg' },
  { label: 'Wheel Down', name: 'Wheel Down', icon: '6662_MouseWheelDown.svg' },
  { label: 'Left Click', name: 'Left Click', icon: '6663_MouseLeftClick.svg' },
  { label: 'Right Click', name: 'Right Click', icon: '6664_MouseRightClick.svg' },
  { label: 'Middle Click', name: 'Middle Click', icon: '6665_MouseMiddleClick.svg' },
  { label: 'Scroll Up', name: 'Scroll Up', icon: '6666_MouseScrollUp.svg' },
  { label: 'Scroll Down', name: 'Scroll Down', icon: '6667_MouseScrollDown.svg' },
];

const getIconPath = (filename: string) => {
  return new URL(`../../../../../assets/images/KeyIcon/mouse/${filename}`, import.meta.url).href;
};

defineEmits(['select-key']);
</script>

<style scoped>
.mouse-key-panel {
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
