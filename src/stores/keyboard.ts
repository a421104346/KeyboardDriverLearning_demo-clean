import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { KeyData } from '../types/keyboard';
import service from '../service';
import { useDeviceStore } from './device';

export const useKeyboardStore = defineStore('keyboard', () => {
  const deviceStore = useDeviceStore();

  const keyboard = ref<KeyData[][]>([]);
  const selectedKeyList = ref<string[]>([]); // Format: "row-col"
  const isInitialized = ref(false);

  // Initialize the keyboard matrix structure
  const initKeyboardMatrix = (rows: number, cols: number) => {
    keyboard.value = Array.from({ length: rows }, (_, r) =>
      Array.from({ length: cols }, (_, c) => ({
        row: r,
        col: c,
        keyValue: [0, 0, 0, 0], // 4 layers
        travel: 4.0, // Default fallback
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

  // Load layout from device
  const getBaseLayout = async () => {
    try {
      // Use device info or fallback defaults
      const rows = deviceStore.deviceInfo?.row || 6;
      const cols = deviceStore.deviceInfo?.col || 21;
      
      // Ensure matrix exists
      if (keyboard.value.length === 0 || keyboard.value.length !== rows || keyboard.value[0].length !== cols) {
        initKeyboardMatrix(rows, cols);
      }

      // Read Layer 0 (fn=0)
      const layoutData = await service.getLayout(0, rows, cols);
      if (layoutData) {
        layoutData.forEach((rowVals, r) => {
          rowVals.forEach((val, c) => {
            if (keyboard.value[r] && keyboard.value[r][c]) {
              keyboard.value[r][c].keyValue[0] = val;
            }
          });
        });
      }
      deviceStore.addLog('Base layout loaded.');
    } catch (e: any) {
      deviceStore.addLog(`Layout load error: ${e.message}`);
    }
  };

  // Load performance data for all valid keys
  const getAllPerformance = async () => {
    const rows = keyboard.value.length;
    if (rows === 0) return;
    const cols = keyboard.value[0].length;

    deviceStore.addLog('Reading all key performance data...');
    
    let count = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Skip empty keys to save time and API calls
        if (keyboard.value[r][c].keyValue[0] === 0) continue;

        try {
          // In a real app, you might want to batch this or use a bulk API
          const data = await service.getKeyPerformance(r, c);
          if (data) {
            const key = keyboard.value[r][c];
            // Update key object with fetched data
            Object.assign(key, {
              travel: data.travel,
              isRT: data.isRT,
              rtPress: data.rtPress,
              rtRelease: data.rtRelease,
              topDeadZone: data.topDeadZone,
              bottomDeadZone: data.bottomDeadZone,
              releaseDeadZone: data.releaseDeadZone,
              // H-Hub uses rtTravel same as travel usually
              rtTravel: data.travel 
            });
            count++;
          }
        } catch (e) {
          // Ignore errors for individual keys to proceed
        }
      }
    }
    deviceStore.addLog(`Performance data loaded for ${count} keys.`);
  };

  // Select Key Logic
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

  // Full Init
  const init = async () => {
    if (!deviceStore.connectedDevice) return;
    isInitialized.value = false;
    await getBaseLayout();
    await getAllPerformance();
    isInitialized.value = true;
  };

  return {
    keyboard,
    selectedKeyList,
    isInitialized,
    init,
    getBaseLayout,
    getAllPerformance,
    selectKey,
    isKeySelected,
    clearSelection,
    selectAll
  };
});

