import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { keyboardClient } from '../service/KeyboardClient';
import { useDeviceStore } from './device';
import { asyncThrottle } from '../utils/throttle';

// Import layouts
import k61 from '../assets/layouts/k61.json';
import k64 from '../assets/layouts/k64.json';
import k68 from '../assets/layouts/k68.json';
import k84 from '../assets/layouts/k84.json';

export interface LightAreaData {
  lightAreaInfo: any; // LightAreaSizeInfo
  lightConfig: any; // LightConfigInfo
  colorPanelHex: string[]; // Palette HEX values
  colorID: number; // Currently selected palette ID
  lightAreaRGB: any[][]; // Custom lighting effect data [row][col]
}

export const useLightingStore = defineStore('lighting', () => {
  const deviceStore = useDeviceStore();
  
  // Supports multiple lighting areas (currently mainly areaID 0)
  const lightConfigs = ref<LightAreaData[]>([]);
  const currentLightArea = ref(0);
  
  // Backward-compatible simplified interface
  const lightConfig = computed(() => {
    const area = lightConfigs.value.find(a => a.lightAreaInfo?.areaID === currentLightArea.value);
    return area?.lightConfig || {
      open: true,
      mode: 0,
      brightness: 50,
      speed: 50
    };
  });
  
  const selectedColor = ref('#ff0000');
  const lightAreas = ref<any[]>([]);
  const currentLayout = ref<any[]>(k61.layout);

  // Throttled Send Functions
  const sendConfig = asyncThrottle(async (config: any) => {
    await keyboardClient.setLightConfigInfo(config);
    deviceStore.addLog('Config updated (throttled).');
  }, 100);

  const sendColorPanel = asyncThrottle(async (areaId: number, colors: any[]) => {
    await keyboardClient.setColorPanel(areaId, colors);
    deviceStore.addLog('Color panel updated (throttled).');
  }, 100);


  const loadLayout = () => {
     const layoutID = deviceStore.deviceInfo?.layoutID;
     let data: any = k61;
     
     if (layoutID === 4) data = k84;
     else if (layoutID === 5 || layoutID === 8) data = k68;
     else if (layoutID === 6 || layoutID === 7) data = k64;
     
     currentLayout.value = data.layout;
     deviceStore.addLog(`Layout loaded for ID ${layoutID}`);
  };

  // Initialize lighting areas (aligned with production app behavior)
  const initLightArea = async () => {
    try {
      const areas = await keyboardClient.getLightArea();
      if (!areas || areas.length === 0) {
        deviceStore.addLog('No light areas found');
        return;
      }

      lightAreas.value = areas;
      const newConfigs: LightAreaData[] = [];

      for (let i = 0; i < areas.length; i++) {
        const lightAreaInfo = areas[i];
        if (!lightAreaInfo) continue;

        const config = await keyboardClient.getLightConfigInfo(lightAreaInfo.areaID);
        
        // Get color palette
        const colorPanel = await keyboardClient.getColorPanel(lightAreaInfo.areaID);
        const colorPanelHex = colorPanel.colorList.map((item: any) => {
          return `#${item.r.toString(16).padStart(2, '0')}${item.g.toString(16).padStart(2, '0')}${item.b.toString(16).padStart(2, '0')}`;
        });

        // Get current colorID
        const colorIDResult = await keyboardClient.getColorID(lightAreaInfo.areaID);

        // Initialize RGB matrix
        // Try to preserve existing RGB data to avoid losing state on page switches
        const existingArea = lightConfigs.value.find(a => a.lightAreaInfo?.areaID === lightAreaInfo.areaID);
        let lightAreaRGB: any[][];

        if (existingArea && 
            existingArea.lightAreaRGB.length === lightAreaInfo.row && 
            existingArea.lightAreaRGB[0]?.length === lightAreaInfo.col) {
          lightAreaRGB = existingArea.lightAreaRGB;
        } else {
          lightAreaRGB = Array.from(
          { length: lightAreaInfo.row },
          () => Array.from({ length: lightAreaInfo.col }, () => ({ r: 0, g: 0, b: 0 }))
        );
        }

        newConfigs.push({
          lightAreaInfo,
          lightConfig: config,
          colorPanelHex,
          colorID: colorIDResult.colorID,
          lightAreaRGB
        });
      }

      lightConfigs.value = newConfigs;
      deviceStore.addLog(`Initialized ${lightConfigs.value.length} light areas`);
    } catch (e: any) {
      deviceStore.addLog(`Init light area error: ${e.message}`);
    }
  };

  const readConfig = async () => {
    try {
      loadLayout();
      await initLightArea();
      deviceStore.addLog('Config loaded.');
    } catch (e: any) {
      deviceStore.addLog(`Config load error: ${e.message}`);
    }
  };

  // Update configuration (do not change mode unless explicitly specified)
  const updateConfig = async (newConfig: any, preserveMode = false) => {
    try {
      const area = lightConfigs.value.find(a => a.lightAreaInfo?.areaID === currentLightArea.value);
      if (!area) {
        deviceStore.addLog('No light area found for update');
        return;
      }

      // If preserveMode is true, keep current mode
      if (preserveMode && area.lightConfig) {
        newConfig = { ...newConfig, mode: area.lightConfig.mode };
      }

      // Optimistic update
      area.lightConfig = { ...area.lightConfig, ...newConfig };
      
      // Send throttled
      sendConfig(area.lightConfig);
    } catch (e: any) {
      deviceStore.addLog(`Config update error: ${e.message}`);
    }
  };

  // Set RGB (only valid in Static/Custom mode)
  // Not throttled to prevent dropping points during rapid interactions
  const setRGB = async (points: any[]) => {
    try {
      const area = lightConfigs.value.find(a => a.lightAreaInfo?.areaID === currentLightArea.value);
      if (!area) {
        deviceStore.addLog('No light area found for RGB');
        return;
      }

      // Check current mode: only mode 0 (Static/Custom) can set RGB
      if (area.lightConfig.mode !== 0) {
        deviceStore.addLog(`Cannot set RGB in mode ${area.lightConfig.mode}. Please switch to Static/Custom mode first.`);
        return;
      }

      // Ensure lighting is enabled
      if (!area.lightConfig.open) {
        deviceStore.addLog('Light is off. Turning on...');
        await updateConfig({ open: true }, true);
      }

      // Direct send for responsiveness on single clicks/drags
      await keyboardClient.setLightAreaRGB(currentLightArea.value, points);
      
      // Update local RGB data
      points.forEach((point: any) => {
        if (area.lightAreaRGB[point.position.row] && area.lightAreaRGB[point.position.row][point.position.col]) {
          area.lightAreaRGB[point.position.row][point.position.col] = point.rgb;
        }
      });
      
      // deviceStore.addLog(`RGB set for ${points.length} points`); // Too spammy if not throttled
    } catch (e: any) {
      deviceStore.addLog(`RGB error: ${e.message}`);
    }
  };

  // Set palette colors
  const setColorPanel = async (colors: {r: number, g: number, b: number}[]) => {
    try {
      const area = lightConfigs.value.find(a => a.lightAreaInfo?.areaID === currentLightArea.value);
      if (!area) return;

      // Optimistic update
      area.colorPanelHex = colors.map(c => {
        return `#${c.r.toString(16).padStart(2, '0')}${c.g.toString(16).padStart(2, '0')}${c.b.toString(16).padStart(2, '0')}`;
      });

      // Send throttled
      sendColorPanel(currentLightArea.value, colors);
    } catch (e: any) {
      deviceStore.addLog(`Set color panel error: ${e.message}`);
    }
  };

  // Set colorID
  const setColorID = async (id: number) => {
    try {
      const area = lightConfigs.value.find(a => a.lightAreaInfo?.areaID === currentLightArea.value);
      if (!area) return;

      await keyboardClient.setColorID(currentLightArea.value, id);
      area.colorID = id;
      deviceStore.addLog(`ColorID set to ${id}`);
    } catch (e: any) {
      deviceStore.addLog(`Set ColorID error: ${e.message}`);
    }
  };

  return {
    // New interface
    lightConfigs,
    currentLightArea,
    initLightArea,
    setColorPanel,
    setColorID,
    // Backward-compatible interface
    lightConfig,
    selectedColor,
    lightAreas,
    readConfig,
    updateConfig,
    setRGB,
    currentLayout
  };
});
