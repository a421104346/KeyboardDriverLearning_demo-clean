<template>
  <div class="setting-panel">
    <!-- Left Panel: Test Mode -->
    <div class="panel panel-left">
      <h4 class="panel-title">Trigger Travel Test</h4>
      <div class="section">
        <div class="section-header">
          <label>Test Mode</label>
          <label class="switch">
            <input type="checkbox" :checked="isTesting" @change="$emit('toggle-test', $event)">
            <span class="slider round"></span>
          </label>
        </div>

        <div class="travel-display" :class="{ 'disabled': !isTesting }">
          <div class="travel-bar-container">
            <div class="travel-bar" :style="{ height: travelHeight + '%' }"></div>
          </div>
          <div class="travel-info">
            <div class="travel-value">{{ maxTravel.toFixed(2) }} mm</div>
            <div class="travel-label">Current Travel</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Middle Panel: Trigger & Dead Zone Settings -->
    <div class="panel panel-middle">
      <h4 class="panel-title">Trigger Travel Settings</h4>
      <div v-if="isLoading" class="loading-hint">
        Loading configuration...
      </div>
      <div v-else-if="!isLoaded" class="loading-hint">
        Click to load settings
      </div>
      <div v-else class="panel-content">
        <div class="trigger-travel-section">
          <p class="section-desc">Shorter trigger travel means faster response, but increases the risk of accidental touches.</p>
          <div class="trigger-travel-controls">
            <div class="slider-container" :style="{ '--slider-progress': sliderProgress + '%' }">
              <input 
                type="range" 
                class="trigger-slider" 
                min="0.1" 
                max="4.0" 
                step="0.1" 
                :value="config.travel"
                @input="updateConfig('travel', Number(($event.target as HTMLInputElement).value))"
              >
            </div>
            <div class="number-input-group">
              <button class="btn-number" @click="adjustValue('travel', -0.001)" type="button">−</button>
              <input 
                type="number" 
                class="number-input" 
                min="0.1" 
                max="4.0" 
                step="0.001" 
                :value="config.travel"
                @input="formatValue('travel', $event)"
              >
              <span class="unit">mm</span>
              <button class="btn-number" @click="adjustValue('travel', 0.001)" type="button">+</button>
            </div>
          </div>
        </div>

        <h4 class="panel-title" style="margin-top: 15px;">Deadzone Settings</h4>
        <p class="section-desc">Automatically limit trigger travel to avoid accidental touches, missed touches, or non-triggering.</p>
        
        <div class="trigger-travel-section">
          <div class="control-label">
            <span>Top Deadzone</span>
          </div>
          <div class="trigger-travel-controls">
            <div class="slider-container" :style="{ '--slider-progress': topDeadZoneProgress + '%' }">
              <input 
                type="range" 
                class="trigger-slider" 
                min="0" 
                max="1.0" 
                step="0.1" 
                :value="config.topDeadZone"
                @input="updateConfig('topDeadZone', Number(($event.target as HTMLInputElement).value))"
              >
            </div>
            <div class="number-input-group">
              <button class="btn-number" @click="adjustValue('topDeadZone', -0.1)" type="button">−</button>
              <input 
                type="number" 
                class="number-input" 
                min="0" 
                max="1.0" 
                step="0.1" 
                :value="config.topDeadZone"
                @input="formatValue('topDeadZone', $event)"
              >
              <span class="unit">mm</span>
              <button class="btn-number" @click="adjustValue('topDeadZone', 0.1)" type="button">+</button>
            </div>
          </div>
        </div>

        <div class="trigger-travel-section">
          <div class="control-label">
            <span>Bottom Deadzone</span>
          </div>
          <div class="trigger-travel-controls">
            <div class="slider-container" :style="{ '--slider-progress': bottomDeadZoneProgress + '%' }">
              <input 
                type="range" 
                class="trigger-slider" 
                min="0" 
                max="1.0" 
                step="0.1" 
                :value="config.bottomDeadZone"
                @input="updateConfig('bottomDeadZone', Number(($event.target as HTMLInputElement).value))"
              >
            </div>
            <div class="number-input-group">
              <button class="btn-number" @click="adjustValue('bottomDeadZone', -0.1)" type="button">−</button>
              <input 
                type="number" 
                class="number-input" 
                min="0" 
                max="1.0" 
                step="0.1" 
                :value="config.bottomDeadZone"
                @input="formatValue('bottomDeadZone', $event)"
              >
              <span class="unit">mm</span>
              <button class="btn-number" @click="adjustValue('bottomDeadZone', 0.1)" type="button">+</button>
            </div>
          </div>
        </div>

        <div class="trigger-travel-section">
          <div class="control-label">
            <span>Release Deadzone</span>
          </div>
          <div class="trigger-travel-controls">
            <div class="slider-container" :style="{ '--slider-progress': releaseDeadZoneProgress + '%' }">
              <input 
                type="range" 
                class="trigger-slider" 
                min="0" 
                max="1.0" 
                step="0.1" 
                :value="config.releaseDeadZone"
                @input="updateConfig('releaseDeadZone', Number(($event.target as HTMLInputElement).value))"
              >
            </div>
            <div class="number-input-group">
              <button class="btn-number" @click="adjustValue('releaseDeadZone', -0.1)" type="button">−</button>
              <input 
                type="number" 
                class="number-input" 
                min="0" 
                max="1.0" 
                step="0.1" 
                :value="config.releaseDeadZone"
                @input="formatValue('releaseDeadZone', $event)"
              >
              <span class="unit">mm</span>
              <button class="btn-number" @click="adjustValue('releaseDeadZone', 0.1)" type="button">+</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Panel: RT Settings -->
    <div class="panel panel-right">
      <h4 class="panel-title">Rapid Trigger Settings</h4>
      <p class="section-desc">Dynamically identify press and lift actions at any position in the travel, greatly improving response speed, also known as RT.</p>
      <div class="section">
        <div class="section-header">
          <label>Rapid Trigger</label>
          <label class="switch">
            <input type="checkbox" :checked="config.isRT" @change="updateConfig('isRT', ($event.target as HTMLInputElement).checked)">
            <span class="slider round"></span>
          </label>
        </div>
        
        <div v-if="config.isRT" class="rt-controls">
          <div class="trigger-travel-section">
            <div class="control-label">
              <span>Press Sensitivity</span>
            </div>
            <div class="trigger-travel-controls">
              <div class="slider-container" :style="{ '--slider-progress': rtPressProgress + '%' }">
                <input 
                  type="range" 
                  class="trigger-slider" 
                  min="0.001" 
                  max="2.0" 
                  step="0.001" 
                  :value="config.rtPress"
                  @input="updateConfig('rtPress', Number(($event.target as HTMLInputElement).value))"
                >
              </div>
              <div class="number-input-group">
                <button class="btn-number" @click="adjustValue('rtPress', -0.001)" type="button">−</button>
                <input 
                  type="number" 
                  class="number-input" 
                  min="0.001" 
                  max="2.0" 
                  step="0.001" 
                  :value="config.rtPress"
                  @input="formatValue('rtPress', $event)"
                >
                <span class="unit">mm</span>
                <button class="btn-number" @click="adjustValue('rtPress', 0.001)" type="button">+</button>
              </div>
            </div>
          </div>
          
          <div class="trigger-travel-section">
            <div class="control-label">
              <span>Release Sensitivity</span>
            </div>
            <div class="trigger-travel-controls">
              <div class="slider-container" :style="{ '--slider-progress': rtReleaseProgress + '%' }">
                <input 
                  type="range" 
                  class="trigger-slider" 
                  min="0.001" 
                  max="2.0" 
                  step="0.001" 
                  :value="config.rtRelease"
                  @input="updateConfig('rtRelease', Number(($event.target as HTMLInputElement).value))"
                >
              </div>
              <div class="number-input-group">
                <button class="btn-number" @click="adjustValue('rtRelease', -0.001)" type="button">−</button>
                <input 
                  type="number" 
                  class="number-input" 
                  min="0.001" 
                  max="2.0" 
                  step="0.001" 
                  :value="config.rtRelease"
                  @input="formatValue('rtRelease', $event)"
                >
                <span class="unit">mm</span>
                <button class="btn-number" @click="adjustValue('rtRelease', 0.001)" type="button">+</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="actions">
        <button class="btn-apply" @click="$emit('apply-config')">Apply Settings</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { usePerformanceStore } from '../../../stores/performance';

const props = defineProps<{
  isTesting: boolean;
  maxTravel: number;
  isLoading: boolean;
  isLoaded: boolean;
}>();

defineEmits(['toggle-test', 'apply-config']);

const performanceStore = usePerformanceStore();
const { config } = storeToRefs(performanceStore);

// Constants
const MAX_POSSIBLE_TRAVEL = 4.0;

const travelHeight = computed(() => {
  return Math.min((props.maxTravel / MAX_POSSIBLE_TRAVEL) * 100, 100);
});

// Progress Computeds
const sliderProgress = computed(() => calcProgress(config.value.travel, 0.1, 4.0));
const topDeadZoneProgress = computed(() => calcProgress(config.value.topDeadZone, 0, 1.0));
const bottomDeadZoneProgress = computed(() => calcProgress(config.value.bottomDeadZone, 0, 1.0));
const releaseDeadZoneProgress = computed(() => calcProgress(config.value.releaseDeadZone, 0, 1.0));
const rtPressProgress = computed(() => calcProgress(config.value.rtPress, 0.001, 2.0));
const rtReleaseProgress = computed(() => calcProgress(config.value.rtRelease, 0.001, 2.0));

const calcProgress = (val: number, min: number, max: number) => {
  return ((val - min) / (max - min)) * 100;
};

// Update Helper
const updateConfig = (key: string, value: any) => {
  // @ts-ignore
  config.value[key] = value;
};

// Generic Adjuster
const adjustValue = (key: string, delta: number) => {
  // @ts-ignore
  let val = config.value[key];
  let min = 0, max = 1.0, precision = 1;

  if (key === 'travel') { min = 0.1; max = 4.0; precision = 3; }
  else if (key === 'rtPress' || key === 'rtRelease') { min = 0.001; max = 2.0; precision = 3; }
  else { min = 0; max = 1.0; precision = 1; }

  val = Math.max(min, Math.min(max, val + delta));
  // @ts-ignore
  config.value[key] = parseFloat(val.toFixed(precision));
};

const formatValue = (key: string, e: Event) => {
  const target = e.target as HTMLInputElement;
  let val = parseFloat(target.value);
  let min = 0, max = 1.0, precision = 1;

  if (key === 'travel') { min = 0.1; max = 4.0; precision = 3; if(isNaN(val)) val=0.1; }
  else if (key === 'rtPress' || key === 'rtRelease') { min = 0.001; max = 2.0; precision = 3; if(isNaN(val)) val=0.001; }
  else { min = 0; max = 1.0; precision = 1; if(isNaN(val)) val=0; }

  val = Math.max(min, Math.min(max, val));
  // @ts-ignore
  config.value[key] = parseFloat(val.toFixed(precision));
};
</script>

<style scoped>
.setting-panel {
  width: 100%;
  height: 100%;
  background: transparent;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: stretch;
  padding: 0;
  gap: 0;
  color: #333;
}

.panel {
  display: flex;
  flex-direction: column;
  padding: 20px 30px;
  border-right: 1px solid #eee;
  overflow-y: auto;
  min-width: 0;
  max-width: 400px;
}

.panel-left {
  width: 300px;
  flex-shrink: 0;
  padding-left: 60px;
}

.panel-middle {
  flex: 1;
  min-width: 450px;
  max-width: 600px;
}

.panel-right {
  width: 350px;
  flex-shrink: 0;
  padding-right: 60px;
  border-right: none;
}

.panel-title {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 10px 0;
}

.panel-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.section-desc {
  font-size: 0.85rem;
  color: #888;
  margin: 0 0 10px 0;
  line-height: 1.4;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Switch Styles */
.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}
.switch input { opacity: 0; width: 0; height: 0; }
.slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #ccc;
  transition: .4s;
}
.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: .4s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
input:checked + .slider { background-color: #2196F3; }
input:focus + .slider { box-shadow: 0 0 1px #2196F3; }
input:checked + .slider:before { transform: translateX(20px); }
.slider.round { border-radius: 20px; }
.slider.round:before { border-radius: 50%; }

/* Travel Display */
.travel-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}

.travel-bar-container {
  width: 40px;
  height: 200px;
  background: #eee;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  border: 2px solid #ddd;
}

.travel-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(to top, #2196F3, #00BCD4);
  transition: height 0.05s ease-out;
}

.travel-value {
  font-size: 1.5em;
  font-weight: bold;
  font-family: monospace;
  color: #333;
}

.travel-label {
  color: #888;
  font-size: 0.9em;
}

/* Trigger Travel Section */
.trigger-travel-section {
  margin-bottom: 10px;
}

.trigger-travel-section:last-child {
  margin-bottom: 0;
}

.trigger-travel-section .control-label {
  margin-bottom: 4px;
  font-size: 0.9rem;
  color: #666;
}

.trigger-travel-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.slider-container {
  flex: 1;
  position: relative;
}

.trigger-slider {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: #eee;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  position: relative;
}

.trigger-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid #ddd;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 2;
  margin-top: -3.5px;
}

.trigger-slider::-webkit-slider-runnable-track {
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(
    to right,
    #ccc 0%,
    #ccc var(--slider-progress, 0%),
    #eee var(--slider-progress, 0%),
    #eee 100%
  );
}

/* Number Input Group */
.number-input-group {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.btn-number {
  width: 28px;
  height: 28px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #666;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  user-select: none;
  line-height: 1;
  padding: 0;
}

.btn-number:hover {
  background: #eee;
}

.number-input {
  width: 40px;
  height: 28px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #333;
  font-size: 0.9rem;
  padding: 0 6px 0 8px;
  text-align: left;
  font-family: 'Segoe UI', sans-serif;
}

.number-input:focus {
  outline: none;
  border-color: #555;
}

.number-input::-webkit-inner-spin-button,
.number-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
  opacity: 0;
  pointer-events: none;
}

.number-input[type=number] {
  -moz-appearance: textfield;
  appearance: textfield;
}

.unit {
  color: #888;
  font-size: 0.85rem;
  margin-left: 2px;
  min-width: 20px;
  line-height: 28px;
}

.actions {
  margin-top: auto;
  padding-top: 20px;
}

.btn-apply {
  width: 100%;
  padding: 12px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-apply:hover {
  background-color: #1976D2;
}

.loading-hint {
  color: #888;
  font-size: 0.9em;
  padding: 10px;
  text-align: center;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}
</style>
