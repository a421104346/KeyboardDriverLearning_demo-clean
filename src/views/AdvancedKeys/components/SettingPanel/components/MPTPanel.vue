<template>
  <div class="mpt-panel">
    <div class="panel-column left">
      <div class="section-title">
        <h3>多点触发 (MPT)</h3>
        <p>根据按下的深度触发不同的按键功能。</p>
      </div>

      <div class="mpt-list">
        <div v-for="(item, index) in config.keyValue" :key="index" class="mpt-item">
          <BindKey2 
            :key-value="item" 
            @key-drop="(v) => config.keyValue[index] = v"
            @clear="config.keyValue[index] = 0"
          />
          
          <div class="slider-wrapper">
            <input 
              type="range" 
              v-model.number="config.triggerTravel[index]" 
              min="0.1" 
              max="4.0" 
              step="0.1"
              class="slider"
            />
            <span class="value">{{ config.triggerTravel[index].toFixed(1) }} mm</span>
          </div>
          
          <span class="stage-label">触发点 {{ index + 1 }}</span>
        </div>
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
  keyValue: [0, 0, 0], // 3 points
  triggerTravel: [1.0, 2.0, 3.0],
});
</script>

<style scoped>
.mpt-panel {
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
.mpt-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.mpt-item {
  display: flex;
  align-items: center;
  gap: 15px;
  background: #f9f9f9;
  padding: 10px;
  border-radius: 8px;
}
.slider-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}
.slider {
  flex: 1;
}
.value {
  width: 60px;
  text-align: right;
  font-family: monospace;
  color: #2196F3;
}
.stage-label {
  width: 60px;
  font-size: 0.85rem;
  color: #888;
}
</style>
