import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { useKeyboardStore } from './keyboard';
import { useDeviceStore } from './device';
import { hHubClient } from '../service/HHubClient';

export const usePerformanceStore = defineStore('performance', () => {
  const keyboardStore = useKeyboardStore();
  const deviceStore = useDeviceStore();

  // Current UI settings (not tied to any specific key until applied/read)
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
  });

  const isLoading = ref(false);
  const isLoaded = ref(false); // Legacy flag compatibility

  // Read config from the FIRST selected key to update UI
  const readConfigFromSelection = () => {
    // If no key selected, try to select the first valid key automatically
    if (keyboardStore.selectedKeyList.length === 0) {
      for(let r=0; r<keyboardStore.keyboard.length; r++) {
        for(let c=0; c<keyboardStore.keyboard[r].length; c++) {
          if (keyboardStore.keyboard[r][c].keyValue[0] !== 0) {
             keyboardStore.selectKey(r, c);
             break;
          }
        }
        if (keyboardStore.selectedKeyList.length > 0) break;
      }
    }

    const firstKeyId = keyboardStore.selectedKeyList[0];
    if (!firstKeyId) {
       // If still no key, verify if we have ANY data loaded. 
       if (keyboardStore.isInitialized && keyboardStore.keyboard.length > 0) {
          // Fallback: use default config and mark loaded
          isLoaded.value = true; 
       }
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
      };
      isLoaded.value = true;
    }
  };

  // Watch for background data updates (e.g. initial load)
  watch(() => {
    const firstKeyId = keyboardStore.selectedKeyList[0];
    if (!firstKeyId) return null;
    const [r, c] = firstKeyId.split('-').map(Number);
    // Watch travel as a proxy for all performance data
    return keyboardStore.keyboard[r]?.[c]?.travel; 
  }, (newVal) => {
    // If value changed (and not just because selection changed)
    // and we are not currently applying changes (to avoid loop)
    if (newVal !== undefined && !isLoading.value) {
        readConfigFromSelection();
    }
  });

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

        // 1. Update SDK
        const payload = {
          row: r,
          col: c,
          ...config.value,
          rtTravel: config.value.travel, // Usually sync with travel
          axis: key.axis // Keep existing axis
        };
        await hHubClient.setKeyPerformance(r, c, payload);

        // 2. Update Store State
        Object.assign(key, config.value, { rtTravel: config.value.travel });
      });

      await Promise.all(tasks); // Parallel execution
      deviceStore.addLog(`Applied settings to ${tasks.length} keys.`);
    } catch (e: any) {
      deviceStore.addLog(`Apply error: ${e.message}`);
    } finally {
      isLoading.value = false;
    }
  };
  
  // Legacy method adaptation for existing views
  // This reads the whole config into store (which we now do via keyboardStore)
  // We'll redirect it to call keyboardStore.init() if not ready
  const readConfig = async () => {
    if (!keyboardStore.isInitialized) {
      await keyboardStore.init();
    }
    // Auto-select first available key if none selected
    if (keyboardStore.selectedKeyList.length === 0) {
       // Find first valid key
       for(let r=0; r<keyboardStore.keyboard.length; r++) {
         for(let c=0; c<keyboardStore.keyboard[r].length; c++) {
           if(keyboardStore.keyboard[r][c].keyValue[0] !== 0) {
             keyboardStore.selectKey(r, c);
             readConfigFromSelection();
             return;
           }
         }
       }
    } else {
      readConfigFromSelection();
    }
  };
  
  // Legacy adaptation
  const readAllKeysPerformance = async () => {
    // Already handled in keyboardStore.init()
  };

  return {
    config,
    isLoading,
    isLoaded,
    readConfigFromSelection,
    applyConfig,
    readConfig, // Legacy support
    readAllKeysPerformance, // Legacy support
    // Expose cached data from keyboard store if needed for legacy components
    keyPerformanceData: keyboardStore.keyboard 
  };
});
        