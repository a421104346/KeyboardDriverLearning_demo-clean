<template>
  <div class="setting-panel">
    <!-- Left: Macro List -->
    <div class="panel-section list-section">
      <h3 class="section-title">Macro List</h3>
      <div class="macro-grid">
        <div 
          v-for="i in 16" 
          :key="i"
          class="macro-item"
          :class="{ active: selectedMacro === i }"
          @click="selectedMacro = i"
        >
          <div class="macro-badge">0</div>
          <span class="macro-name">Macro {{ i }}</span>
        </div>
      </div>
    </div>

    <!-- Middle: Macro Config -->
    <div class="panel-section config-section">
      <h3 class="section-title">Macro Config</h3>
      
      <div class="config-group">
        <label>Macro Type</label>
        <div class="macro-type-selector">
           <div 
             v-for="type in macroTypes" 
             :key="type.value"
             class="type-option" 
             :class="{ active: config.type === type.value }"
             @click="config.type = type.value"
           >
             {{ type.label }}
           </div>
        </div>
      </div>

      <div class="config-group">
        <label>Loop Count</label>
        <div class="number-control">
          <button class="btn-step" @click="adjust('loop', -1)">−</button>
          <div class="value-display">
             <input type="number" v-model.number="config.loop" min="1" />
             <span class="unit">times</span>
          </div>
          <button class="btn-step" @click="adjust('loop', 1)">+</button>
        </div>
      </div>
      
      <div class="config-group">
        <label>Delay Time</label>
        <div class="number-control">
          <button class="btn-step" @click="adjust('delay', -10)">−</button>
          <div class="value-display">
             <input type="number" v-model.number="config.delay" min="0" step="10" />
             <span class="unit">ms</span>
          </div>
          <button class="btn-step" @click="adjust('delay', 10)">+</button>
        </div>
      </div>
    </div>

    <!-- Right: Macro Recording -->
    <div class="panel-section record-section">
      <h3 class="section-title">Macro Recording</h3>
      <div class="record-actions">
        <button class="btn-action btn-record" @click="toggleRecording">
          {{ isRecording ? 'Stop Recording' : 'Start Recording' }}
        </button>
        <button class="btn-action btn-reset" @click="resetMacro">Reset</button>
      </div>
      
      <div class="record-content">
        <div v-if="macroSteps.length === 0" class="empty-state">
          <div class="icon-circle">
            <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="clock-icon">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <p class="main-text">No Macro Steps</p>
          <p class="sub-text">Click "Start Recording" button to record macro</p>
        </div>
        <div v-else class="steps-list">
          <!-- TODO: Steps implementation -->
          <div v-for="(step, idx) in macroSteps" :key="idx" class="step-item">
            {{ step }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

const selectedMacro = ref(1);
const isRecording = ref(false);
const macroSteps = ref<string[]>([]); // Placeholder for steps

const config = reactive({
  type: 'no_interrupt',
  loop: 1,
  delay: 0
});

const macroTypes = [
  { label: 'No Interrupt', value: 'no_interrupt' },
  { label: 'Interrupt After Loop', value: 'interrupt_after_loop' },
  { label: 'Interrupt Immediately', value: 'interrupt_immediately' }
];

const adjust = (field: 'loop' | 'delay', delta: number) => {
  if (field === 'loop') {
    const newVal = config.loop + delta;
    if (newVal >= 1) config.loop = newVal;
  } else {
    const newVal = config.delay + delta;
    if (newVal >= 0) config.delay = newVal;
  }
};

const toggleRecording = () => {
  isRecording.value = !isRecording.value;
  // TODO: Implement actual recording logic
};

const resetMacro = () => {
  macroSteps.value = [];
  config.loop = 1;
  config.delay = 0;
  config.type = 'no_interrupt';
};
</script>

<style scoped>
.setting-panel {
  width: 100%;
  height: 100%;
  display: flex;
  background-color: #dbe4ef; /* Matching the light blue-ish gray background from image */
  padding: 30px;
  box-sizing: border-box;
  gap: 40px;
  border-radius: 12px;
}

.panel-section {
  flex: 1; /* Make all sections take equal width */
  display: flex;
  flex-direction: column;
}

.section-title {
  margin: 0 0 20px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

/* List Section */
.list-section {
  /* Removed fixed flex-basis to allow flex: 1 to work */
  align-items: center; /* Center content horizontally */
}

.macro-grid {
  display: grid;
  grid-template-columns: repeat(4, 60px); /* Slightly larger to fit text */
  gap: 12px;
  justify-content: center; /* Center grid items horizontally if container is wider */
}

.macro-item {
  position: relative;
  background: #fff;
  width: 60px; /* Fixed width */
  height: 60px; /* Fixed height */
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.macro-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.macro-item.active {
  background: #e6e6e6; /* Slight darken for active */
  border: 2px solid #ccc;
}

.macro-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #00bfa5;
  color: #fff;
  font-size: 10px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.macro-name {
  font-size: 12px;
  color: #333;
  display: block; /* Show name */
}

/* Config Section */
.config-section {
  /* Removed fixed flex-basis to allow flex: 1 to work */
  gap: 24px;
}

.config-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.config-group label {
  font-size: 14px;
  color: #333;
}

.macro-type-selector {
  display: flex;
  background: #fff;
  border-radius: 6px;
  padding: 4px;
  gap: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.type-option {
  flex: 1;
  text-align: center;
  padding: 6px 4px;
  font-size: 12px;
  border-radius: 4px;
  cursor: pointer;
  color: #666;
  white-space: nowrap;
}

.type-option.active {
  background: #333;
  color: #fff;
}

.number-control {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%; /* Take full width to align with other controls */
  justify-content: center; /* Center the buttons and input */
}

.btn-step {
  width: 32px;
  height: 32px;
  border: none;
  background: #e0e0e0;
  border-radius: 4px;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  transition: background 0.2s;
}

.btn-step:hover {
  background: #d0d0d0;
}

.value-display {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 4px;
  padding: 0 8px;
  height: 32px;
  min-width: 80px;
  justify-content: center;
}

.value-display input {
  width: 40px;
  border: none;
  text-align: right;
  font-size: 14px;
  outline: none;
  margin-right: 4px;
  background-color: #fff;
  color: #000;
  /* Hide standard arrows */
  -moz-appearance: textfield;
  appearance: textfield;
}

.value-display input::-webkit-outer-spin-button,
.value-display input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.value-display .unit {
  font-size: 12px;
  color: #888;
}

/* Record Section */
.record-section {
  /* Removed fixed flex-basis to allow flex: 1 to work */
  display: flex;
  flex-direction: column;
}

.record-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.btn-action {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  font-weight: 500;
  transition: opacity 0.2s;
}

.btn-record {
  background: #222;
  color: #fff;
}

.btn-reset {
  background: #fff;
  color: #333;
}

.btn-action:hover {
  opacity: 0.9;
}

.record-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #888;
}

.icon-circle {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.clock-icon {
  color: #888;
}

.main-text {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.sub-text {
  font-size: 13px;
  color: #999;
  margin: 0;
}
</style>
