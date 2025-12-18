<template>
  <div class="switch-panel">
    <div v-if="isLoading" class="state-msg">
      <span class="loader"></span> Loading available switches...
    </div>
    
    <div v-else-if="performanceStore.axisList.length === 0" class="state-msg empty">
      <p v-if="performanceStore.error" class="error-text">{{ performanceStore.error }}</p>
      <p v-else>No switch detected.</p>
      <button class="retry-btn" @click="loadData">Retry Load</button>
    </div>

    <div v-else class="switch-container">
      <div v-if="performanceStore.error" class="warning-banner">
        ⚠️ {{ performanceStore.error }}
      </div>
      <h4 class="panel-title">Select Switch Type</h4>
      <div class="switch-grid">
        <div 
          v-for="axis in performanceStore.axisList" 
          :key="axis.id"
          class="switch-card"
          :class="{ 
            selected: selectedAxisId === axis.id,
            active: performanceStore.config.axis === axis.id 
          }"
          @click="selectAxis(axis)"
        >
          <div class="switch-visual">
            <div class="switch-stem" :style="{ backgroundColor: getSwitchColor(axis.name) }"></div>
            <div class="switch-housing"></div>
          </div>
          
          <div class="switch-info">
            <div class="name" :title="axis.name">{{ axis.name || `Switch ${axis.id}` }}</div>
            <div class="specs">
              <span>Total: {{ axis.maxTravel }}mm</span>
              <span v-if="axis.minTravel">Min: {{ axis.minTravel }}mm</span>
            </div>
          </div>

          <div class="status-badges">
            <div class="badge applied" v-if="performanceStore.config.axis === axis.id">
              ✓ Applied
            </div>
            <div class="badge selected-badge" v-else-if="selectedAxisId === axis.id">
              Selected
            </div>
          </div>
        </div>
      </div>

      <!-- Action Button -->
      <div class="action-bar">
        <button 
          class="btn btn-apply" 
          @click="applyAxisChange"
          :disabled="!hasChanges || isApplying"
        >
          <span v-if="!isApplying">Apply Switch Change</span>
          <span v-else class="applying">
            <span class="spinner"></span> Applying...
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * [Resume/Portfolio Note] Explanation of Data Loading Behavior
 * 
 * In a complete production environment (like H-Hub), fetching switch options involves:
 * 1. Firmware Layer: Sending `getSupportAxis` HID command to retrieve supported Switch IDs.
 * 2. Service Layer: Calling a backend API to map IDs to detailed metadata (Names, Images, Specs).
 * 
 * In this demo, you might see a "Device request failed" warning triggering a Mock Data fallback.
 * This happens because:
 * - The connected device firmware may not respond to the `getSupportAxis` command (Timeout).
 * - This local demo lacks the backend service to map raw IDs to switch details.
 * 
 * The Mock Data fallback is implemented to ensure the UI interactions and Store logic 
 * can be fully demonstrated for review purposes, independent of specific hardware support.
 */
import { ref, onMounted, computed } from 'vue';
import { usePerformanceStore } from '@/stores/performance';
import type { AxisInfo } from '@/types/keyboard';

const performanceStore = usePerformanceStore();
const isLoading = ref(false);
const selectedAxisId = ref<number | null>(null);
const isApplying = ref(false);

// Check if current selection differs from applied config
const hasChanges = computed(() => {
  return selectedAxisId.value !== null && selectedAxisId.value !== performanceStore.config.axis;
});

const loadData = async () => {
  isLoading.value = true;
  await performanceStore.getSupportAxis();
  console.log('Current Axis List in Store:', performanceStore.axisList);
  
  // Initialize selected axis from current config
  if (performanceStore.config.axis !== undefined) {
    selectedAxisId.value = performanceStore.config.axis;
  }
  isLoading.value = false;
};

onMounted(() => {
  if (performanceStore.axisList.length === 0) {
    loadData();
  } else {
    // Initialize from existing config
    selectedAxisId.value = performanceStore.config.axis;
  }
});

const selectAxis = (axis: AxisInfo) => {
  // Just update selection, don't apply yet
  selectedAxisId.value = axis.id;
};

const applyAxisChange = async () => {
  if (selectedAxisId.value === null || !hasChanges.value) return;
  
  isApplying.value = true;
  try {
    performanceStore.config.axis = selectedAxisId.value;
    await performanceStore.applyConfig();
    console.log(`Applied axis change to: ${selectedAxisId.value}`);
  } catch (error) {
    console.error('Failed to apply axis change:', error);
  } finally {
    isApplying.value = false;
  }
};

// Helper for visualization
const getSwitchColor = (name: string = '') => {
  const n = name.toLowerCase();
  if (n.includes('red')) return '#ff4d4f';
  if (n.includes('blue')) return '#1890ff';
  if (n.includes('brown')) return '#8c6144';
  if (n.includes('black')) return '#1f1f1f';
  if (n.includes('white')) return '#f0f0f0';
  if (n.includes('silver')) return '#d9d9d9';
  if (n.includes('yellow')) return '#fadb14';
  if (n.includes('green')) return '#52c41a';
  if (n.includes('purple')) return '#722ed1';
  if (n.includes('magnetic')) return '#fa8c16'; // Orange for magnetic
  return '#fa8c16'; // Default magnetic/orange
};
</script>

<style scoped>
.switch-panel {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 16px;
  background-color: #f8f9fa;
  position: relative;
}

.switch-container {
  position: relative;
  min-height: 100%;
  padding-bottom: 70px; /* Space for action bar */
}

.state-msg {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #666;
  gap: 12px;
}

.error-text {
  color: #ff4d4f;
  font-weight: 500;
}

.retry-btn {
  padding: 6px 16px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.retry-btn:hover {
  opacity: 0.9;
}

.warning-banner {
  background-color: #fffbe6;
  border: 1px solid #ffe58f;
  color: #faad14;
  padding: 8px 12px;
  border-radius: 4px;
  margin-bottom: 12px;
  font-size: 13px;
}

.panel-title {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.switch-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
}

.switch-card {
  background: #fff;
  border: 2px solid transparent;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.switch-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.switch-card.selected {
  border-color: #1890ff;
  background-color: #f0f9ff;
}

.switch-card.active {
  border-color: #52c41a;
  background-color: #f6ffed;
}

/* Simple CSS Switch Graphic */
.switch-visual {
  width: 48px;
  height: 48px;
  background: #333; /* Housing */
  border-radius: 6px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.switch-stem {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  box-shadow: inset 0 0 4px rgba(0,0,0,0.2);
}

.switch-stem::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  border: 2px solid rgba(255,255,255,0.1);
  border-radius: 4px;
}

.switch-info {
  text-align: center;
  width: 100%;
}

.name {
  font-weight: 600;
  font-size: 14px;
  color: #000;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.specs {
  font-size: 12px;
  color: #888;
  display: flex;
  flex-direction: column;
}

.status-badges {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 4px;
}

.badge {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: 500;
}

.badge.applied {
  background: #52c41a;
  color: #fff;
}

.badge.selected-badge {
  background: #1890ff;
  color: #fff;
}

/* Action Bar */
.action-bar {
  position: sticky;
  bottom: 0;
  margin: 16px -16px -16px -16px;
  padding: 16px;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.btn {
  padding: 10px 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.25s;
  min-width: 160px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #d9d9d9;
  color: #999;
}

.btn-apply {
  background: #1890ff;
  color: #fff;
  box-shadow: 0 2px 6px rgba(24, 144, 255, 0.3);
}

.btn-apply:hover:not(:disabled) {
  background: #40a9ff;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
  transform: translateY(-1px);
}

.btn-apply:active:not(:disabled) {
  transform: translateY(0);
}

.applying {
  display: flex;
  align-items: center;
  gap: 8px;
}

.spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.loader {
  width: 24px;
  height: 24px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
