<template>
  <div class="setting-container">
    <!-- Navigation Sidebar/TabBar -->
    <div class="nav-bar-wrapper">
      <div class="nav-bar">
        <div 
          v-for="tab in tabs" 
          :key="tab.id"
          class="nav-item"
          :class="{ active: currentTab === tab.id }"
          @click="currentTab = tab.id"
        >
          {{ tab.label }}
        </div>
      </div>
    </div>

    <!-- Content Area -->
    <div class="content-panel">
      <RapidTriggerPanel 
        v-if="currentTab === 'rapid-trigger'"
        :is-testing="isTesting"
        :max-travel="maxTravel"
        :is-loading="isLoading"
        :is-loaded="isLoaded"
        @toggle-test="$emit('toggle-test', $event)"
        @apply-config="$emit('apply-config')"
      />
      
      <PerformancePresetPanel v-else-if="currentTab === 'preset'" />
      
      <SwitchPanel v-else-if="currentTab === 'switch'" />
      
      <CalibrationPanel v-else-if="currentTab === 'calibration'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import RapidTriggerPanel from './RapidTriggerPanel.vue';
import PerformancePresetPanel from './PerformancePresetPanel.vue';
import SwitchPanel from './SwitchPanel.vue';
import CalibrationPanel from './CalibrationPanel.vue';

// Define props to match the original SettingPanel interface
const props = defineProps<{
  isTesting: boolean;
  maxTravel: number;
  isLoading: boolean;
  isLoaded: boolean;
}>();

const emit = defineEmits(['toggle-test', 'apply-config']);

const currentTab = ref('rapid-trigger');

const tabs = [
  { id: 'rapid-trigger', label: 'Rapid Trigger' },
  { id: 'preset', label: 'Performance Preset' },
  { id: 'switch', label: 'Switch Selection' },
  { id: 'calibration', label: 'Calibration' }
];
</script>

<style scoped>
.setting-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px; /* Space between nav and content */
}

.nav-bar-wrapper {
  /* No absolute positioning */
  padding-left: 10px; /* Optional alignment */
}

.nav-bar {
  display: inline-flex;
  background: #fff;
  border-radius: 8px;
  padding: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  gap: 4px;
}

.nav-item {
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #666;
  transition: all 0.2s;
  user-select: none;
}

.nav-item:hover {
  background: #f5f5f5;
  color: #333;
}

.nav-item.active {
  background: #222; /* Dark background for active state */
  color: #fff;
}

.content-panel {
  flex: 1;
  background: #fff; /* White card background */
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  height: 100%;
  position: relative;
  min-height: 0; /* Allow scrolling inside */
}
</style>