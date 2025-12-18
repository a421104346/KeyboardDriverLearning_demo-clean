<template>
  <div class="mpt-panel">
    <div class="panel-column left">
      <div class="section-title">
        <h3>Multi-Point Trigger (MPT)</h3>
        <p>Trigger different keys based on press depth.</p>
      </div>

      <div class="mpt-list">
        <div v-for="(item, index) in config.keyValue" :key="index" class="mpt-item">
          <BindKey2 
            :key-value="item" 
            @key-drop="(v) => config.keyValue[index] = v"
            @clear="config.keyValue[index] = 0"
          />
          
          <div class="slider-control">
            <input 
              type="range" 
              v-model.number="config.triggerTravel[index]" 
              min="0.1" 
              max="4.0" 
              step="0.1"
              class="slider"
            />
            <div class="number-input">
              <button @click="updateTravel(index, -0.1)">-</button>
              <div class="value-display">
                <input 
                  type="number" 
                  v-model.number="config.triggerTravel[index]" 
                  step="0.1"
                  @change="validateTravel(index)"
                />
                <span>mm</span>
              </div>
              <button @click="updateTravel(index, 0.1)">+</button>
            </div>
          </div>
          
          <span class="stage-label">Point {{ index + 1 }}</span>
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

const updateTravel = (index: number, delta: number) => {
  const newVal = parseFloat((config.triggerTravel[index] + delta).toFixed(1));
  config.triggerTravel[index] = Math.max(0.1, Math.min(4.0, newVal));
};

const validateTravel = (index: number) => {
  let val = config.triggerTravel[index];
  if (isNaN(val)) val = 0.1;
  config.triggerTravel[index] = Math.max(0.1, Math.min(4.0, val));
};
</script>

<style scoped>
.mpt-panel {
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

.mpt-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 2px 0;
  overflow-y: auto;
}

.mpt-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 2px 0;
}

.slider-control {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 15px;
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
  height: 28px;
}

.number-input button {
  background: #fff;
  border: none;
  padding: 0 8px;
  cursor: pointer;
  color: #666;
  height: 100%;
  display: flex;
  align-items: center;
}

.number-input button:hover {
  background: #f5f5f5;
}

.value-display {
  display: flex;
  align-items: center;
  border-left: 1px solid #f0f0f0;
  border-right: 1px solid #f0f0f0;
  padding: 0 6px;
  font-size: 0.85rem;
  height: 100%;
}

.value-display input {
  width: 36px;
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
  font-size: 0.75rem;
}

.stage-label {
  font-size: 0.85rem;
  color: #999;
  width: 60px;
  text-align: right;
}
</style>
