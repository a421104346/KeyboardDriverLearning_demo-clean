<template>
  <div class="tgl-panel">
    <div class="panel-column left">
      <div class="section-title">
        <h3>切换开关 (TGL)</h3>
        <p>按一次开启功能，长按持续触发功能，松开关闭。</p>
      </div>

      <div class="bind-wrapper">
        <span class="label">绑定按键</span>
        <BindKey2 
          :key-value="config.keyValue" 
          @key-drop="(v) => config.keyValue = v"
          @clear="config.keyValue = 0"
        />
      </div>

      <div class="setting-item">
        <div class="setting-header">
          <span class="label">长按触发时间</span>
          <span class="value">{{ config.time }} ms</span>
        </div>
        <input 
          type="range" 
          v-model.number="config.time" 
          min="10" 
          max="1000" 
          step="10"
          class="slider"
        />
        <p class="description">长按超过此时间后，松开按键将停止触发（非锁定状态）。</p>
      </div>
    </div>

    <div class="panel-column right">
      <ChooseKey :types="['basic']" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import BindKey2 from './BindKey2.vue';
import ChooseKey from './ChooseKey/index.vue';

const config = reactive({
  keyValue: 0,
  time: 200,
});
</script>

<style scoped>
.tgl-panel {
  display: flex;
  height: 100%;
  gap: 20px;
  padding: 10px;
}
.panel-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
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
}
.bind-wrapper {
  display: flex;
  align-items: center;
  gap: 20px;
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
}
.bind-wrapper .label {
  font-weight: 500;
  color: #555;
}
.setting-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.setting-header {
  display: flex;
  justify-content: space-between;
}
.slider {
  width: 100%;
}
.description {
  font-size: 0.8rem;
  color: #999;
  margin: 0;
}
</style>
