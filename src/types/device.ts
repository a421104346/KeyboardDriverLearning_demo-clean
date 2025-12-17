export interface FeatureSet {
  lighting: boolean;
  keyTest: boolean;
  keyRemap: boolean;
  macro: boolean;
}

export interface HHubDeviceInfo {
  id: string; // 通常对应 productId 或 deviceId
  name: string;
  vendorId: number;
  productId: number;
  serialNumber?: string;
  version: string; // 固件版本
  supportedFeatures: FeatureSet;
  // 保留原始对象以备不时之需
  _raw?: any; 
}

export type DeviceConnectionState = 
  | 'idle'           // 初始化
  | 'authorizing'    // 等待用户授权 WebHID
  | 'authorized'     // 已授权，未连接
  | 'connecting'     // 正在连接
  | 'connected'      // 已连接
  | 'disconnecting'  // 正在断开
  | 'error';         // 错误状态

export interface DeviceState {
  state: DeviceConnectionState;
  currentDevice: HHubDeviceInfo | null;
  scannedDevices: HHubDeviceInfo[]; // 已授权/扫描到的设备列表
  error: string | null;
}

