<template>
  <div class="socd-panel">
    <!-- Left: Bind Keys & Delay -->
    <div class="panel-column left">
      <div class="section-title">
        <h3>优先设定 (SOCD)</h3>
        <p>绑定两个按键，并根据您的设置决定他们如何触发。</p>
      </div>
      
      <div class="bind-group">
        <div class="bind-item">
          <BindKey2 
            :key-value="config.keyValue[0]" 
            @key-drop="(v) => config.keyValue[0] = v"
            @clear="config.keyValue[0] = 0"
          />
          <span class="label">按键 A</span>
        </div>
        <div class="bind-item">
          <BindKey2 
            :key-value="config.keyValue[1]" 
            @key-drop="(v) => config.keyValue[1] = v"
            @clear="config.keyValue[1] = 0"
          />
          <span class="label">按键 B</span>
        </div>
      </div>

      <div class="delay-setting">
        <div class="setting-title">延迟时间</div>
        <div class="setting-desc">延迟时间是指按键A和按键B之间的延迟时间。</div>
        
        <div class="slider-control">
          <input 
            type="range" 
            v-model.number="config.delayTime" 
            min="1" 
            max="1000" 
            class="slider"
          />
          <div class="number-input">
            <button @click="config.delayTime = Math.max(1, config.delayTime - 1)">-</button>
            <div class="value-display">
              <input type="number" v-model.number="config.delayTime" />
              <span>ms</span>
            </div>
            <button @click="config.delayTime = Math.min(1000, config.delayTime + 1)">+</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Center: Priority -->
    <div class="panel-column center">
      <div class="section-title">
        <h3>优先级设定</h3>
        <p>设置A键和B键触发的优先级。</p>
      </div>
      
      <div class="priority-options">
        <div 
          v-for="opt in priorityOptions" 
          :key="opt.value"
          class="priority-capsule"
          :class="{ active: config.mode === opt.value }"
          @click="config.mode = opt.value"
        >
          {{ opt.label }}
        </div>
      </div>
    </div>

    <!-- Right: Choose Key -->
    <div class="panel-column right">
      <ChooseKey :types="['basic', 'media', 'mouse']" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import BindKey2 from './BindKey2.vue';
import ChooseKey from './ChooseKey/index.vue';

// Mock Config State
const config = reactive({
  keyValue: [0, 0], // [KeyA, KeyB]
  delayTime: 100,
  mode: 0 // 0: Last Win, 1: A Prior, 2: B Prior, 3: Neutral
});

const priorityOptions = [
  { label: '后覆盖', value: 0 },
  { label: 'A优先', value: 1 },
  { label: 'B优先', value: 2 },
  { label: '相抵消', value: 3 },
];
</script>

<style scoped>
.socd-panel {
  display: flex;
  height: 100%;
  gap: 40px;
  padding: 10px;
  box-sizing: border-box;
}

.panel-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px; /* Reduced from 30px */
}

.panel-column.right {
  flex: 1.2;
}

.section-title {
  margin-bottom: 5px; /* Reduced from 10px */
}

.section-title h3 {
  margin: 0 0 4px 0; /* Reduced from 8px */
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.section-title p {
  margin: 0;
  font-size: 0.85rem;
  color: #999;
  line-height: 1.4;
}

/* Left Column Styles */
.bind-group {
  display: flex;
  justify-content: center; /* Center the bind items */
  gap: 40px;
  padding: 5px 0; /* Reduced from 10px */
}

.bind-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px; /* Reduced from 12px */
}

.bind-item .label {
  font-size: 0.85rem;
  color: #666;
}

.delay-setting {
  display: flex;
  flex-direction: column;
  gap: 8px; /* Reduced from 10px */
  margin-top: 10px; /* Reduced from 20px */
}

.setting-title {
  font-weight: 500;
  color: #333;
  font-size: 0.95rem;
}

.setting-desc {
  font-size: 0.8rem;
  color: #ccc;
  margin-bottom: 5px;
}

.slider-control {
  display: flex;
  align-items: center;
  gap: 20px;
}

.slider {
  flex: 1;
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  appearance: none;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  background: #000;
  border: 2px solid #fff;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.number-input {
  display: flex;
  align-items: center;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.number-input button {
  background: #fff;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  color: #666;
}

.number-input button:hover {
  background: #f5f5f5;
}

.value-display {
  display: flex;
  align-items: center;
  border-left: 1px solid #f0f0f0;
  border-right: 1px solid #f0f0f0;
  padding: 0 8px;
  font-size: 0.9rem;
}

.value-display input {
  width: 40px;
  border: none;
  text-align: right;
  font-family: inherit;
  font-size: inherit;
  outline: none;
  background: #fff;
  color: #333;
}

.value-display span {
  color: #999;
  margin-left: 4px;
  font-size: 0.8rem;
}

/* Center Column Styles (Priority) */
.priority-options {
  display: flex;
  gap: 10px;
  background: #fff;
  padding: 4px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  width: fit-content;
}

.priority-capsule {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.priority-capsule:hover {
  background: #f5f5f5;
}

.priority-capsule.active {
  background: #222;
  color: #fff;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Removed .priority-capsule.active.dark block */
</style>
