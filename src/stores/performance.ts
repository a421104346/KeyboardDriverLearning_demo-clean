import { defineStore } from 'pinia';
import { ref } from 'vue';
import service from '../service';
import { useDeviceStore } from './device';

export const usePerformanceStore = defineStore('performance', () => {
  const deviceStore = useDeviceStore();
  
  // Global performance settings (for bulk apply)
  const config = ref({
    travel: 0, // Will be loaded from device
    topDeadZone: 0,
    bottomDeadZone: 0,
    releaseDeadZone: 0,
    rtPress: 0, // Use device field names
    rtRelease: 0,
    isRT: false
  });
  
  const isLoading = ref(false);
  const isLoaded = ref(false);
  
  // Individual key performance data
  const keyPerformanceData = ref<any[][]>([]);

  // Read config from first valid key as reference
  const readConfig = async () => {
    isLoading.value = true;
    deviceStore.addLog('[Performance] Starting readConfig...');
    
    try {
      // Find first valid key from layout
      const layout = deviceStore.keyLayout;
      
      if (!layout || layout.length === 0) {
        deviceStore.addLog('[Performance] ERROR: keyLayout is empty!');
        return;
      }
      
      let firstKey = null;
      
      for (let r = 0; r < layout.length; r++) {
        for (let c = 0; c < layout[r].length; c++) {
          if (layout[r][c] !== 0) {
            firstKey = { row: r, col: c };
            break;
          }
        }
        if (firstKey) break;
      }
      
      if (!firstKey) {
        deviceStore.addLog('[Performance] ERROR: No valid keys found!');
        return;
      }
      
      deviceStore.addLog(`[Performance] Reading from key (${firstKey.row}, ${firstKey.col})...`);
      const data = await service.getKeyPerformance(firstKey.row, firstKey.col);
      
      deviceStore.addLog(`[Performance] Received data: travel=${data.travel}, isRT=${data.isRT}`);
      
      if (data) {
        const newConfig = {
          travel: data.travel || 1.5,
          topDeadZone: data.topDeadZone || 0,
          bottomDeadZone: data.bottomDeadZone || 0,
          releaseDeadZone: data.releaseDeadZone || 0,
          rtPress: data.rtPress || 0.001,
          rtRelease: data.rtRelease || 0.001,
          isRT: data.isRT || false
        };
        
        // Force update by replacing the entire object
        config.value = newConfig;
        isLoaded.value = true;
        
        deviceStore.addLog(`[Performance] Config loaded successfully! travel=${newConfig.travel}, topDeadZone=${newConfig.topDeadZone}, bottomDeadZone=${newConfig.bottomDeadZone}, releaseDeadZone=${newConfig.releaseDeadZone}`);
        console.log('[Performance Store] Config updated:', newConfig);
      }
    } catch (e: any) {
      deviceStore.addLog(`[Performance] ERROR: ${e.message}`);
      console.error('readConfig error:', e);
    } finally {
      isLoading.value = false;
    }
  };
  
  // Read ALL keys' performance data for display
  const readAllKeysPerformance = async () => {
    try {
      const layout = deviceStore.keyLayout;
      const rows = layout.length;
      const cols = layout[0]?.length || 0;
      
      // Initialize matrix
      const tempData: any[][] = Array.from({ length: rows }, () => 
        Array.from({ length: cols }, () => null)
      );
      
      deviceStore.addLog('Loading all keys performance...');
      let count = 0;
      
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (layout[r][c] === 0) continue;
          
          try {
            const data = await service.getKeyPerformance(r, c);
            tempData[r][c] = data;
            count++;
            
            // Log first key for debugging
            if (count === 1) {
              console.log('First key performance data:', data);
            }
          } catch (e) {
            console.error(`Failed to read key ${r},${c}`, e);
          }
        }
      }
      
      // Replace entire array to trigger reactivity
      keyPerformanceData.value = tempData;
      deviceStore.addLog(`Loaded ${count} keys performance data.`);
    } catch (e: any) {
      deviceStore.addLog(`Load all keys error: ${e.message}`);
    }
  };

  // Apply config to ALL valid keys
  const applyConfig = async () => {
    try {
      const layout = deviceStore.keyLayout;
      let count = 0;
      let total = 0;
      
      // Count total valid keys
      for (let r = 0; r < layout.length; r++) {
        for (let c = 0; c < layout[r].length; c++) {
          if (layout[r][c] !== 0) total++;
        }
      }
      
      deviceStore.addLog(`Applying to ${total} keys...`);
      
      // Iterate all valid keys
      for (let r = 0; r < layout.length; r++) {
        for (let c = 0; c < layout[r].length; c++) {
          if (layout[r][c] === 0) continue;
          
          // Use cached performance data (from readAllKeysPerformance)
          // instead of re-reading each time
          const cachedData = keyPerformanceData.value[r]?.[c];
          if (!cachedData) {
            console.warn(`No cached data for key ${r},${c}, skipping`);
            continue;
          }
          
          // Build complete keyInfo with user's settings
          const keyInfo = {
            row: r,
            col: c,
            // User's settings (these will override device values)
            travel: config.value.travel,
            isRT: config.value.isRT,
            rtPress: config.value.rtPress,
            rtRelease: config.value.rtRelease,
            topDeadZone: config.value.topDeadZone,
            bottomDeadZone: config.value.bottomDeadZone,
            releaseDeadZone: config.value.releaseDeadZone,
            // Preserved from cached data
            rtTravel: config.value.travel, // Set rtTravel = travel
            pressDeadZone: cachedData.pressDeadZone || 0,
            axis: cachedData.axis || 0,
          };
          
          await service.setKeyPerformance(r, c, keyInfo);
          count++;
          
          // Log progress every 10 keys
          if (count % 10 === 0) {
            deviceStore.addLog(`Progress: ${count}/${total}...`);
          }
        }
      }
      
      deviceStore.addLog(`Applied to ${count} keys. Reloading...`);
      
      // Wait a bit for device to persist changes
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Reload to reflect changes
      await readAllKeysPerformance();
      deviceStore.addLog('Reload complete.');
    } catch (e: any) {
      deviceStore.addLog(`Apply error: ${e.message}`);
    }
  };

  return { 
    config, 
    keyPerformanceData,
    isLoading,
    isLoaded,
    readConfig, 
    readAllKeysPerformance,
    applyConfig 
  };
});
