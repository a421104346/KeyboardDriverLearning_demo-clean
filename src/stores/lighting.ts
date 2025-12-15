import { defineStore } from 'pinia';
import { ref } from 'vue';
import service from '../service';
import { useDeviceStore } from './device';

// Import layouts
import k61 from '../assets/layouts/k61.json';
import k64 from '../assets/layouts/k64.json';
import k68 from '../assets/layouts/k68.json';
import k84 from '../assets/layouts/k84.json';

export const useLightingStore = defineStore('lighting', () => {
  const deviceStore = useDeviceStore();
  
  const lightConfig = ref({
    open: true,
    mode: 0,
    brightness: 50,
    speed: 50
  });
  
  const selectedColor = ref('#ff0000');
  const lightAreas = ref<any[]>([]);
  const currentLayout = ref<any[]>(k61.layout);

  const loadLayout = () => {
     const layoutID = deviceStore.connectedDevice?.info?.layoutID;
     let data: any = k61;
     
     if (layoutID === 4) data = k84;
     else if (layoutID === 5 || layoutID === 8) data = k68;
     else if (layoutID === 6 || layoutID === 7) data = k64;
     
     currentLayout.value = data.layout;
     deviceStore.addLog(`Layout loaded for ID ${layoutID}`);
  };

  const readConfig = async () => {
    try {
      // Load layout based on device info
      loadLayout();

      const areas = await service.getLightArea();
      if (areas) lightAreas.value = areas;
      
      const config = await service.getLightConfigInfo(0);
      lightConfig.value = config;
      deviceStore.addLog('Config loaded.');
    } catch (e: any) {
      deviceStore.addLog(`Config load error: ${e.message}`);
    }
  };

  const updateConfig = async (newConfig: any) => {
    try {
      lightConfig.value = newConfig;
      await service.setLightConfigInfo(newConfig);
      deviceStore.addLog('Config updated.');
    } catch (e: any) {
      deviceStore.addLog(`Config update error: ${e.message}`);
    }
  };

  const setRGB = async (points: any[]) => {
    try {
      // Use setLightAreaRGB (Static) which maps to Custom Mode
      await service.setLightAreaRGB(0, points);
    } catch (e: any) {
      deviceStore.addLog(`RGB error: ${e.message}`);
    }
  };

  return {
    lightConfig,
    selectedColor,
    lightAreas,
    readConfig,
    updateConfig,
    setRGB,
    currentLayout
  };
});
