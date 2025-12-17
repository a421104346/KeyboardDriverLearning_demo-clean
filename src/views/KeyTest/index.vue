<template>
  <div class="keytest-container">
    <div class="controls">
      <button @click="startTest" :disabled="keytestStore.keytest.enabled" class="btn">Start Test</button>
      <button @click="stopTest" :disabled="!keytestStore.keytest.enabled" class="btn btn-stop">Stop Test</button>
    </div>

    <div class="grid-container">
       <KeyTravelIndicator
        v-for="[keyId, data] in keytestStore.keytest.data"
        :key="keyId"
        :data="data"
      />
      <div v-if="keytestStore.keytest.data.size === 0" class="empty-state">
          Press "Start Test" to begin...
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useKeyTestStore } from '../../stores/keytest';
import KeyTravelIndicator from '../../components/KeyTravelIndicator.vue';
import { onUnmounted } from 'vue';

const keytestStore = useKeyTestStore();

const startTest = () => keytestStore.startKeyTest();
const stopTest = () => keytestStore.stopKeyTest();

onUnmounted(() => {
    keytestStore.stopKeyTest();
});
</script>

<style scoped>
.keytest-container {
    padding: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #121212;
    color: #fff;
}

.controls {
    margin-bottom: 20px;
    display: flex;
    gap: 10px;
}

.grid-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    overflow-y: auto;
    flex: 1;
    align-content: flex-start;
}

.btn {
    padding: 8px 16px;
    background: #2196F3;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn-stop {
    background: #f44336;
}

.empty-state {
    color: #888;
    width: 100%;
    text-align: center;
    margin-top: 50px;
}
</style>

