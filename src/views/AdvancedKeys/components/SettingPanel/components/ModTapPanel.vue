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

      <div class="setting-group">
        <div class="setting-title">长按判定时间</div>
        <div class="setting-desc">按住超过此时间判定为长按。</div>
        
        <div class="slider-control">
          <input 
            type="range" 
            v-model.number="config.time" 
            min="10" 
            max="1000" 
            step="10"
            class="slider"
          />
          <div class="number-input">
            <button @click="config.time = Math.max(10, config.time - 10)">-</button>
            <div class="value-display">
              <input type="number" v-model.number="config.time" />
              <span>ms</span>
            </div>
            <button @click="config.time = Math.min(1000, config.time + 10)">+</button>
          </div>
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
  keyValue: [0, 0],
  time: 200,
});
</script>

<style scoped>
.mt-panel {
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
  gap: 5px;
}

.panel-column.right {
  flex: 1.2;
}

.section-title {
  margin-bottom: 2px;
}

.section-title h3 {
  margin: 0 0 2px 0;
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

.bind-group {
  display: flex;
  justify-content: center;
  gap: 60px;
  padding: 10px 0;
}

.bind-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.bind-item .label {
  font-size: 0.85rem;
  color: #666;
}

.setting-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 5px;
}

.setting-title {
  font-weight: 500;
  color: #333;
  font-size: 0.95rem;
}

.setting-desc {
  font-size: 0.8rem;
  color: #ccc;
  margin-bottom: 2px;
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
</style>
