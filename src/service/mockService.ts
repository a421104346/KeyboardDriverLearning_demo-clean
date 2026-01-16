const PREVIEW_KEY_LAYOUT: number[][] = [
  // Row 0
  [16425, 16414, 16415, 16416, 16417, 16418, 16419, 16420, 16421, 16422, 16423, 16429, 16430, 16426],
  // Row 1
  [16427, 16405, 16406, 16407, 16408, 16409, 16410, 16411, 16412, 16413, 16404, 16431, 16432, 16433],
  // Row 2
  [16441, 16388, 16389, 16390, 16391, 16392, 16393, 16394, 16395, 16396, 16397, 16435, 16436, 16424],
  // Row 3
  [16609, 0, 16398, 16399, 16400, 16401, 16402, 16403, 16404, 16438, 16439, 16440, 0, 16613],
  // Row 4
  [16608, 16611, 16610, 0, 0, 0, 16428, 0, 0, 0, 16610, 16485, 16612, 16614],
];

const DEFAULT_COLOR_PANEL = [
  { r: 255, g: 0, b: 0 },
  { r: 255, g: 128, b: 0 },
  { r: 255, g: 255, b: 0 },
  { r: 0, g: 255, b: 0 },
  { r: 0, g: 255, b: 255 },
  { r: 0, g: 128, b: 255 },
  { r: 128, g: 0, b: 255 },
  { r: 255, g: 0, b: 255 },
];

const createMatrix = <T>(rows: number, cols: number, fill: () => T) =>
  Array.from({ length: rows }, () => Array.from({ length: cols }, () => fill()));

export const createMockService = () => {
  const lightConfigMap = new Map<number, any>();
  const colorPanelMap = new Map<number, { colorList: { r: number; g: number; b: number }[] }>();
  const colorIdMap = new Map<number, number>();
  const lightAreaRGBMap = new Map<number, { r: number; g: number; b: number }[][]>();

  const defaultLightConfig = {
    open: true,
    mode: 0,
    brightness: 80,
    speed: 80,
  };

  const ensureLightArea = (areaId: number, rows: number, cols: number) => {
    if (!lightConfigMap.has(areaId)) {
      lightConfigMap.set(areaId, { ...defaultLightConfig });
    }
    if (!colorPanelMap.has(areaId)) {
      colorPanelMap.set(areaId, { colorList: DEFAULT_COLOR_PANEL.slice() });
    }
    if (!colorIdMap.has(areaId)) {
      colorIdMap.set(areaId, 0);
    }
    if (!lightAreaRGBMap.has(areaId)) {
      lightAreaRGBMap.set(areaId, createMatrix(rows, cols, () => ({ r: 0, g: 0, b: 0 })));
    }
  };

  return {
    __isMock: true,

    async getDevices() {
      return [
        {
          productId: 0xffff,
          vendorId: 0x34b7,
          productName: 'Preview Keyboard',
        },
      ];
    },

    async connectDevice() {
      return true;
    },

    async disconnectDevice() {
      return true;
    },

    async getDeviceInfo() {
      return {
        fwVersion: 'Preview',
        keyboardSN: 'PREVIEW-0001',
        row: 5,
        col: 14,
        layoutID: 6,
      };
    },

    async getLayout(_layerIndex: number, rows: number, cols: number) {
      const matrix = createMatrix(rows, cols, () => 0);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          matrix[r][c] = PREVIEW_KEY_LAYOUT[r]?.[c] ?? 0;
        }
      }
      return matrix;
    },

    async getSupportAxis() {
      return { axisCount: 3, axisList: [1, 2, 3] };
    },

    async getKeyPerformance(row: number, col: number) {
      return {
        travel: 4.0,
        isRT: false,
        rtPress: 0.5,
        rtRelease: 0.5,
        topDeadZone: 0,
        bottomDeadZone: 0,
        releaseDeadZone: 0,
        pressDeadZone: 0,
        axis: ((row + col) % 3) + 1,
      };
    },

    async setKeyPerformance() {
      return true;
    },

    async getLightArea() {
      const area = { areaID: 0, row: 5, col: 14 };
      ensureLightArea(area.areaID, area.row, area.col);
      return [area];
    },

    async getLightConfigInfo(areaId: number) {
      ensureLightArea(areaId, 5, 14);
      return lightConfigMap.get(areaId);
    },

    async getColorPanel(areaId: number) {
      ensureLightArea(areaId, 5, 14);
      return colorPanelMap.get(areaId);
    },

    async getColorID(areaId: number) {
      ensureLightArea(areaId, 5, 14);
      return { colorID: colorIdMap.get(areaId) ?? 0 };
    },

    async setLightConfigInfo(config: any) {
      const areaId = config?.areaID ?? 0;
      ensureLightArea(areaId, 5, 14);
      lightConfigMap.set(areaId, { ...lightConfigMap.get(areaId), ...config });
      return true;
    },

    async setLightAreaRGB(areaId: number, points: any[]) {
      ensureLightArea(areaId, 5, 14);
      const matrix = lightAreaRGBMap.get(areaId)!;
      points.forEach((point) => {
        const { row, col } = point.position || {};
        if (matrix[row]?.[col]) {
          matrix[row][col] = point.rgb;
        }
      });
      return true;
    },

    async setColorPanel(areaId: number, colors: any[]) {
      ensureLightArea(areaId, 5, 14);
      colorPanelMap.set(areaId, { colorList: colors });
      return true;
    },

    async setColorID(areaId: number, id: number) {
      ensureLightArea(areaId, 5, 14);
      colorIdMap.set(areaId, id);
      return true;
    },

    async getRealTimeTravel(rows: number, cols: number) {
      return createMatrix(rows, cols, () => {
        const active = Math.random() > 0.85;
        return active ? Number((Math.random() * 4).toFixed(2)) : 0;
      });
    },

    async getKeyTriggerState(rows: number, cols: number) {
      return createMatrix(rows, cols, () => (Math.random() > 0.9 ? 1 : 0));
    },

    async finishAdjusting() {
      return true;
    },
  };
};
