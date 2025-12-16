<template>
  <div class="socd-panel">
    <!-- Left Section -->
    <div class="socd-panel__left">
      <div class="section-header">
        <h3>优先设定（SOCD）</h3>
        <p>绑定两个按键，并根据您的设置决定他们如何触发。</p>
      </div>

      <div class="bind-keys">
        <div v-for="(key, index) in bindKeys" :key="index" class="bind-key-item">
          <div class="bind-key-box"></div>
          <div class="bind-key-label">{{ index === 0 ? '按键A' : '按键B' }}</div>
        </div>
      </div>

      <div class="delay-section">
        <div class="delay-title">延迟时间</div>
        <p class="delay-description">延迟时间是指按键A和按键B之间的延迟时间。</p>
        <div class="delay-control">
          <input 
            type="range" 
            v-model.number="delayTime" 
            min="1" 
            max="1000" 
            class="delay-slider" 
          />
          <div class="delay-input-wrapper">
            <input 
              type="number" 
              v-model.number="delayTime" 
              min="1" 
              max="1000" 
              class="delay-input" 
            />
            <span class="delay-unit">ms</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Center Section -->
    <div class="socd-panel__center">
      <div class="section-header">
        <h3>优先级设定</h3>
        <p>设置A键和B键触发的优先级。</p>
      </div>

      <div class="priority-tabs">
        <button 
          v-for="option in priorityOptions" 
          :key="option.value"
          class="priority-tab"
          :class="{ active: selectedPriority === option.value }"
          @click="selectedPriority = option.value"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <!-- Right Section -->
    <div class="socd-panel__right">
      <div class="choose-key">
        <div class="choose-key-tabs">
          <button 
            v-for="tab in keyTabs" 
            :key="tab.id"
            class="key-tab"
            :class="{ active: currentTab === tab.id }"
            @click="currentTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="key-grid">
          <button 
            v-for="key in displayKeys" 
            :key="key"
            class="key-btn"
          >
            {{ key }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const bindKeys = ref([0, 0]);
const delayTime = ref(100);
const selectedPriority = ref(0);
const currentTab = ref('basic');

const priorityOptions = [
  { value: 0, label: '后覆盖' },
  { value: 1, label: 'A优先' },
  { value: 2, label: 'B优先' },
  { value: 3, label: '相抵消' }
];

const keyTabs = [
  { id: 'basic', label: '基本按键' },
  { id: 'media', label: '媒体按键' },
  { id: 'mouse', label: '鼠标按键' }
];

const basicKeys = ['Fn', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '1!', '2@', '3#', '4$', '5%', '6^', '7&', '8*', '9(', '0)', 'ENTER', 'ESC'];

const displayKeys = computed(() => {
  if (currentTab.value === 'basic') return basicKeys;
  if (currentTab.value === 'media') return ['Play', 'Pause', 'Stop', 'Next', 'Prev', 'Vol+', 'Vol-', 'Mute'];
  if (currentTab.value === 'mouse') return ['Left Click', 'Right Click', 'Middle Click', 'Mouse Up', 'Mouse Down'];
  return [];
});
</script>

<style scoped>
.socd-panel {
  display: flex;
  gap: 24px;
  height: 100%;
}

/* Left Section */
.socd-panel__left {
  flex: 0 0 350px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section-header h3 {
  margin: 0 0 8px 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.section-header p {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
}

.bind-keys {
  display: flex;
  gap: 30px;
  justify-content: center;
}

.bind-key-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.bind-key-box {
  width: 80px;
  height: 80px;
  border: 2px solid #ddd;
  border-radius: 8px;
  background: #fafafa;
}

.bind-key-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
}

.delay-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.delay-title {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.delay-description {
  margin: 0;
  font-size: 0.85rem;
  color: #888;
}

.delay-control {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.delay-slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  outline: none;
  -webkit-appearance: none;
  background: #e0e0e0;
}

.delay-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #333;
  cursor: pointer;
}

.delay-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.delay-input {
  width: 100px;
  height: 36px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  color: #333;
}

.delay-input:focus {
  outline: none;
  border-color: #2196F3;
}

.delay-unit {
  font-size: 0.95rem;
  color: #666;
  font-weight: 500;
}

/* Center Section */
.socd-panel__center {
  flex: 0 0 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.priority-tabs {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.priority-tab {
  padding: 12px 20px;
  border: 2px solid #e0e0e0;
  background: #fff;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
  transition: all 0.2s;
  text-align: left;
}

.priority-tab:hover {
  border-color: #bbb;
  background: #f9f9f9;
}

.priority-tab.active {
  background: #222;
  color: #fff;
  border-color: #222;
}

/* Right Section */
.socd-panel__right {
  flex: 1;
  min-width: 0;
}

.choose-key {
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid #eee;
  border-radius: 12px;
  overflow: hidden;
  background: #fafafa;
}

.choose-key-tabs {
  display: flex;
  background: #fff;
  border-bottom: 1px solid #eee;
  flex-shrink: 0;
}

.key-tab {
  flex: 1;
  padding: 14px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  color: #666;
  transition: all 0.2s;
}

.key-tab:hover {
  background: #f5f5f5;
  color: #333;
}

.key-tab.active {
  background: #222;
  color: #fff;
}

.key-grid {
  flex: 1;
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  gap: 10px;
  overflow-y: auto;
  align-content: start;
}

.key-btn {
  aspect-ratio: 1;
  padding: 8px;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  color: #333;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.key-btn:hover {
  border-color: #2196F3;
  color: #2196F3;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(33, 150, 243, 0.15);
}
</style>
