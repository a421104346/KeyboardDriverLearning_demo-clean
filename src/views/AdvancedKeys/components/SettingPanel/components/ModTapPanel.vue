<template>
  <div class="mt-panel">
    <div class="panel-column left">
      <div class="section-title">
        <h3>双效点击 (MT)</h3>
        <p>短按触发按键A，长按触发按键B。</p>
      </div>

      <div class="bind-group">
        <div class="bind-item">
          <BindKey2 
            :key-value="config.keyValue[0]" 
            @key-drop="(v) => config.keyValue[0] = v"
            @clear="config.keyValue[0] = 0"
          />
          <span class="label">短按 (Tap)</span>
        </div>
        <div class="bind-item">
          <BindKey2 
            :key-value="config.keyValue[1]" 
            @key-drop="(v) => config.keyValue[1] = v"
            @clear="config.keyValue[1] = 0"
          />
          <span class="label">长按 (Hold)</span>
        </div>
      </div>

      <div class="setting-item">
        <div class="setting-header">
          <span class="label">长按判定时间</span>
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
        <p class="description">按住超过此时间判定为长按。</p>
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
  keyValue: [0, 0],
  time: 200,
});
</script>

<style scoped>
.mt-panel {
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
