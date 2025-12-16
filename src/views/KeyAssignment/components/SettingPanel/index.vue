<template>
  <div class="setting-panel">
    <!-- Category Tabs -->
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
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  overflow: hidden;
}

.layer-control {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  gap: 15px;
  background: #fafafa;
}

.layer-label {
  font-weight: 600;
  color: #333;
}

.layer-buttons {
  display: flex;
  gap: 10px;
}

.layer-buttons button {
  padding: 6px 16px;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.layer-buttons button:hover {
  background: #f0f0f0;
}

.layer-buttons button.active {
  background: #333;
  color: #fff;
  border-color: #333;
}

.category-tabs {
  display: flex;
  padding: 10px 20px 0;
  border-bottom: 1px solid #eee;
  background: #fff;
  gap: 20px;
}

.tab-item {
  padding: 10px 5px;
  color: #666;
  cursor: pointer;
  font-weight: 500;
  border-bottom: 3px solid transparent;
  transition: all 0.2s;
}

.tab-item:hover {
  color: #333;
}

.tab-item.active {
  color: #2196F3;
  border-bottom-color: #2196F3;
}

.content-area {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: #f9f9f9;
}
</style>
