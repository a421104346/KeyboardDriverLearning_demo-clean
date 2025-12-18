import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { KeyData } from '../types/keyboard';
import { hHubClient } from '../service/HHubClient';
import { useDeviceStore } from './device';
import { usePerformanceStore } from './performance';

export const useKeyboardStore = defineStore('keyboard', () => {
  const deviceStore = useDeviceStore();
  // const performanceStore = usePerformanceStore(); // Moved inside init to avoid circular dependency

  // Core Data
  const keyboard = ref<KeyData[][]>([]);
  const selectedKeyList = ref<string[]>([]); // Format: "row-col"
  
  // Initialization State
  const isInitialized = ref(false);
  const initProgress = ref(0);

  // --- Internal Helpers ---

  const initKeyboardMatrix = (rows: number, cols: number) => {
    keyboard.value = Array.from({ length: rows }, (_, r) =>
      Array.from({ length: cols }, (_, c) => ({
        row: r,
        col: c,
        keyValue: [0, 0, 0, 0],
        travel: 4.0,
        isRT: false,
        rtTravel: 4.0,
        rtPress: 0.5,
        rtRelease: 0.5,
        topDeadZone: 0,
        bottomDeadZone: 0,
        pressDeadZone: 0,
        releaseDeadZone: 0,
        axis: 0,
        realTimeTravel: 0,
        keyTriggerState: 0
      }))
    );
  };

  // --- Initialization Flow (The Coordinator) ---

  const init = async () => {
    if (!deviceStore.currentDevice) return;
    
    isInitialized.value = false;
    initProgress.value = 0;

    try {
      const performanceStore = usePerformanceStore();
      deviceStore.addLog('Starting Keyboard Initialization...');

      // 1. Get Device Dimensions & Base Layout
      // This is critical, we can't do anything else without the matrix
      await getBaseLayout();
      initProgress.value = 30;

      // 2. Load Device Capabilities (Performance metadata)
      // Getting precision/axes first is often required to interpret key data correctly
      await performanceStore.getPrecision();
      // Fire getSupportAxis without waiting (non-blocking, like H-Hub does)
      // This prevents timeout from blocking the main init flow
      performanceStore.getSupportAxis(); // No await!
      initProgress.value = 50;

      // 3. Load Per-Key Data
      // Passing the matrix to the specialized store to fill
      await performanceStore.initPerformance(keyboard.value);
      initProgress.value = 100;

      // Future: Add Light/Macro init here
      // await lightStore.initLight(keyboard.value);
      
      deviceStore.addLog('Keyboard Initialization Complete.');
    } catch (error: any) {
      deviceStore.addLog(`Init failed: ${error.message}`);
      console.error('Keyboard init failed', error);
    } finally {
      isInitialized.value = true;
    }
  };

  // --- Sub-Tasks ---

  const getBaseLayout = async () => {
    try {
      const rows = deviceStore.deviceInfo?.row || 6;
      const cols = deviceStore.deviceInfo?.col || 21;
      
      // Initialize Matrix
      if (keyboard.value.length !== rows || keyboard.value[0]?.length !== cols) {
        initKeyboardMatrix(rows, cols);
      }

      // Fetch Layout (with caching check from deviceStore if desired)
      // For simplicity, we fetch fresh here, or rely on hHubClient caching if implemented
      let layoutData = deviceStore.keyLayout;
      if (!layoutData || layoutData.length === 0) {
         layoutData = await hHubClient.getLayout(rows, cols);
         // Update device store cache
         deviceStore.keyLayout = layoutData;
      }

      // Populate Matrix
      if (layoutData) {
        layoutData.forEach((rowVals, r) => {
          rowVals.forEach((val, c) => {
            if (keyboard.value[r] && keyboard.value[r][c]) {
              keyboard.value[r][c].keyValue[0] = val;
            }
          });
        });
      }
    } catch (e: any) {
      throw new Error(`Layout load error: ${e.message}`);
    }
  };

  // --- Selection Logic ---

  const selectKey = (row: number, col: number, multi = false) => {
    const keyId = `${row}-${col}`;
    if (!multi) {
      selectedKeyList.value = [keyId];
    } else {
      if (selectedKeyList.value.includes(keyId)) {
        selectedKeyList.value = selectedKeyList.value.filter(k => k !== keyId);
      } else {
        selectedKeyList.value.push(keyId);
      }
    }
  };

  const isKeySelected = (row: number, col: number) => {
    return selectedKeyList.value.includes(`${row}-${col}`);
  };

  const clearSelection = () => {
    selectedKeyList.value = [];
  };
  
  const selectAll = () => {
    const all: string[] = [];
    keyboard.value.forEach(row => {
      row.forEach(key => {
        if (key.keyValue[0] !== 0) {
          all.push(`${key.row}-${key.col}`);
        }
      });
    });
    selectedKeyList.value = all;
  };

  return {
    // State
    keyboard,
    selectedKeyList,
    isInitialized,
    initProgress,
    
    // Actions
    init,
    getBaseLayout,
    selectKey,
    isKeySelected,
    clearSelection,
    selectAll
  };
});
