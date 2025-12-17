import { defineStore } from 'pinia';
import { ref } from 'vue';
import { KeyTravelData, KeyTestState } from '../types/keytest';
import { hHubClient } from '../service/HHubClient';

export const useKeyTestStore = defineStore('keytest', () => {
  const keytest = ref<KeyTestState>({
    enabled: false,
    data: new Map(),
    lastUpdate: 0,
  });

  // Buffer for raw data
  const rawDataBuffer = ref<KeyTravelData[]>([]);
  let animationFrameId: number | null = null;

  const startKeyTest = async () => {
    if (keytest.value.enabled) return;
    keytest.value.enabled = true;
    
    // Setup listener
    hHubClient.onKeyTestData((data: KeyTravelData[]) => {
      rawDataBuffer.value = data;
      
      // Use RAF to merge updates
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(() => {
          // Update the map efficiently
          // Instead of creating new Map every frame, maybe just update values?
          // Vue reactivity works better if we replace the object or use Map.set if it's reactive.
          // But ref(Map) is reactive.
          
          // To trigger reactivity on Map, we need to set values.
          // If we replace the whole map, it triggers.
          const newData = new Map(keytest.value.data);
          rawDataBuffer.value.forEach(d => {
             newData.set(d.keyId, d);
          });
          keytest.value.data = newData;
          
          keytest.value.lastUpdate = Date.now();
          animationFrameId = null;
        });
      }
    });
    
    await hHubClient.startKeyTest();
  };

  const stopKeyTest = () => {
    keytest.value.enabled = false;
    hHubClient.stopKeyTest();
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  };

  return { keytest, startKeyTest, stopKeyTest };
});

