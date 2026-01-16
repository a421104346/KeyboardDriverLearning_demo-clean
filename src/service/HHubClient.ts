// @ts-ignore
import service from './index'; // The existing HSDK instance
import { HHubDeviceInfo, FeatureSet } from '../types/device';
import { KeyTravelData } from '../types/keytest';

export class HHubClient {
  private sdk = service;
  private cachedRows = 6;
  private cachedCols = 21;
  
  private keyTestCallback: ((data: KeyTravelData[]) => void) | null = null;
  private isKeyTesting = false;

  /**
   * 请求用户授权新设备 (WebHID)
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
   * 获取所有已授权/可用的设备
   */
  async getDevices(): Promise<HHubDeviceInfo[]> {
    const devices = await this.sdk.getDevices();
    return devices.map((d: any) => this.mapToDeviceInfo(d));
  }

  /**
   * 连接指定设备
   */
  async connect(deviceId: string): Promise<HHubDeviceInfo> {
    const devices = await this.sdk.getDevices();
    // 兼容不同的对象结构 (HSDK 似乎有时返回包装对象，有时直接返回)
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

    // 连接成功后，获取完整信息
    const info = await this.sdk.getDeviceInfo();
    const deviceInfo = this.mapToDeviceInfo(target);
    
    // 合并固件版本等详细信息
    deviceInfo.version = info.fwVersion || 'Unknown';
    if (info.keyboardSN) deviceInfo.serialNumber = info.keyboardSN;

    // Cache rows/cols for key test
    this.cachedRows = info.row || 6;
    this.cachedCols = info.col || 21;

    return deviceInfo;
  }

  /**
   * 断开连接
   */
  async disconnect(): Promise<void> {
    this.stopKeyTest();
    await this.sdk.disconnectDevice();
  }

  /**
   * 获取键盘布局矩阵
   */
  async getLayout(rows: number, cols: number): Promise<number[][]> {
    // 这里的 0 是 layerIndex? 之前 store 里传的是 0
    return await this.sdk.getLayout(0, rows, cols);
  }

  /**
   * 内部方法：将 SDK 的设备对象映射为标准类型
   */
  private mapToDeviceInfo(sdkDevice: any): HHubDeviceInfo {
    const raw = sdkDevice.device || sdkDevice;
    
    // 默认特性集，后续可以根据 deviceId 或 info 动态调整
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
      version: 'Unknown', // 连接后更新
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

  // --- 代理 SDK 的其他方法 ---

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

export const hHubClient = new HHubClient();
