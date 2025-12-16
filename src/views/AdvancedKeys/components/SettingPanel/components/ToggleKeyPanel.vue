<template>
  <div class="toggle-panel">
    <div class="panel-header">
      <h3>Toggle Key Configuration</h3>
      <p class="description">
        Configure keys to toggle state on/off (e.g., press once to activate, press again to deactivate).
      </p>
    </div>

    <div class="config-section">
      <div class="config-row">
        <div class="config-label">
          <span class="label-text">Toggle Mode</span>
          <span class="label-hint">How toggle keys behave</span>
        </div>
        <div class="config-control">
          <select v-model="toggleMode" class="mode-select">
            <option value="press">Toggle on Press</option>
            <option value="release">Toggle on Release</option>
            <option value="both">Toggle on Both</option>
          </select>
        </div>
      </div>

      <div class="config-row">
        <div class="config-label">
          <span class="label-text">Auto-Reset on Layer Change</span>
          <span class="label-hint">Reset toggle state when switching layers</span>
        </div>
        <div class="config-control">
          <label class="toggle-switch">
            <input type="checkbox" v-model="autoReset" />
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <div class="config-row">
        <div class="config-label">
          <span class="label-text">Configured Toggle Keys</span>
          <span class="label-hint">Keys currently set as toggle keys</span>
        </div>
        <div class="config-control">
          <div class="key-count-badge">{{ toggleKeysCount }} keys</div>
        </div>
      </div>

      <div class="instruction-box">
        <div class="instruction-icon">💡</div>
        <div class="instruction-text">
          <strong>Toggle Key Examples:</strong>
          <ul>
            <li><strong>Caps Lock Style:</strong> Press to lock, press again to unlock</li>
            <li><strong>Modifier Lock:</strong> Lock Ctrl, Alt, or Shift without holding</li>
            <li><strong>Gaming Macros:</strong> Toggle auto-fire or continuous actions</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="action-bar">
      <button class="btn-apply" @click="applySettings">Apply Settings</button>
      <button class="btn-reset" @click="resetSettings">Reset to Default</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const toggleMode = ref('press');
const autoReset = ref(true);
const toggleKeysCount = ref(0);

const applySettings = () => {
  console.log('Apply Toggle Key settings:', { 
    toggleMode: toggleMode.value, 
    autoReset: autoReset.value 
  });
  // TODO: Call service to update Toggle Key configuration
};

const resetSettings = () => {
  toggleMode.value = 'press';
  autoReset.value = true;
  toggleKeysCount.value = 0;
};
</script>

<style scoped>
.toggle-panel {
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
  min-width: 250px;
}

.mode-select {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
  color: #333;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.2s;
}

.mode-select:hover {
  border-color: #2196F3;
}

.mode-select:focus {
  outline: none;
  border-color: #2196F3;
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.3s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:checked + .slider:before {
  transform: translateX(26px);
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
  background: #E8F5E9;
  border-left: 4px solid #4CAF50;
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
  color: #333;
}

.instruction-text ul {
  margin: 8px 0 0 0;
  padding-left: 20px;
}

.instruction-text li {
  margin-bottom: 8px;
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

