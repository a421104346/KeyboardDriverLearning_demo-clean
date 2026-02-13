export interface FeatureSet {
  lighting: boolean;
  keyTest: boolean;
  keyRemap: boolean;
  macro: boolean;
}

export interface KeyboardDeviceInfo {
  id: string; // Usually maps to productId or deviceId
  name: string;
  vendorId: number;
  productId: number;
  serialNumber?: string;
  version: string; // Firmware version
  supportedFeatures: FeatureSet;
  // Keep original object for edge cases
  _raw?: any; 
}

export type DeviceConnectionState = 
  | 'idle'           // Initial state
  | 'authorizing'    // Waiting for WebHID user authorization
  | 'authorized'     // Authorized but not connected
  | 'connecting'     // Connecting
  | 'connected'      // Connected
  | 'disconnecting'  // Disconnecting
  | 'error';         // Error state

export interface DeviceState {
  state: DeviceConnectionState;
  currentDevice: KeyboardDeviceInfo | null;
  scannedDevices: KeyboardDeviceInfo[]; // List of authorized/scanned devices
  error: string | null;
}

