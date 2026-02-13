import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { useKeyboardStore } from './keyboard';
import { useDeviceStore } from './device';
import { keyboardClient } from '../service/KeyboardClient';
import type { KeyData, AxisInfo } from '../types/keyboard';

export const usePerformanceStore = defineStore('performance', () => {
  const keyboardStore = useKeyboardStore();
  const deviceStore = useDeviceStore();

  // --- Device Capability State ---
  const precision = ref(0.01);
  const axisList = ref<AxisInfo[]>([]);

  // --- UI Configuration State ---
  // These are the values bound to the sliders in the UI
  const config = ref({
    travel: 4.0,
    isRT: false,
    rtPress: 0.5,
    rtRelease: 0.5,
    topDeadZone: 0,
    bottomDeadZone: 0,
    releaseDeadZone: 0,
    pressDeadZone: 0,
    axis: 0,
  });

  const isLoading = ref(false);
  const isLoaded = ref(false);

  const error = ref<string | null>(null);

  // --- Actions: Device Capabilities ---

  const getPrecision = async () => {
    try {
      // TODO: Implement actual API call if available
      // const res = await keyboardClient.getPrecision();
      // precision.value = res.precision;
      precision.value = 0.1; // Default fallback
    } catch (e) {
      console.warn('Failed to get precision', e);
    }
  };

  const getSupportAxis = async () => {
    error.value = null; // Reset error
    const maxRetries = 3;
    const retryDelay = 500; // ms between retries
    let lastError: any;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        // Add delay before retry (skip on first attempt)
        if (attempt > 0) {
          console.log(`Retrying getSupportAxis (attempt ${attempt + 1}/${maxRetries})...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }

        const axisData = await keyboardClient.getSupportAxis();
        console.log('getSupportAxis response:', axisData);
        
        // SDK returns { axisCount, axisList }
        if (axisData && axisData.axisList && Array.isArray(axisData.axisList) && axisData.axisList.length > 0) {
            // Map axis IDs to AxisInfo objects
            axisList.value = axisData.axisList.map((id: number) => ({
              id: Number(id),
              name: `Switch ${id}`,
              minTravel: 0.1,
              maxTravel: 4.0
            }));
            
            // Success! Clear error and return
            error.value = null;
            console.log(`Successfully loaded ${axisList.value.length} axis types from device`);
            return;
        } else {
           axisList.value = [];
           error.value = 'No switches detected from device.';
           return;
        }
      } catch (e: any) {
        lastError = e;
        console.warn(`Attempt ${attempt + 1}/${maxRetries} failed:`, e.message || e);
        
        // If this was not the last attempt, continue to next retry
        if (attempt < maxRetries - 1) {
          continue;
        }
      }
    }

    // All retries failed - use fallback
    console.warn('All retry attempts failed. Using fallback mock data.');
    console.log('Using Full Mock Axis List');
    axisList.value = [
      { id: 1, name: 'Magnetic Red (Mock)', minTravel: 0.1, maxTravel: 4.0 },
      { id: 2, name: 'Magnetic Blue (Mock)', minTravel: 0.1, maxTravel: 4.0 },
      { id: 3, name: 'Magnetic White (Mock)', minTravel: 0.1, maxTravel: 3.8 },
      { id: 4, name: 'Gateron Magnetic Orange (Mock)', minTravel: 0.1, maxTravel: 4.0 },
      { id: 5, name: 'Magnetic Green (Mock)', minTravel: 0.1, maxTravel: 4.0 },
      { id: 6, name: 'Magnetic Purple (Mock)', minTravel: 0.1, maxTravel: 4.0 },
      { id: 7, name: 'Magnetic Silver (Mock)', minTravel: 0.1, maxTravel: 3.4 },
      { id: 8, name: 'Magnetic Pink (Mock)', minTravel: 0.1, maxTravel: 4.0 },
      { id: 9, name: 'Magnetic Yellow (Mock)', minTravel: 0.1, maxTravel: 3.6 },
      { id: 10, name: 'Magnetic Black (Mock)', minTravel: 0.1, maxTravel: 4.0 },
    ];
    // Set error message to indicate we are in fallback mode
    error.value = `Device request failed after ${maxRetries} attempts (${lastError?.message || 'Timeout'}). Showing mock data.`;
  };

  // --- Actions: Data Loading ---

  /**
   * Initialize performance data for the entire keyboard matrix
   * This logic is moved here from keyboard.ts to separate concerns
   */
  const initPerformance = async (keyboardMatrix: KeyData[][]) => {
    if (!keyboardMatrix || keyboardMatrix.length === 0) return;

    deviceStore.addLog('Initializing performance data...');
    const rows = keyboardMatrix.length;
    const cols = keyboardMatrix[0].length;
    let count = 0;

    // Use a batch approach or simple loop.
    // Production implementations typically loop per key, so we keep that behavior.
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const key = keyboardMatrix[r]?.[c];
        if (!key || key.keyValue[0] === 0) continue;

        try {
          const data = await keyboardClient.getKeyPerformance(r, c);
          if (data) {
            Object.assign(key, {
              travel: data.travel,
              isRT: data.isRT,
              rtPress: data.rtPress,
              rtRelease: data.rtRelease,
              topDeadZone: data.topDeadZone,
              bottomDeadZone: data.bottomDeadZone,
              releaseDeadZone: data.releaseDeadZone,
              pressDeadZone: data.pressDeadZone,
              axis: data.axis,
              rtTravel: data.travel, // Often synced
            });
            count++;
          }
          // Slow down the loop to prevent HID buffer congestion
          // A 20ms delay allows the device to process the previous packet before receiving the next
          await new Promise(resolve => setTimeout(resolve, 20));
        } catch (e: any) {
          // Suppress individual key errors
          console.error(`[Perf] Failed key ${r}-${c}:`, e.message || e);
        }
      }
    }
    deviceStore.addLog(`Performance data initialized for ${count} keys.`);
    isLoaded.value = true;
  };

  // --- Actions: UI Sync ---

  // Read config from the FIRST selected key to update UI
  const readConfigFromSelection = () => {
    const firstKeyId = keyboardStore.selectedKeyList[0];
    
    // Auto-select first valid key if nothing selected (User Experience improvement)
    if (!firstKeyId) {
       // Logic handled in UI or call selectKey(0,0) explicitly if needed
       // For now, if nothing selected, we can't read config.
       return;
    }

    const [r, c] = firstKeyId.split('-').map(Number);
    const key = keyboardStore.keyboard[r]?.[c];
    
    if (key) {
      config.value = {
        travel: key.travel || 4.0,
        isRT: key.isRT || false,
        rtPress: key.rtPress || 0.5,
        rtRelease: key.rtRelease || 0.5,
        topDeadZone: key.topDeadZone || 0,
        bottomDeadZone: key.bottomDeadZone || 0,
        releaseDeadZone: key.releaseDeadZone || 0,
        pressDeadZone: key.pressDeadZone || 0,
        axis: key.axis || 0,
      };
    }
  };

  // Apply current UI config to ALL selected keys
  const applyConfig = async () => {
    if (keyboardStore.selectedKeyList.length === 0) {
      deviceStore.addLog('No keys selected.');
      return;
    }

    isLoading.value = true;
    try {
      const tasks = keyboardStore.selectedKeyList.map(async (keyId) => {
        const [r, c] = keyId.split('-').map(Number);
        const key = keyboardStore.keyboard[r]?.[c];
        if (!key) return;

        // 1. Prepare Payload
        // Note: We might want to preserve the key's existing axis if the UI doesn't allow changing axis
        // But if config.axis is part of the editable UI, we use it.
        const payload = {
          row: r,
          col: c,
          ...config.value,
          rtTravel: config.value.travel, 
        };

        // 2. Update Device
        await keyboardClient.setKeyPerformance(r, c, payload);

        // 3. Update Store State
        Object.assign(key, payload);
      });

      await Promise.all(tasks);
      deviceStore.addLog(`Applied settings to ${tasks.length} keys.`);
    } catch (e: any) {
      deviceStore.addLog(`Apply error: ${e.message}`);
    } finally {
      isLoading.value = false;
    }
  };

  // --- Watchers ---
  
  // Update UI when selection changes or underlying data changes
  watch(
    () => {
      const firstKeyId = keyboardStore.selectedKeyList[0];
      if (!firstKeyId) return null;
      const [r, c] = firstKeyId.split('-').map(Number);
      // Return a composite string to detect any relevant change in the selected key
      const key = keyboardStore.keyboard[r]?.[c];
      return key ? `${key.travel}|${key.isRT}|${key.rtPress}` : null;
    },
    (newVal) => {
      if (newVal && !isLoading.value) {
        readConfigFromSelection();
      }
    }
  );

  return {
    // State
    config,
    precision,
    axisList,
    error,
    isLoading,
    isLoaded,

    // Actions
    getPrecision,
    getSupportAxis,
    initPerformance,
    readConfigFromSelection,
    applyConfig,
  };
});
