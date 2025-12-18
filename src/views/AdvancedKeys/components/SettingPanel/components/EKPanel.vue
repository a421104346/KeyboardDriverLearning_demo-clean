<template>
  <div class="ek-panel">
    <div class="panel-column left">
      <div class="section-title">
        <h3>Disable Key (EK)</h3>
        <p>Disable normal key functions when a special key is pressed.</p>
      </div>

      <div class="ek-group">
        <!-- Special Keys (Trigger) -->
        <div class="group-section">
        <div class="group-title">Trigger Keys</div>
        <div class="special-keys">
          <div v-for="(key, idx) in config.specialKey" :key="idx" class="key-slot">
            <BindKey2 
              :key-value="key" 
              @key-drop="(v) => config.specialKey[idx] = v"
              @clear="config.specialKey[idx] = 0"
            />
            </div>
          </div>
        </div>

        <div class="divider">
          <span class="divider-line"></span>
          <span class="divider-text">Disable</span>
          <span class="divider-line"></span>
        </div>

        <!-- Normal Key (Target) -->
        <div class="group-section">
        <div class="group-title">Target Key</div>
        <div class="normal-key">
          <BindKey2 
            :key-value="config.normalKey" 
            @key-drop="(v) => config.normalKey = v"
            @clear="config.normalKey = 0"
          />
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
  specialKey: [0, 0, 0, 0], // Up to 4 triggers
  normalKey: 0,
});
</script>

<style scoped>
.ek-panel {
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

.ek-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 5px 0;
}

.group-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.group-title {
  font-weight: 500;
  color: #666;
  font-size: 0.9rem;
}

.special-keys {
  display: flex;
  gap: 15px;
}

.divider {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  color: #999;
  font-size: 0.8rem;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: #eee;
}

.divider-text {
  color: #ff4d4f;
  font-weight: 500;
}
</style>
