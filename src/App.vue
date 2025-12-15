<template>
  <div class="app-container">
    <header class="header">
      <div class="logo">H-Hub Web Demo</div>
      
      <nav v-if="deviceStore.connectedDevice" class="nav-menu">
        <router-link to="/lighting" class="nav-item" active-class="active">Lighting</router-link>
        <router-link to="/keytest" class="nav-item" active-class="active">Key Test</router-link>
      </nav>

      <div class="connection-status">
        <span v-if="deviceStore.connectedDevice" class="status-connected">● {{ deviceStore.connectedDevice.label }}</span>
        <button v-if="deviceStore.connectedDevice" @click="deviceStore.disconnect()" class="btn-disconnect">Disconnect</button>
      </div>
    </header>

    <main class="main-content" v-if="deviceStore.connectedDevice">
        <router-view></router-view>
    </main>

    <div v-else class="welcome-screen">
      <div class="mascot-container">
        <div class="mascot">⌨️</div>
      </div>
      <button @click="openScanModal" class="btn-authorize">Authorize device +</button>
    </div>

    <!-- Device Selection Modal (Removed for cleaner UI) -->
    <!-- We now use the browser's native WebHID picker directly -->
  </div>
</template>

<script setup lang="ts">
import { useDeviceStore } from './stores/device';
import { useLightingStore } from './stores/lighting';
// DeviceModal removed
import type { Device } from './stores/device';

const deviceStore = useDeviceStore();
const lightingStore = useLightingStore();

// const showModal = ref(false); // No longer needed

const openScanModal = async () => {
  // Direct WebHID flow:
  // 1. Trigger native browser picker (shows both paired and new devices)
  await deviceStore.requestNew();
  
  // 2. If user selected a device, auto-connect to the most recent one
  if (deviceStore.scannedDevices.length > 0) {
    // Usually the one user just picked is at the end or we can just pick the first valid one
    // HSDK scan() replaces the list, so we pick the first available.
    await handleConnect(deviceStore.scannedDevices[0]);
  }
};

const handleConnect = async (device: Device) => {
  const success = await deviceStore.connect(device.deviceId);
  if (success) {
    await lightingStore.readConfig();
  }
};
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #121212;
  color: #fff;
  font-family: 'Segoe UI', sans-serif;
}

.header {
  padding: 0 30px;
  height: 60px;
  background: #1e1e1e;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #333;
}

.logo {
  font-size: 1.2rem;
  font-weight: bold;
  background: linear-gradient(45deg, #2196F3, #9C27B0);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-right: 40px;
}

.nav-menu {
  display: flex;
  gap: 5px;
  height: 100%;
}

.nav-item {
  color: #888;
  text-decoration: none;
  font-weight: 600;
  padding: 0 20px;
  display: flex;
  align-items: center;
  border-bottom: 3px solid transparent;
  transition: all 0.2s;
  height: 100%;
  box-sizing: border-box;
}

.nav-item:hover {
  color: #ddd;
  background: rgba(255,255,255,0.05);
}

.nav-item.active {
  color: #fff;
  border-bottom-color: #2196F3;
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-left: auto;
}

.status-connected { color: #4CAF50; }

button {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-disconnect {
  background: #424242;
  color: #fff;
}

.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.welcome-screen {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #121212;
}

.mascot-container {
  width: 200px;
  height: 200px;
  background-color: #252525;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.mascot {
  font-size: 80px;
}

.btn-authorize {
  padding: 12px 24px;
  background-color: #333;
  color: #fff;
  border: 1px solid #444;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0,0,0,0.3);
}

.btn-authorize:hover {
  background-color: #444;
  border-color: #666;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.4);
}
</style>
