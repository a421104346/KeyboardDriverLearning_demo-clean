<template>
  <div class="ek-panel">
    <div class="panel-column left">
      <div class="section-title">
        <h3>封禁键 (EK)</h3>
        <p>当按下特殊键时，禁用普通键的功能。</p>
      </div>

      <div class="ek-group">
        <!-- Special Keys (Trigger) -->
        <div class="group-title">特殊键 (触发禁用)</div>
        <div class="special-keys">
          <div v-for="(key, idx) in config.specialKey" :key="idx" class="key-slot">
            <BindKey2 
              :key-value="key" 
              @key-drop="(v) => config.specialKey[idx] = v"
              @clear="config.specialKey[idx] = 0"
            />
          </div>
        </div>

        <div class="divider">
          <span>禁用</span>
          <span class="arrow">↓</span>
        </div>

        <!-- Normal Key (Target) -->
        <div class="group-title">普通键 (被禁用)</div>
        <div class="normal-key">
          <BindKey2 
            :key-value="config.normalKey" 
            @key-drop="(v) => config.normalKey = v"
            @clear="config.normalKey = 0"
          />
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
  specialKey: [0, 0, 0, 0], // Up to 4 triggers
  normalKey: 0,
});
</script>

<style scoped>
.ek-panel {
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
.ek-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
}
.group-title {
  font-weight: 500;
  color: #555;
  font-size: 0.9rem;
}
.special-keys {
  display: flex;
  gap: 10px;
}
.divider {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #f44336;
  font-size: 0.8rem;
}
.arrow {
  font-size: 1.2rem;
  font-weight: bold;
}
</style>
