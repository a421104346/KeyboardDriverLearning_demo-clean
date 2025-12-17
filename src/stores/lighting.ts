import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { hHubClient } from '../service/HHubClient';
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
  colorPanelHex: string[]; // 调色盘 HEX 值
  colorID: number; // 当前选中的调色盘 ID
  lightAreaRGB: any[][]; // 自定义灯效数据 [row][col]
}

export const useLightingStore = defineStore('lighting', () => {
  const deviceStore = useDeviceStore();
  
  // 支持多个灯光区域（目前主要使用 areaID 0）
  const lightConfigs = ref<LightAreaData[]>([]);
  const currentLightArea = ref(0);
  
  // 向后兼容的简化接口
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
    await hHubClient.setLightConfigInfo(config);
    deviceStore.addLog('Config updated (throttled).');
  }, 100);

  const sendColorPanel = asyncThrottle(async (areaId: number, colors: any[]) => {
    await hHubClient.setColorPanel(areaId, colors);
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

  // 初始化灯光区域（参考 H-Hub）
  const initLightArea = async () => {
    try {
      const areas = await hHubClient.getLightArea();
      if (!areas || areas.length === 0) {
        deviceStore.addLog('No light areas found');
        return;
      }

      lightAreas.value = areas;
      const newConfigs: LightAreaData[] = [];

      for (let i = 0; i < areas.length; i++) {
        const lightAreaInfo = areas[i];
        if (!lightAreaInfo) continue;

        const config = await hHubClient.getLightConfigInfo(lightAreaInfo.areaID);
        
        // 获取调色盘
        const colorPanel = await hHubClient.getColorPanel(lightAreaInfo.areaID);
        const colorPanelHex = colorPanel.colorList.map((item: any) => {
          return `#${item.r.toString(16).padStart(2, '0')}${item.g.toString(16).padStart(2, '0')}${item.b.toString(16).padStart(2, '0')}`;
        });

        // 获取当前 colorID
        const colorIDResult = await hHubClient.getColorID(lightAreaInfo.areaID);

        // 初始化 RGB 矩阵
        const lightAreaRGB: any[][] = Array.from(
          { length: lightAreaInfo.row },
          () => Array.from({ length: lightAreaInfo.col }, () => ({ r: 0, g: 0, b: 0 }))
        );

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

  // 更新配置（不改变 mode，除非明确指定）
  const updateConfig = async (newConfig: any, preserveMode = false) => {
    try {
      const area = lightConfigs.value.find(a => a.lightAreaInfo?.areaID === currentLightArea.value);
      if (!area) {
        deviceStore.addLog('No light area found for update');
        return;
      }

      // 如果 preserveMode 为 true，保持当前 mode
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

  // 设置 RGB（只在 Static/Custom 模式下有效）
  // Not throttled to prevent dropping points during rapid interactions
  const setRGB = async (points: any[]) => {
    try {
      const area = lightConfigs.value.find(a => a.lightAreaInfo?.areaID === currentLightArea.value);
      if (!area) {
        deviceStore.addLog('No light area found for RGB');
        return;
      }

      // 检查当前模式：只有 mode 0 (Static/Custom) 才能设置 RGB
      if (area.lightConfig.mode !== 0) {
        deviceStore.addLog(`Cannot set RGB in mode ${area.lightConfig.mode}. Please switch to Static/Custom mode first.`);
        return;
      }

      // 确保灯光是开启的
      if (!area.lightConfig.open) {
        deviceStore.addLog('Light is off. Turning on...');
        await updateConfig({ open: true }, true);
      }

      // Direct send for responsiveness on single clicks/drags
      await hHubClient.setLightAreaRGB(currentLightArea.value, points);
      
      // 更新本地 RGB 数据
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

  // 设置调色盘颜色
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

  // 设置 colorID
  const setColorID = async (id: number) => {
    try {
      const area = lightConfigs.value.find(a => a.lightAreaInfo?.areaID === currentLightArea.value);
      if (!area) return;

      await hHubClient.setColorID(currentLightArea.value, id);
      area.colorID = id;
      deviceStore.addLog(`ColorID set to ${id}`);
    } catch (e: any) {
      deviceStore.addLog(`Set ColorID error: ${e.message}`);
    }
  };

  return {
    // 新接口
    lightConfigs,
    currentLightArea,
    initLightArea,
    setColorPanel,
    setColorID,
    // 向后兼容接口
    lightConfig,
    selectedColor,
    lightAreas,
    readConfig,
    updateConfig,
    setRGB,
    currentLayout
  };
});
