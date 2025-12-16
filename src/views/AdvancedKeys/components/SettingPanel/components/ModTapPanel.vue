<template>
  <div class="modtap-panel">
    <div class="panel-header">
      <h3>Mod Tap Configuration</h3>
      <p class="description">
        Configure dual-function keys: tap for one action, hold for another (e.g., Tap for 'A', Hold for 'Ctrl').
      </p>
    </div>

    <div class="config-section">
      <div class="config-row">
        <div class="config-label">
          <span class="label-text">Hold Duration Threshold</span>
          <span class="label-hint">Time (ms) to trigger hold action instead of tap</span>
        </div>
        <div class="config-control">
          <input 
            type="number" 
            v-model.number="holdThreshold" 
            min="50" 
            max="500" 
            step="10"
            class="threshold-input"
          />
          <span class="unit-label">ms</span>
        </div>
      </div>

      <div class="config-row">
        <div class="config-label">
          <span class="label-text">Selected Keys</span>
          <span class="label-hint">Keys currently configured with Mod Tap</span>
        </div>
        <div class="config-control">
          <div class="key-count-badge">{{ selectedKeysCount }} keys</div>
        </div>
      </div>

      <div class="instruction-box">
        <div class="instruction-icon">ℹ️</div>
        <div class="instruction-text">
          <strong>How to configure:</strong>
          <ol>
            <li>Select a key from the keyboard above</li>
            <li>Set the tap action and hold action for that key</li>
            <li>Adjust the hold duration threshold if needed</li>
            <li>Click "Apply Settings" to save</li>
          </ol>
        </div>
      </div>
    </div>

    <div class="action-bar">
      <button class="btn-apply" @click="applySettings">Apply Settings</button>
      <button class="btn-reset" @click="resetSettings">Clear All Mod Tap Keys</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const holdThreshold = ref(200);
const selectedKeysCount = ref(0);

const applySettings = () => {
  console.log('Apply Mod Tap settings:', { holdThreshold: holdThreshold.value });
  // TODO: Call service to update Mod Tap configuration
};

const resetSettings = () => {
  holdThreshold.value = 200;
  selectedKeysCount.value = 0;
};
</script>

<style scoped>
.modtap-panel {
  width: 100%;
  padding: 20px;
}

.panel-header {
  margin-bottom: 30px;
}

.panel-header h3 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1.5rem;
}

.description {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
}

.config-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
}

.config-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.config-label {
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
}

.label-text {
  font-weight: 600;
  color: #333;
  font-size: 1rem;
}

.label-hint {
  color: #888;
  font-size: 0.85rem;
}

.config-control {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 10px;
}

.threshold-input {
  width: 120px;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
  color: #333;
  text-align: center;
}

.threshold-input:focus {
  outline: none;
  border-color: #2196F3;
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}

.unit-label {
  color: #888;
  font-size: 0.9rem;
  font-weight: 500;
}

.key-count-badge {
  padding: 8px 20px;
  background: #E3F2FD;
  color: #2196F3;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.instruction-box {
  display: flex;
  gap: 15px;
  padding: 20px;
  background: #FFF9E6;
  border-left: 4px solid #FFC107;
  border-radius: 8px;
}

.instruction-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.instruction-text {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.6;
}

.instruction-text strong {
  display: block;
  margin-bottom: 8px;
  color: #333;
}

.instruction-text ol {
  margin: 0;
  padding-left: 20px;
}

.instruction-text li {
  margin-bottom: 5px;
}

.action-bar {
  display: flex;
  gap: 15px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.btn-apply,
.btn-reset {
  padding: 12px 30px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.95rem;
}

.btn-apply {
  background: #2196F3;
  color: #fff;
}

.btn-apply:hover {
  background: #1976D2;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(33, 150, 243, 0.3);
}

.btn-reset {
  background: #f5f5f5;
  color: #666;
}

.btn-reset:hover {
  background: #e0e0e0;
  color: #333;
}
</style>

