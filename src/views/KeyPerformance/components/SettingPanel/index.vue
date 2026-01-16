<template>
  <div class="setting-container">
    <!-- Navigation Sidebar/TabBar -->
    <div class="nav-bar-wrapper">
      <div class="nav-bar">
        <div class="nav-indicator" :style="indicatorStyle"></div>
        <div 
          v-for="(tab, index) in tabs" 
          :key="tab.id"
          :ref="el => setTabRef(el, index)"
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
      <transition name="panel-fade" mode="out-in">
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
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue';
import RapidTriggerPanel from './components/RapidTriggerPanel.vue';
import PerformancePresetPanel from './components/PerformancePresetPanel.vue';
import SwitchPanel from './components/SwitchPanel.vue';
import CalibrationPanel from './components/CalibrationPanel.vue';

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

// --- Indicator Logic ---
const tabRefs = ref<(HTMLElement | null)[]>([]);
const indicatorLeft = ref(0);
const indicatorWidth = ref(0);
const indicatorTop = ref(0);
const indicatorHeight = ref(0);

const setTabRef = (el: any, index: number) => {
  if (el) tabRefs.value[index] = el;
};

const updateIndicator = () => {
  const index = tabs.findIndex(t => t.id === currentTab.value);
  if (index !== -1 && tabRefs.value[index]) {
    const el = tabRefs.value[index];
    if (el) {
      indicatorLeft.value = el.offsetLeft;
      indicatorTop.value = el.offsetTop;
      indicatorWidth.value = el.offsetWidth;
      indicatorHeight.value = el.offsetHeight;
    }
  }
};

const indicatorStyle = computed(() => ({
  transform: `translate(${indicatorLeft.value}px, ${indicatorTop.value}px)`,
  width: `${indicatorWidth.value}px`,
  height: `${indicatorHeight.value}px`
}));

watch(currentTab, () => {
  nextTick(updateIndicator);
});

onMounted(() => {
  nextTick(() => {
    setTimeout(updateIndicator, 50);
  });
});
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
  position: relative; /* Context for indicator */
}

.nav-indicator {
  position: absolute;
  top: 0;
  left: 0;
  background-color: #222;
  border-radius: 6px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  z-index: 1;
}

.nav-item {
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #666;
  transition: color 0.2s; /* Only animate color */
  user-select: none;
  position: relative;
  z-index: 2; /* Sit above indicator */
}

.nav-item:hover {
  /* background: #f5f5f5; */
  color: #333;
}

.nav-item.active {
  /* background: #222; */
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

.panel-fade-enter-active,
.panel-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.panel-fade-enter-from,
.panel-fade-leave-to {
  opacity: 0;
  transform: translateY(5px);
}
</style>
