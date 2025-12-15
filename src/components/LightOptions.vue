<template>
  <div class="options-panel">
    <h3>Lighting Options</h3>
    
    <div class="control-group">
      <label>Master Switch</label>
      <label class="switch">
        <input type="checkbox" :checked="config.open" @change="handleSwitchChange('open', $event)">
        <span class="slider round"></span>
      </label>
    </div>

    <div class="control-group">
      <label>Mode</label>
      <select :value="config.mode" @change="handleInputChange('mode', $event)">
        <option value="0">Static / Custom</option>
        <option value="1">Dynamic 1</option>
        <option value="2">Dynamic 2</option>
        <option value="3">Dynamic 3</option>
      </select>
    </div>

    <div class="control-group">
      <label>Brightness</label>
      <input type="range" min="0" max="100" :value="config.brightness" @input="handleInputChange('brightness', $event)">
    </div>

    <div class="control-group">
      <label>Speed</label>
      <input type="range" min="0" max="100" :value="config.speed" @input="handleInputChange('speed', $event)">
    </div>

    <div class="separator"></div>

    <h3>Color Palette</h3>
    <div class="color-picker-container">
      <input type="color" :value="selectedColor" @input="handleColorChange($event)" class="color-input">
      <div class="preset-colors">
        <div 
          v-for="c in presets" 
          :key="c" 
          class="color-swatch" 
          :style="{ backgroundColor: c }"
          @click="$emit('color-change', c)"
        ></div>
      </div>
    </div>
    
    <div class="actions">
        <button class="action-btn" @click="$emit('apply-all')">Apply to All Keys</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  config: any;
  selectedColor: string;
}>();

const emit = defineEmits(['update-config', 'color-change', 'apply-all']);

const presets = [
  '#ff0000', '#00ff00', '#0000ff', 
  '#ffff00', '#ff00ff', '#00ffff', 
  '#ffffff', '#000000'
];

const updateConfig = (key: string, value: any) => {
  emit('update-config', { ...props.config, [key]: value });
};

const handleSwitchChange = (key: string, event: Event) => {
  const target = event.target as HTMLInputElement;
  updateConfig(key, target.checked);
};

const handleInputChange = (key: string, event: Event) => {
  const target = event.target as HTMLInputElement;
  updateConfig(key, Number(target.value));
};

const handleColorChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('color-change', target.value);
};
</script>

<style scoped>
.options-panel {
  background: #252525;
  padding: 20px;
  border-radius: 12px;
  color: #eee;
  width: 300px;
  text-align: left;
}

h3 {
  margin-top: 0;
  font-size: 1.1em;
  color: #fff;
  border-bottom: 1px solid #444;
  padding-bottom: 10px;
}

.control-group {
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.separator {
  height: 1px;
  background: #444;
  margin: 20px 0;
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
}
input:checked + .slider { background-color: #2196F3; }
input:focus + .slider { box-shadow: 0 0 1px #2196F3; }
input:checked + .slider:before { transform: translateX(20px); }
.slider.round { border-radius: 20px; }
.slider.round:before { border-radius: 50%; }

/* Range Styles */
input[type=range] {
  width: 60%;
}

/* Color Picker */
.color-picker-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.color-input {
  width: 100%;
  height: 40px;
  border: none;
  cursor: pointer;
  background: none;
}
.preset-colors {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.color-swatch {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid rgba(255,255,255,0.2);
}
.color-swatch:hover {
  transform: scale(1.1);
  border-color: #fff;
}

.actions {
    margin-top: 20px;
}
.action-btn {
    width: 100%;
    padding: 10px;
    background: #2196F3;
    border: none;
    border-radius: 6px;
    color: white;
    cursor: pointer;
    font-weight: bold;
}
.action-btn:hover {
    background: #1976D2;
}
</style>

