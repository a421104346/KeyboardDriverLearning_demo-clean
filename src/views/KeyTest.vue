<template>
  <div class="page-container">
    <div class="sidebar">
      <h3>Key Test</h3>
      
      <div class="control-group">
        <label>Test Travel Distance and Trigger State</label>
        <label class="switch">
          <input type="checkbox" :checked="isTesting" @change="toggleTest">
          <span class="slider round"></span>
        </label>
      </div>

      <div class="travel-display">
        <div class="travel-bar-container">
          <div class="travel-bar" :style="{ height: travelHeight + '%' }"></div>
        </div>
        <div class="travel-value">
          {{ maxTravel.toFixed(2) }}mm
        </div>
      </div>
      
      <div class="info">
        <p>Press keys to see travel distance and trigger state.</p>
        <div v-if="lastTriggered" class="debug-info">
          Last Triggered: Row {{ lastTriggered.row }}, Col {{ lastTriggered.col }}
        </div>
      </div>
    </div>
    
    <div class="workspace">
      <Keyboard 
        v-if="deviceStore.keyLayout.length > 0"
        :layout="K61_LAYOUT"
        :key-layout="deviceStore.keyLayout" 
        :key-colors="activeKeyColors" 
        :selected-keys="[]"
      />
      <div v-else class="loading">
        Loading keyboard layout...
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, reactive } from 'vue';
import { useDeviceStore } from '../stores/device';
import { useLightingStore } from '../stores/lighting';
import Keyboard from '../components/Keyboard.vue';
import { K61_LAYOUT } from '../config/layout';
import service from '../service';

const deviceStore = useDeviceStore();
const lightingStore = useLightingStore();

const isTesting = ref(false);
const maxTravel = ref(0);
const activeKeyColors = reactive<Record<string, string>>({});
const lastTriggered = ref<{row: number, col: number} | null>(null);
let timer: number | null = null;

// Assuming 4mm is max travel for standard switches
const MAX_POSSIBLE_TRAVEL = 4.0;

const travelHeight = computed(() => {
  return Math.min((maxTravel.value / MAX_POSSIBLE_TRAVEL) * 100, 100);
});

const toggleTest = async (e: Event) => {
  const checked = (e.target as HTMLInputElement).checked;
  isTesting.value = checked;
  
  // Immediately blur to prevent Space key from re-toggling
  (e.target as HTMLInputElement).blur();
  
  if (checked) {
    // Don't call service.startAdjusting() - that's for calibration mode
    // which triggers firmware LED takeover.
    // Just start polling directly for key press testing.
    startPolling();
  } else {
    stopPolling();
  }
};

const startPolling = () => {
  if (timer) clearInterval(timer);
  
  // Use detected rows/cols or default
  const rows = lightingStore.lightAreas[0]?.row || deviceStore.deviceInfo?.row || 5;
  const cols = lightingStore.lightAreas[0]?.col || deviceStore.deviceInfo?.col || 14;

  timer = setInterval(async () => {
    try {
      const travelData = await service.getRealTimeTravel(rows, cols);
      const triggerData = await service.getKeyTriggerState(rows, cols);
      
      let currentMax = 0;
      let maxRow = -1;
      let maxCol = -1;
      
      // Only update keys that are valid in the layout (keyValue != 0)
      travelData.forEach((rowVals, rIndex) => {
        rowVals.forEach((val, cIndex) => {
          const keyId = `${rIndex},${cIndex}`;
          
          // Check if this key is valid in the layout
          const isValidKey = deviceStore.keyLayout?.[rIndex]?.[cIndex] !== 0;
          if (!isValidKey) return; // Skip empty keys
          
          if (val > currentMax) {
            currentMax = val;
            maxRow = rIndex;
            maxCol = cIndex;
          }
          
          // Color logic:
          // Triggered (triggerData[r][c] > 0): Green
          // Pressed (val > 0.1): Blue scale
          
          if (triggerData[rIndex] && triggerData[rIndex][cIndex] > 0) {
             activeKeyColors[keyId] = '#00ff00'; // Triggered
             lastTriggered.value = { row: rIndex, col: cIndex };
          } else if (val > 0.2) {
             // Calculate opacity based on travel
             const opacity = Math.min(val / 2.0, 1);
             activeKeyColors[keyId] = `rgba(0, 100, 255, ${opacity})`;
          } else {
             delete activeKeyColors[keyId];
          }
        });
      });
      
      maxTravel.value = currentMax;
      if (maxRow >= 0 && maxCol >= 0) {
        console.log(`Max travel at (${maxRow},${maxCol}): ${currentMax.toFixed(2)}mm`);
      }
      
    } catch (e) {
      console.error(e);
    }
  }, 50);
};

const stopPolling = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};

onUnmounted(() => {
  stopPolling();
  if (isTesting.value) {
    service.finishAdjusting();
  }
});
</script>

<style scoped>
.page-container {
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
}

.sidebar {
  width: 340px;
  background: #181818;
  border-right: 1px solid #333;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
  color: #fff;
}

.workspace {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at center, #252525 0%, #121212 100%);
  position: relative;
  overflow: auto;
  padding: 40px;
}

.control-group {
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
  background: #333;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  border: 2px solid #444;
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
}

.info {
  margin-top: auto;
  font-size: 0.9em;
  color: #888;
}

.loading {
  color: #666;
  font-size: 1.2em;
}

.debug-info {
  margin-top: 10px;
  padding: 8px;
  background: #222;
  border: 1px solid #444;
  border-radius: 4px;
  font-family: monospace;
  color: #0f0;
  font-weight: bold;
}
</style>

