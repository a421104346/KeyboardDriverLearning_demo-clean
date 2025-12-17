<template>
  <div class="key-indicator" :class="{ pressed: isPressed }">
    <div class="key-label">{{ keyName || keyId }}</div>
    <div class="travel-bar">
      <div class="travel-fill" :style="{ width: travelPercent + '%' }"></div>
    </div>
    <div class="travel-text">{{ currentTravel }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { KeyTravelData } from '../types/keytest';

const props = defineProps<{
  data: KeyTravelData;
}>();

const currentTravel = computed(() => props.data.currentTravel);
const isPressed = computed(() => props.data.isPressed);
const keyName = computed(() => props.data.keyName);
const keyId = computed(() => props.data.keyId);

// Normalize travel to 0-100%
// Assuming raw travel is 0-400 (4.0mm)
const travelPercent = computed(() => {
    // Clamp to 100%
    return Math.min((props.data.currentTravel / 400) * 100, 100);
});
</script>

<style scoped>
.key-indicator {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  border: 1px solid #444;
  border-radius: 4px;
  background: #252525;
  color: #fff;
  width: 80px;
}

.key-indicator.pressed {
  background-color: #1e3a20;
  border-color: #4caf50;
}

.key-label {
    font-size: 0.8rem;
    text-align: center;
}

.travel-bar {
  width: 100%;
  height: 6px;
  background-color: #444;
  border-radius: 2px;
  overflow: hidden;
}

.travel-fill {
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #8bc34a);
  transition: width 0.05s linear;
}

.travel-text {
    font-size: 0.7rem;
    text-align: right;
    color: #888;
}
</style>

