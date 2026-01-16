<template>
  <div class="setting-panel">
    <!-- Category Tabs (Nav Bar style) -->
    <div class="nav-bar-wrapper">
      <div class="category-tabs">
        <div class="tab-indicator" :style="indicatorStyle"></div>
        <div 
          v-for="(tab, index) in tabs" 
          :key="tab.id"
          :ref="el => setTabRef(el, index)"
          class="tab-item"
          :class="{ active: currentTab === tab.id }"
          @click="currentTab = tab.id"
        >
          {{ tab.label }}
        </div>
      </div>
    </div>

    <!-- Content Area -->
    <div class="content-area">
      <transition name="panel-fade" mode="out-in">
        <component 
          :is="currentTabComponent" 
          @select-key="handleKeySelection"
        />
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue';
import BasicKeyPanel from './components/BasicKeyPanel.vue';
import MediaKeyPanel from './components/MediaKeyPanel.vue';
import ControlPanel from './components/ControlPanel.vue';
import RGBPanel from './components/RGBPanel.vue';
import MacroPanel from './components/MacroPanel.vue';
import MousePanel from './components/MousePanel.vue';

const emit = defineEmits(['assign-key']);

const currentTab = ref('basic');

const tabs = [
  { id: 'basic', label: 'Basic Keys', component: BasicKeyPanel },
  { id: 'media', label: 'Media Keys', component: MediaKeyPanel },
  { id: 'control', label: 'Keyboard Control', component: ControlPanel },
  { id: 'rgb', label: 'RGB Control', component: RGBPanel },
  { id: 'macro', label: 'Macro', component: MacroPanel },
  { id: 'mouse', label: 'Mouse', component: MousePanel }
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
// -----------------------

const currentTabComponent = computed(() => {
  const tab = tabs.find(t => t.id === currentTab.value);
  return tab ? tab.component : BasicKeyPanel;
});

const handleKeySelection = (key: string) => {
  // Pass the selected key along with current layer context if needed
  // For now, just passing the key value up
  emit('assign-key', key);
};
</script>

<style scoped>
.setting-panel {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px; /* Space between nav and content */
}

.nav-bar-wrapper {
  padding-left: 10px; /* Align with other content if needed */
}

.category-tabs {
  display: inline-flex;
  background: #fff;
  border-radius: 8px;
  padding: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  gap: 4px;
  position: relative; /* Context for indicator */
}

.tab-indicator {
  position: absolute;
  top: 0;
  left: 0;
  background-color: #222;
  border-radius: 6px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  z-index: 1;
}

.tab-item {
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

.tab-item:hover {
  /* background: #f5f5f5; */
  color: #333;
}

.tab-item.active {
  /* background: #222; */
  color: #fff;
}

.content-area {
  flex: 1;
  background: #fff; /* White card background */
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  overflow-y: auto;
  padding: 20px;
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