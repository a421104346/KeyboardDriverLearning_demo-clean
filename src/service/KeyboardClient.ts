// @ts-ignore
import service from './index'; // The existing HSDK instance
import { KeyboardDeviceInfo, FeatureSet } from '../types/device';

interface KeyTravelData {
  keyId: string;
  keyName: string;
  currentTravel: number;
  isPressed: boolean;
}

export class KeyboardClient {
  private sdk = service;
  private cachedRows = 6;
  private cachedCols = 21;
  
  private keyTestCallback: ((data: KeyTravelData[]) => void) | null = null;
  private isKeyTesting = false;

  /**
   * Request user authorization for a new device (WebHID)
   */
  async requestDevice(): Promise<boolean> {
    if ((this.sdk as any).__isMock) {
      return true;
    }
    if (!('hid' in navigator)) {
      throw new Error('WebHID not supported');
    }

    const filters = [{ vendorId: 0x34b7, productId: 0xffff, usagePage: 0xff00, usage: 0x01 }];
    // @ts-ignore
    const devices = await navigator.hid.requestDevice({ filters });
    return devices.length > 0;
  }

  /**
   * Get all authorized/available devices
   */
  async getDevices(): Promise<KeyboardDeviceInfo[]> {
    const devices = await this.sdk.getDevices();
    return devices.map((d: any) => this.mapToDeviceInfo(d));
  }

  /**
   * Connect to a specific device
   */
  async connect(deviceId: string): Promise<KeyboardDeviceInfo> {
    const devices = await this.sdk.getDevices();
    // Compatible with different object structures (HSDK may return wrapped or direct objects)
    const target = devices.find((d: any) =>
      String(d.productId) === deviceId ||
      String(d.device?.productId) === deviceId ||
      String(d.id) === deviceId
    );

    if (!target) {
      throw new Error(`Device with ID ${deviceId} not found`);
    }

    const connectId = (target as any).id || target.device?.productId || target.productId;
    const success = await this.sdk.connectDevice(connectId);

    if (!success) {
      throw new Error('Connection failed');
    }

    // After successful connection, fetch full device info
    const info = await this.sdk.getDeviceInfo();
    const deviceInfo = this.mapToDeviceInfo(target);
    
    // Merge detailed info such as firmware version
    deviceInfo.version = info.fwVersion || 'Unknown';
    if (info.keyboardSN) deviceInfo.serialNumber = info.keyboardSN;

    // Cache rows/cols for key test
    this.cachedRows = info.row || 6;
    this.cachedCols = info.col || 21;

    return deviceInfo;
  }

  /**
   * Disconnect
   */
  async disconnect(): Promise<void> {
    this.stopKeyTest();
    await this.sdk.disconnectDevice();
  }

  /**
   * Get keyboard layout matrix
   */
  async getLayout(rows: number, cols: number): Promise<number[][]> {
    // The 0 here is layerIndex; the store previously passed 0 as well
    return await this.sdk.getLayout(0, rows, cols);
  }

  /**
   * Internal helper: map SDK device object to the standard type
   */
  private mapToDeviceInfo(sdkDevice: any): KeyboardDeviceInfo {
    const raw = sdkDevice.device || sdkDevice;
    
    // Default feature set; can be adjusted dynamically by deviceId or info
    const features: FeatureSet = {
      lighting: true,
      keyTest: true,
      keyRemap: true,
      macro: true,
    };

    return {
      id: String(raw.productId),
      name: raw.productName || 'Unknown Device',
      vendorId: raw.vendorId,
      productId: raw.productId,
      version: 'Unknown', // Updated after connection
      supportedFeatures: features,
      _raw: sdkDevice
    };
  }

  // --- Key Test Polling ---
  
  onKeyTestData(callback: (data: KeyTravelData[]) => void) {
    this.keyTestCallback = callback;
  }

  async startKeyTest() {
    if (this.isKeyTesting) return;
    this.isKeyTesting = true;
    this.pollKeyTest();
  }

  stopKeyTest() {
    this.isKeyTesting = false;
  }

  private async pollKeyTest() {
    while (this.isKeyTesting) {
      try {
        const travelMatrix = await this.sdk.getRealTimeTravel(this.cachedRows, this.cachedCols);
        // Convert to KeyTravelData[]
        const data: KeyTravelData[] = [];
        
        if (travelMatrix) {
          travelMatrix.forEach((row: number[], r: number) => {
            row.forEach((val: number, c: number) => {
              // val is likely 0-400 (for 4.00mm) or similar.
              // Just pass raw for now, let store/component handle normalization if needed.
              // Assuming val > 0 implies some press.
              data.push({
                keyId: `${r}-${c}`,
                keyName: '',
                currentTravel: val,
                isPressed: val > 20 // Arbitrary threshold for "Pressed" boolean
              });
            });
          });
          
          if (this.keyTestCallback) {
            this.keyTestCallback(data);
          }
        }
      } catch (e) {
        console.error('KeyTest poll error', e);
        await new Promise(r => setTimeout(r, 1000));
      }
      // Minimal delay to yield event loop
      await new Promise(r => setTimeout(r, 10));
    }
  }

  // --- Proxy methods for other SDK APIs ---

  async getDeviceInfo() {
    return await this.sdk.getDeviceInfo();
  }

  async getSupportAxis() {
    return await this.sdk.getSupportAxis();
  }

  // Performance
  async getKeyPerformance(row: number, col: number) {
    return await this.sdk.getKeyPerformance(row, col);
  }

  async setKeyPerformance(row: number, col: number, data: any) {
    return await this.sdk.setKeyPerformance(row, col, data);
  }

  // Lighting
  async getLightArea() {
    return await this.sdk.getLightArea();
  }

  async getLightConfigInfo(areaId: number) {
    return await this.sdk.getLightConfigInfo(areaId);
  }

  async getColorPanel(areaId: number) {
    return await this.sdk.getColorPanel(areaId);
  }

  async getColorID(areaId: number) {
    return await this.sdk.getColorID(areaId);
  }

  async setLightConfigInfo(config: any) {
    return await this.sdk.setLightConfigInfo(config);
  }

  async setLightAreaRGB(areaId: number, points: any[]) {
    return await this.sdk.setLightAreaRGB(areaId, points);
  }

  async setColorPanel(areaId: number, colors: any[]) {
    return await this.sdk.setColorPanel(areaId, colors);
  }

  async setColorID(areaId: number, id: number) {
    return await this.sdk.setColorID(areaId, id);
  }
}

export const keyboardClient = new KeyboardClient();
