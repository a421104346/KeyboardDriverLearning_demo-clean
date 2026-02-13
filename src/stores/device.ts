import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { keyboardClient } from '../service/KeyboardClient';
import { isPreviewMode } from '../service';
import type { DeviceConnectionState, KeyboardDeviceInfo } from '../types/device';

export const useDeviceStore = defineStore('device', () => {
  // State Machine
  const state = ref<DeviceConnectionState>('idle');
  const currentDevice = ref<KeyboardDeviceInfo | null>(null);
  const scannedDevices = ref<KeyboardDeviceInfo[]>([]);
  const error = ref<string | null>(null);

  // Device Details (cached after connection)
  const deviceInfo = ref<any>(null);
  const keyLayout = ref<number[][]>([]);
  const supportedAxes = ref<any>(null);

  // Getters
  const isConnecting = computed(() => state.value === 'connecting');
  const isConnected = computed(() => state.value === 'connected');
  const canConnect = computed(() => ['idle', 'authorized', 'error'].includes(state.value));
  const isPreview = computed(() => isPreviewMode);

  // Helper
  const addLog = (msg: string) => {
    console.log(`[DeviceStore] ${msg}`);
  };

  /**
   * Request WebHID permission
   */
  const requestNew = async () => {
    state.value = 'authorizing';
    try {
      const authorized = await keyboardClient.requestDevice();
      if (authorized) {
        state.value = 'authorized';
        await scan();
      } else {
        state.value = 'idle';
        addLog('User cancelled device selection');
      }
    } catch (e: any) {
      state.value = 'error';
      error.value = e.message;
      addLog(`Request error: ${e.message}`);
    }
  };

  /**
   * Scan for available devices
   */
  const scan = async () => {
    try {
      const devices = await keyboardClient.getDevices();
      scannedDevices.value = devices;
      addLog(`Scanned ${devices.length} devices`);
      if (devices.length > 0 && state.value === 'idle') {
          state.value = 'authorized';
      }
    } catch (e: any) {
      addLog(`Scan error: ${e.message}`);
    }
  };

  /**
   * Connect to a specific device
   */
  const connect = async (deviceId: string) => {
    if (state.value === 'connecting') return;
    
    state.value = 'connecting';
    addLog(`Connecting to ${deviceId}...`);

    try {
      const device = await keyboardClient.connect(deviceId);
      currentDevice.value = device;
      
      // Load initial data
      try {
        const info = await keyboardClient.getDeviceInfo();
        deviceInfo.value = info;
        
        // Update device version info
        if (currentDevice.value) {
            currentDevice.value.version = info.fwVersion;
            currentDevice.value.serialNumber = info.keyboardSN;
        }

        const rows = info.row || 5;
        const cols = info.col || 14;
        keyLayout.value = await keyboardClient.getLayout(rows, cols);
        
        try {
            supportedAxes.value = await keyboardClient.getSupportAxis();
        } catch (e) {
            console.warn('Axis support check failed', e);
        }

        state.value = 'connected';
        error.value = null;
        addLog(`Connected to ${device.name}`);
      } catch (innerErr: any) {
        // Connected but failed to init data?
        console.error('Failed to initialize device data', innerErr);
        // We still consider it connected, but maybe with warnings
        state.value = 'connected'; 
        addLog(`Connected but init failed: ${innerErr.message}`);
      }

    } catch (e: any) {
      state.value = 'error';
      error.value = e.message;
      currentDevice.value = null;
      addLog(`Connection failed: ${e.message}`);
    }
  };

  /**
   * Preview-only connect (no WebHID required)
   */
  const connectPreview = async () => {
    try {
      await scan();
      if (scannedDevices.value.length === 0) {
        throw new Error('No preview device available');
      }
      await connect(scannedDevices.value[0].id);
    } catch (e: any) {
      state.value = 'error';
      error.value = e.message;
      addLog(`Preview connect failed: ${e.message}`);
    }
  };

  /**
   * Disconnect
   */
  const disconnect = async () => {
    state.value = 'disconnecting';
    try {
      await keyboardClient.disconnect();
    } catch (e) {
      console.warn('Disconnect error', e);
    } finally {
      state.value = 'idle';
      currentDevice.value = null;
      keyLayout.value = [];
      deviceInfo.value = null;
      addLog('Disconnected');
    }
  };

  return {
    // State
    state,
    currentDevice, // Renamed from connectedDevice (but typed better)
    scannedDevices,
    error,
    
    // Details
    deviceInfo,
    keyLayout,
    supportedAxes,

    // Getters
    isConnecting,
    isConnected,
    canConnect,
    isPreview,
    
    // Actions
    requestNew,
    scan,
    connect,
    connectPreview,
    disconnect,
    addLog
  };
});
