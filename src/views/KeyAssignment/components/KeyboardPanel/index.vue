<template>
  <div class="keyboard-panel-container">
    <div class="layer-switcher">
      <div class="switcher-capsule">
        <div class="layer-label">Layer</div>
        <!-- Sliding Indicator -->
        <div class="switcher-indicator" :style="indicatorStyle"></div>
        <button 
          v-for="(layer, index) in layers" 
          :key="index"
          :ref="el => setButtonRef(el, index)"
          :class="{ active: currentLayer === index }"
          @click="$emit('update:currentLayer', index)"
        >
          {{ layer }}
        </button>
      </div>
    </div>

    <div class="panel-content">
      <component 
        :is="activeComponent"
        :has-layout="hasLayout"
        :layout="layout"
        :key-layout="keyLayout"
        :key-colors="keyColors"
        :selected-keys="selectedKeys"
        @key-click="$emit('key-click', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted } from 'vue';
import StandardLayerPanel from './components/StandardLayerPanel.vue';
import Fn1LayerPanel from './components/Fn1LayerPanel.vue';
import Fn2LayerPanel from './components/Fn2LayerPanel.vue';
import Fn3LayerPanel from './components/Fn3LayerPanel.vue';

const props = defineProps<{
  currentLayer: number;
  hasLayout: boolean;
  layout: any;
  keyLayout: any[][];
  keyColors: Record<string, string>;
  selectedKeys: string[];
}>();

defineEmits(['key-click', 'update:currentLayer']);

const layers = ['Main', 'Fn1', 'Fn2', 'Fn3'];

// --- Indicator Logic ---
const buttonRefs = ref<(HTMLElement | null)[]>([]);
const indicatorLeft = ref(0);
const indicatorWidth = ref(0);
const indicatorTop = ref(0);
const indicatorHeight = ref(0);

const setButtonRef = (el: any, index: number) => {
  if (el) buttonRefs.value[index] = el;
};

const updateIndicator = () => {
  const btn = buttonRefs.value[props.currentLayer];
  if (btn) {
    indicatorLeft.value = btn.offsetLeft;
    indicatorTop.value = btn.offsetTop;
    indicatorWidth.value = btn.offsetWidth;
    indicatorHeight.value = btn.offsetHeight;
  }
};

const indicatorStyle = computed(() => ({
  transform: `translate(${indicatorLeft.value}px, ${indicatorTop.value}px)`,
  width: `${indicatorWidth.value}px`,
  height: `${indicatorHeight.value}px`
}));

// Watch for layer changes to move indicator
watch(() => props.currentLayer, () => {
  nextTick(updateIndicator);
});

// Initial update
onMounted(() => {
  nextTick(() => {
    setTimeout(updateIndicator, 50);
  });
});
// -----------------------

const activeComponent = computed(() => {
  switch (props.currentLayer) {
    case 0: return StandardLayerPanel;
    case 1: return Fn1LayerPanel;
    case 2: return Fn2LayerPanel;
    case 3: return Fn3LayerPanel;
    default: return StandardLayerPanel;
  }
});
</script>

<style scoped>
.keyboard-panel-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  position: relative;
  justify-content: center;
  align-items: center;
}

.panel-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.layer-switcher {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0;
  margin-right: 20px;
}

.switcher-capsule {
  background: #fff;
  border-radius: 30px;
  padding: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  gap: 4px;
  position: relative; /* Ensure relative positioning for indicator */
}

.switcher-indicator {
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000;
  border-radius: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none; /* Let clicks pass through to buttons */
  z-index: 1;
}

.layer-label {
  padding: 8px 0;
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
  text-align: center;
  width: 100%;
  position: relative;
  z-index: 2;
}

.switcher-capsule button {
  padding: 6px 16px;
  border: none !important; /* Force override global styles */
  box-shadow: none !important; /* Force override global styles */
  background: transparent !important; /* Force override global styles unless active */
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
  color: #666 !important;
  transition: color 0.2s; /* Only animate color */
  position: relative;
  z-index: 2; /* Sit above indicator */
  width: 100%; /* Ensure buttons take full width if needed */
}

.switcher-capsule button:hover {
  /* background: #f5f5f5 !important; Remove hover bg, use text color change or opacity */
  color: #333 !important;
}

.switcher-capsule button.active {
  /* background: #000 !important; Handled by indicator */
  color: #fff !important;
}
</style>

