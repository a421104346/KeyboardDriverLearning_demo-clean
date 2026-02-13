<template>
  <div class="custom-color-picker">
    <!-- Saturation/Brightness Area -->
    <div 
      class="saturation-area" 
      ref="saturationRef"
      :style="{ backgroundColor: hueColor }"
      @mousedown="startDragSaturation"
    >
      <div class="saturation-white"></div>
      <div class="saturation-black"></div>
      <div 
        class="picker-cursor" 
        :style="{ 
          left: cursorX + '%', 
          top: cursorY + '%' 
        }"
      ></div>
    </div>

    <!-- Hue Slider -->
    <div class="sliders-section">
      <div 
        class="hue-slider" 
        ref="hueRef"
        @mousedown="startDragHue"
      >
        <div 
          class="hue-thumb"
          :style="{ left: (h / 360) * 100 + '%' }"
        ></div>
      </div>
    </div>

    <!-- Hex Input -->
    <div class="input-section">
      <div class="input-group">
        <span class="label">HEX</span>
        <div class="hex-input-wrapper">
          <input 
            type="text" 
            :value="modelValue" 
            @input="handleHexInput"
            @blur="handleHexBlur"
            class="hex-input"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue';

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits(['update:modelValue']);

// State
const h = ref(0);
const s = ref(0);
const v = ref(100);

// Refs for DOM elements
const saturationRef = ref<HTMLElement | null>(null);
const hueRef = ref<HTMLElement | null>(null);

// Dragging state
const isDraggingSaturation = ref(false);
const isDraggingHue = ref(false);

// Computed
const hueColor = computed(() => `hsl(${h.value}, 100%, 50%)`);
const cursorX = computed(() => s.value);
const cursorY = computed(() => 100 - v.value);

// Color Conversion Helpers
const hexToHsv = (hex: string) => {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt("0x" + hex[1] + hex[1]);
    g = parseInt("0x" + hex[2] + hex[2]);
    b = parseInt("0x" + hex[3] + hex[3]);
  } else if (hex.length === 7) {
    r = parseInt("0x" + hex[1] + hex[2]);
    g = parseInt("0x" + hex[3] + hex[4]);
    b = parseInt("0x" + hex[5] + hex[6]);
  }
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, v = max;
  const d = max - min;
  s = max === 0 ? 0 : d / max;
  if (max === min) {
    h = 0;
  } else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, v: v * 100 };
};

const hsvToHex = (h: number, s: number, v: number) => {
  let r = 0, g = 0, b = 0;
  const i = Math.floor(h / 60);
  const f = h / 60 - i;
  const p = v / 100 * (1 - s / 100);
  const q = v / 100 * (1 - f * s / 100);
  const t = v / 100 * (1 - (1 - f) * s / 100);
  const val = v / 100;
  switch (i % 6) {
    case 0: r = val; g = t; b = p; break;
    case 1: r = q; g = val; b = p; break;
    case 2: r = p; g = val; b = t; break;
    case 3: r = p; g = q; b = val; break;
    case 4: r = t; g = p; b = val; break;
    case 5: r = val; g = p; b = q; break;
  }
  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// Initialize
watch(() => props.modelValue, (newVal) => {
  // Only update internal state if not dragging to prevent jitter
  if (!isDraggingSaturation.value && !isDraggingHue.value) {
    const hsv = hexToHsv(newVal);
    h.value = hsv.h;
    s.value = hsv.s;
    v.value = hsv.v;
  }
}, { immediate: true });

// Mouse Handling
const updateColor = () => {
  const hex = hsvToHex(h.value, s.value, v.value);
  emit('update:modelValue', hex);
};

const handleSaturationMove = (e: MouseEvent) => {
  if (!saturationRef.value) return;
  const rect = saturationRef.value.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;
  
  x = Math.max(0, Math.min(x, rect.width));
  y = Math.max(0, Math.min(y, rect.height));
  
  s.value = (x / rect.width) * 100;
  v.value = 100 - (y / rect.height) * 100;
  
  updateColor();
};

const handleHueMove = (e: MouseEvent) => {
  if (!hueRef.value) return;
  const rect = hueRef.value.getBoundingClientRect();
  let x = e.clientX - rect.left;
  x = Math.max(0, Math.min(x, rect.width));
  
  h.value = (x / rect.width) * 360;
  
  updateColor();
};

const startDragSaturation = (e: MouseEvent) => {
  isDraggingSaturation.value = true;
  handleSaturationMove(e);
  window.addEventListener('mousemove', onDragSaturation);
  window.addEventListener('mouseup', stopDragSaturation);
};

const onDragSaturation = (e: MouseEvent) => {
  if (isDraggingSaturation.value) handleSaturationMove(e);
};

const stopDragSaturation = () => {
  isDraggingSaturation.value = false;
  window.removeEventListener('mousemove', onDragSaturation);
  window.removeEventListener('mouseup', stopDragSaturation);
};

const startDragHue = (e: MouseEvent) => {
  isDraggingHue.value = true;
  handleHueMove(e);
  window.addEventListener('mousemove', onDragHue);
  window.addEventListener('mouseup', stopDragHue);
};

const onDragHue = (e: MouseEvent) => {
  if (isDraggingHue.value) handleHueMove(e);
};

const stopDragHue = () => {
  isDraggingHue.value = false;
  window.removeEventListener('mousemove', onDragHue);
  window.removeEventListener('mouseup', stopDragHue);
};

const handleHexInput = (e: Event) => {
  const val = (e.target as HTMLInputElement).value;
  if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
    emit('update:modelValue', val);
  }
};

const handleHexBlur = (e: Event) => {
  const target = e.target as HTMLInputElement;
  // Reset to valid prop value if invalid
  if (!/^#[0-9A-Fa-f]{6}$/.test(target.value)) {
    target.value = props.modelValue;
  }
};

onUnmounted(() => {
  window.removeEventListener('mousemove', onDragSaturation);
  window.removeEventListener('mouseup', stopDragSaturation);
  window.removeEventListener('mousemove', onDragHue);
  window.removeEventListener('mouseup', stopDragHue);
});
</script>

<style scoped>
.custom-color-picker {
  display: flex;
  flex-direction: column;
  gap: 8px; /* Reduced gap */
  width: 100%;
  background: #fff;
  border-radius: 8px;
  padding: 8px;
  border: 1px solid #eee;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  margin-bottom: 8px; /* Reduced margin */
}

.saturation-area {
  width: 100%;
  height: 80px; /* Reduced height from 120px */
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  cursor: crosshair;
}

.saturation-white {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(to right, #fff, rgba(255,255,255,0));
}

.saturation-black {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(to top, #000, rgba(0,0,0,0));
}

.picker-cursor {
  position: absolute;
  width: 10px; /* Smaller cursor */
  height: 10px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 0 2px rgba(0,0,0,0.5);
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.sliders-section {
  width: 100%;
  padding: 0 2px;
}

.hue-slider {
  width: 100%;
  height: 8px; /* Thinner slider */
  border-radius: 4px;
  background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
  position: relative;
  cursor: pointer;
}

.hue-thumb {
  position: absolute;
  top: 50%;
  width: 12px; /* Smaller thumb */
  height: 12px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid #ddd;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.input-section {
  display: flex;
  align-items: center;
  gap: 6px;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f5f5f5;
  padding: 2px 6px; /* Reduced padding */
  border-radius: 4px;
  border: 1px solid #eee;
  flex: 1;
}

.label {
  font-size: 0.65rem; /* Smaller font */
  color: #666;
  font-weight: 600;
}

.hex-input-wrapper {
  flex: 1;
}

.hex-input {
  width: 100%;
  border: none;
  background: transparent;
  font-family: monospace;
  font-size: 0.75rem; /* Smaller font */
  color: #333;
  outline: none;
  text-transform: uppercase;
}
</style>
