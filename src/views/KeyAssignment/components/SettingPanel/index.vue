<template>
  <div class="setting-panel">
    <!-- Category Tabs (Nav Bar style) -->
    <div class="nav-bar-wrapper">
      <div class="category-tabs">
        <div 
          v-for="tab in tabs" 
          :key="tab.id"
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
      <component 
        :is="currentTabComponent" 
        @select-key="handleKeySelection"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
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
}

.tab-item {
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #666;
  transition: all 0.2s;
  user-select: none;
}

.tab-item:hover {
  background: #f5f5f5;
  color: #333;
}

.tab-item.active {
  background: #222; /* Dark active state */
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
</style>