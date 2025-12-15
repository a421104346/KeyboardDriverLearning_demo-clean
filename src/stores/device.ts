import { defineStore } from 'pinia';
import { ref } from 'vue';
import service from '../service';
import type { DeviceInfo } from '../sdk/protocol/types/interface';

export interface Device {
  deviceId: string;
  label: string;
  info?: DeviceInfo;
}

export const useDeviceStore = defineStore('device', () => {
  const connectedDevice = ref<Device | null>(null);
  const scannedDevices = ref<Device[]>([]);
  const isScanning = ref(false);
  const logs = ref<string[]>([]);
  
  // Device details
  const deviceInfo = ref<any>(null);
  const keyLayout = ref<number[][]>([]);
  const supportedAxes = ref<any>(null);

  const addLog = (msg: string) => {
    logs.value.unshift(`${new Date().toLocaleTimeString()} - ${msg}`);
  };

  const scan = async () => {
    isScanning.value = true;
    try {
      const result = await service.getDevices();
      scannedDevices.value = result.map((d: any) => ({
        deviceId: d.productId || d.device?.productId,
        label: d.productName || d.device?.productName || 'Unknown Device'
      }));
    } catch (e: any) {
      addLog(`Scan error: ${e.message}`);
    } finally {
      isScanning.value = false;
    }
  };

  const requestNew = async () => {
    try {
      if ('hid' in navigator) {
        const filters = [{ vendorId: 0x34b7, productId: 0xffff, usagePage: 0xff00, usage: 0x01 }];
        // @ts-ignore
        const devices = await navigator.hid.requestDevice({ filters });
        
        // Only scan if user actually selected a device
        if (devices.length > 0) {
            await scan();
        } else {
            addLog('No device selected.');
        }
      } else {
        addLog('WebHID not supported.');
      }
    } catch (e: any) {
      addLog(`Request error: ${e.message}`);
    }
  };

  const connect = async (productId: any) => {
    const devices = await service.getDevices();
    const target = devices.find((d: any) => (d.productId === productId || d.device?.productId === productId));
    
    if (target) {
      // HSDK XJHIDDevice wrapper has 'id'
      const id = (target as any).id || target.device.productId;
      if (await service.connectDevice(id)) {
        connectedDevice.value = { 
          deviceId: String(target.device.productId), 
          label: target.device.productName || 'Keyboard' 
        };
        addLog('Connected.');
        
        // Fetch device details
        try {
          const info = await service.getDeviceInfo();
          deviceInfo.value = info;
          addLog(`Device: ${info.keyboardSN || 'N/A'}, FW: ${info.fwVersion}`);
          
          // Get key layout
          const rows = info.row || 5;
          const cols = info.col || 14;
          const layout = await service.getLayout(0, rows, cols);
          keyLayout.value = layout;
          addLog(`Layout loaded: ${rows}x${cols}`);
          
          // Log layout data for debugging
          console.log('Key Layout Matrix:', layout);
          
          // Get supported axes
          try {
            const axes = await service.getSupportAxis();
            supportedAxes.value = axes;
            addLog(`Axes: ${axes.axisCount} types`);
          } catch (e) {
            addLog('Axis info not available.');
          }
        } catch (e: any) {
          addLog(`Get info failed: ${e.message}`);
        }

        return true;
      }
    }
    return false;
  };

  const disconnect = async () => {
    await service.disconnectDevice();
    connectedDevice.value = null;
    addLog('Disconnected.');
  };

  return {
    connectedDevice,
    scannedDevices,
    isScanning,
    logs,
    deviceInfo,
    keyLayout,
    supportedAxes,
    addLog,
    scan,
    requestNew,
    connect,
    disconnect
  };
});
