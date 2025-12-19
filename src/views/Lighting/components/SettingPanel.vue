<template>
  <div class="setting-panel">
    <!-- Left Panel: Mode Settings -->
    <div class="panel panel-left">
      <h4 class="panel-title">Lighting Mode</h4>
      <div class="panel-content">
        <div class="control-group">
          <label>Master Switch</label>
          <label class="switch">
            <input type="checkbox" :checked="lightingStore.lightConfig.open" @change="handleSwitchChange('open', $event)">
            <span class="slider round"></span>
          </label>
        </div>
        <div class="control-group-vertical">
          <label class="group-label">Mode</label>
          <div class="mode-grid">
            <button 
              v-for="i in 20" 
              :key="i-1" 
              class="mode-btn"
              :class="{ active: lightingStore.lightConfig.mode === i-1 }"
              @click="setMode(i-1)"
            >
              <div class="mode-icon">
                <!-- Simple SVG icons based on index to differentiate -->
                <svg v-if="i-1 === 0" viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path fill="currentColor" d="M7 11h10v2H7z"/></svg>
                <svg v-else-if="i-1 === 1" viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M3 3h18v18H3z"/></svg>
                <svg v-else-if="i-1 === 2" viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>
                <svg v-else viewBox="0 0 24 24" width="20" height="20"><circle cx="12" cy="12" r="6" fill="currentColor"/></svg>
              </div>
              <span class="mode-name">{{ i-1 === 0 ? 'Static' : `Dynamic ${i-1}` }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Middle Panel: Parameters -->
    <div class="panel panel-middle">
      <h4 class="panel-title">Parameters</h4>
      <div class="panel-content">
        <div class="trigger-travel-section">
          <div class="control-label">
            <span>Brightness: {{ lightingStore.lightConfig.brightness }}%</span>
          </div>
          <div class="slider-container">
            <input 
              type="range" 
              min="0" 
              max="100" 
              :value="lightingStore.lightConfig.brightness" 
              @input="handleInputChange('brightness', $event)"
              class="trigger-slider"
              :style="{ '--slider-progress': lightingStore.lightConfig.brightness + '%' }"
            >
          </div>
        </div>

        <div class="trigger-travel-section">
          <div class="control-label">
            <span>Speed: {{ lightingStore.lightConfig.speed }}%</span>
          </div>
          <div class="slider-container">
            <input 
              type="range" 
              min="0" 
              max="100" 
              :value="lightingStore.lightConfig.speed" 
              @input="handleInputChange('speed', $event)"
              class="trigger-slider"
              :style="{ '--slider-progress': lightingStore.lightConfig.speed + '%' }"
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Right Panel: Color -->
    <div class="panel panel-right">
      <h4 class="panel-title">Color Palette</h4>
      <div class="panel-content">
        <div class="color-picker-container">
          <!-- Custom Color Picker -->
          <ColorPicker v-model="lightingStore.selectedColor" />
          
          <div class="preset-grid">
            <!-- Colorful Option -->
            <div class="color-option">
              <div class="color-preview colorful-gradient"></div>
              <span class="color-label">Colorful</span>
            </div>
            
            <!-- Preset Colors -->
            <div 
              v-for="(c, index) in presets" 
              :key="c" 
              class="color-option" 
              @click="selectPresetColor(c)"
            >
              <div class="color-preview" :style="{ backgroundColor: c }"></div>
              <span class="color-label">Color {{ index + 1 }}</span>
            </div>
          </div>
        </div>
        
        <div class="actions">
          <button class="btn-apply" @click="$emit('apply-all')">Apply to All Keys</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useLightingStore } from '../../../stores/lighting';
import ColorPicker from './ColorPicker.vue';

const lightingStore = useLightingStore();
const emit = defineEmits(['apply-all']);

const presets = [
  '#ff0000', '#ff8c00', // Red, Orange
  '#ffff00', '#00ff00', // Yellow, Green
  '#00ffff', '#0000ff', // Cyan, Blue
  '#ff00ff', '#ffffff'  // Magenta, White
];

const handleSwitchChange = (key: string, event: Event) => {
  const target = event.target as HTMLInputElement;
  lightingStore.updateConfig({ ...lightingStore.lightConfig, [key]: target.checked });
};

const handleInputChange = (key: string, event: Event) => {
  const target = event.target as HTMLInputElement;
  lightingStore.updateConfig({ ...lightingStore.lightConfig, [key]: Number(target.value) });
};

const setMode = (mode: number) => {
  lightingStore.updateConfig({ ...lightingStore.lightConfig, mode });
};

const selectPresetColor = (color: string) => {
  lightingStore.selectedColor = color;
};
</script>

<style scoped>
.setting-panel {
  width: 100%;
  height: 100%;
  background: transparent;
  display: flex;
  flex-direction: row;
  justify-content: center; /* Center panels horizontally */
  align-items: stretch;
  padding: 0;
  gap: 0;
  color: #333; /* Dark text for light background */
}

.panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 15px 20px; /* Reduced padding */
  border-right: 1px solid #eee; /* Lighter border */
  overflow-y: auto;
  min-width: 0;
  max-width: 400px; /* Limit width for cleaner look */
}

.panel:first-child {
  padding-left: 30px; /* Reduced padding */
  align-items: center; /* Center content horizontally */
}

.panel:first-child .panel-content {
  width: 100%;
}


.panel:last-child {
  border-right: none;
  padding-right: 30px; /* Reduced padding */
}

.panel-title {
  font-size: 0.9rem; /* Smaller title */
  font-weight: 600;
  color: #333;
  margin: 0 0 15px 0; /* Reduced margin */
}

/* Adjust dark mode colors if needed, but assuming light theme based on screenshot */
.mode-select {
  background: #fff;
  color: #333;
  border: 1px solid #ddd;
}

.control-label {
  color: #666;
  font-size: 0.8rem;
}

.slider {
  background-color: #ddd;
}
.slider:before {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.trigger-slider {
  background: #eee;
}
.trigger-slider::-webkit-slider-thumb {
  background: #fff;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.trigger-slider::-webkit-slider-runnable-track {
  background: linear-gradient(
    to right,
    #ccc 0%,
    #ccc var(--slider-progress, 0%),
    #eee var(--slider-progress, 0%),
    #eee 100%
  );
}

.panel-content {
  display: flex;
  flex-direction: column;
  gap: 15px; /* Reduced gap */
}

.control-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.control-group-vertical {
  display: flex;
  flex-direction: column;
  gap: 8px; /* Reduced gap */
}

.group-label {
  font-weight: 600;
  color: #333;
  font-size: 0.85rem;
}

.mode-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 4px; /* Reduced gap */
}

.mode-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 6px;
  padding: 4px 2px; /* Reduced padding */
  cursor: pointer;
  transition: all 0.2s;
  aspect-ratio: 1;
  color: #666;
}

.mode-btn:hover {
  background: #f5f5f5;
  border-color: #ddd;
}

.mode-btn.active {
  background: #e0e0e0;
  border-color: #333;
  color: #000;
  font-weight: bold;
}

.mode-icon {
  margin-bottom: 2px;
  opacity: 0.6;
}

.mode-btn.active .mode-icon {
  opacity: 1;
}

.mode-name {
  font-size: 0.65rem; /* Smaller font */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  text-align: center;
}

/* Form Elements */
.mode-select {
  background: #252525;
  color: #fff;
  border: 1px solid #444;
  padding: 5px 10px;
  border-radius: 4px;
  outline: none;
}

/* Switch Styles */
.switch {
  position: relative;
  display: inline-block;
  width: 36px; /* Slightly smaller */
  height: 18px;
}
.switch input { opacity: 0; width: 0; height: 0; }
.slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #444;
  transition: .4s;
  border-radius: 20px;
}
.slider:before {
  position: absolute;
  content: "";
  height: 14px; /* Smaller knob */
  width: 14px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}
input:checked + .slider { background-color: #2196F3; }
input:focus + .slider { box-shadow: 0 0 1px #2196F3; }
input:checked + .slider:before { transform: translateX(18px); }

/* Slider Styles */
.trigger-travel-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-label {
  font-size: 0.85rem;
  color: #ccc;
}

.slider-container {
  width: 100%;
}

.trigger-slider {
  width: 100%;
  height: 6px; /* Thinner track */
  border-radius: 3px;
  background: #2a2a2a;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  position: relative;
}

.trigger-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px; /* Smaller thumb */
  height: 12px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid #1a1a1a;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  position: relative;
  z-index: 2;
  margin-top: -3px;
}

.trigger-slider::-webkit-slider-runnable-track {
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(
    to right,
    #3a3a3a 0%,
    #3a3a3a var(--slider-progress, 0%),
    #2a2a2a var(--slider-progress, 0%),
    #2a2a2a 100%
  );
}

/* Color Picker */
.color-picker-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.color-input-hidden {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
  pointer-events: none;
}

.preset-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px; /* Reduced gap */
}

.color-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px; /* Reduced gap */
  cursor: pointer;
  background: #fff;
  border-radius: 6px;
  padding: 6px; /* Reduced padding */
  border: 1px solid #eee;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.color-option:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(0,0,0,0.1);
  border-color: #ddd;
}

.color-preview {
  width: 100%;
  aspect-ratio: 1.6; /* Slightly wider */
  border-radius: 4px;
  border: 1px solid rgba(0,0,0,0.05);
}

.color-preview.colorful-gradient {
  background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 25%, #fad0c4 50%, #a18cd1 75%, #fbc2eb 100%);
  position: relative;
}

/* Optional overlay for "colorful" feel */
.color-preview.colorful-gradient::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(45deg, rgba(255,0,0,0.2), rgba(0,255,0,0.2), rgba(0,0,255,0.2));
  border-radius: 6px;
}

.color-label {
  font-size: 0.65rem; /* Smaller font */
  color: #666;
  font-weight: 500;
}

.actions {
  margin-top: auto;
  padding-top: 15px;
}

.btn-apply {
  width: 100%;
  padding: 10px; /* Reduced padding */
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.btn-apply:hover {
  background-color: #1976D2;
}
</style>
