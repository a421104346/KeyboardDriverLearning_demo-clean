<template>
  <div class="control-key-panel">
    <div class="key-grid">
      <div 
        v-for="item in controlKeys" 
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
const controlKeys = [
  { label: 'Restart', name: 'Restart', icon: '54017_Restart.svg' },
  { label: 'Factory Reset', name: 'Reset', icon: '54018_Recovery.svg' },
  { label: 'Switch System', name: 'Switch Sys', icon: '54019_ChangeSystem.svg' },
  { label: 'Adjusting', name: 'Adjusting', icon: '54020_Adjusting.svg' },
  { label: 'Web On/Off', name: 'Web', icon: '54021_WebOnOrOff.svg' },
  { label: 'Battery Level', name: 'Battery', icon: '54022_CheckTheBatteryLevel.svg' },
  { label: 'Change Config', name: 'Config', icon: '54273_ChnageConfig.svg' },
  { label: 'Win Lock', name: 'WinLock', icon: '54274_WinLock.svg' },
  { label: 'Polling Rate', name: 'Rate', icon: '54275_ChangeRateOfReturn.svg' },
  { label: 'All Key Lock', name: 'Lock All', icon: '54276_AllKeyLock.svg' },
  { label: 'RT Switch', name: 'RT Toggle', icon: '54277_RTSwitch.svg' },
];

const getIconPath = (filename: string) => {
  // Path needs to be correct relative to this file location
  // This file is in: src/views/KeyAssignment/components/SettingPanel/components/
  // Assets are in: src/assets/images/KeyIcon/kb control/
  // So we need to go up 5 levels: ../../../../../assets
  return new URL(`../../../../../assets/images/KeyIcon/kb control/${filename}`, import.meta.url).href;
};

defineEmits(['select-key']);
</script>

<style scoped>
.control-key-panel {
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
  /* Invert white icons to dark */
  filter: invert(0.8) sepia(0) saturate(0) hue-rotate(0deg) brightness(0.8) contrast(1.2);
}

.key-item:hover .key-icon {
  opacity: 1;
  filter: invert(0) sepia(0) saturate(0) hue-rotate(0deg) brightness(0) contrast(1);
}
</style>
