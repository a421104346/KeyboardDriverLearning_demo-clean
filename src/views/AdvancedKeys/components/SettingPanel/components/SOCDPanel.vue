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
        <div class="setting-header">
          <span class="label">延迟时间</span>
          <span class="value">{{ config.delayTime }} ms</span>
        </div>
        <input 
          type="range" 
          v-model.number="config.delayTime" 
          min="1" 
          max="1000" 
          class="slider"
        />
        <p class="description">延迟时间是指按键A和按键B之间的延迟时间。</p>
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
          class="radio-option"
          :class="{ active: config.mode === opt.value }"
          @click="config.mode = opt.value"
        >
          {{ opt.label }}
        </div>
      </div>
    </div>

    <!-- Right: Choose Key -->
    <div class="panel-column right">
      <ChooseKey :types="['basic']" />
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
  { label: '后覆盖 (Last Win)', value: 0 },
  { label: 'A 优先 (A Prior)', value: 1 },
  { label: 'B 优先 (B Prior)', value: 2 },
  { label: '相抵消 (Neutral)', value: 3 },
];
</script>

<style scoped>
.socd-panel {
  display: flex;
  height: 100%;
  gap: 20px;
  padding: 10px;
  box-sizing: border-box;
}

.panel-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px;
  background: #fff;
  /* border-right: 1px solid #eee; */
}

.panel-column.right {
  border-right: none;
  background: transparent; /* ChooseKey has its own bg */
  padding: 0;
}

.section-title h3 {
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  color: #333;
}

.section-title p {
  margin: 0;
  font-size: 0.85rem;
  color: #888;
  line-height: 1.4;
}

/* Left Column Styles */
.bind-group {
  display: flex;
  justify-content: space-around;
  padding: 20px 0;
  background: #f9f9f9;
  border-radius: 8px;
}

.bind-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.bind-item .label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #555;
}

.delay-setting {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.setting-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.setting-header .label {
  font-weight: 500;
  color: #333;
}

.setting-header .value {
  font-family: monospace;
  color: #2196F3;
}

.slider {
  width: 100%;
  cursor: pointer;
}

.description {
  font-size: 0.8rem;
  color: #999;
  margin: 0;
}

/* Center Column Styles */
.priority-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.radio-option {
  padding: 12px 16px;
  border: 2px solid #eee;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  color: #555;
  transition: all 0.2s;
}

.radio-option:hover {
  border-color: #bbdefb;
  background: #f0f7ff;
}

.radio-option.active {
  border-color: #2196F3;
  background: #e3f2fd;
  color: #1976D2;
  font-weight: 600;
}
</style>
