<template>
  <div class="app-container">
    <header class="header">
      <div class="logo">H-Hub Web Demo</div>
      
      <nav v-if="deviceStore.connectedDevice" class="nav-menu">
        <router-link to="/keyperformance" class="nav-item" active-class="active">Key Performance</router-link>
        <router-link to="/keyassignment" class="nav-item" active-class="active">Key Assignment</router-link>
        <router-link to="/advancedkeys" class="nav-item" active-class="active">Advanced Keys</router-link>
        <router-link to="/lighting" class="nav-item" active-class="active">Lighting</router-link>
        <router-link to="/macros" class="nav-item" active-class="active">Macros</router-link>
        <router-link to="/system" class="nav-item" active-class="active">System</router-link>
        <router-link to="/configurations" class="nav-item" active-class="active">Configs</router-link>
        <router-link to="/firmware" class="nav-item" active-class="active">Firmware</router-link>
      </nav>

      <div class="connection-status">
        <span v-if="deviceStore.connectedDevice" class="status-connected">● {{ deviceStore.connectedDevice.label }}</span>
        <button v-if="deviceStore.connectedDevice" @click="deviceStore.disconnect()" class="btn-disconnect">Disconnect</button>
      </div>
    </header>

    <template v-if="deviceStore.connectedDevice">
      <main class="main-content">
        <router-view></router-view>
      </main>

      <!-- Logs Panel - Always visible when device is connected -->
      <div class="logs-panel">
        <div class="logs-header">
          <span>Device Logs</span>
          <button @click="toggleLogs" class="btn-toggle-logs">{{ logsExpanded ? '−' : '+' }}</button>
        </div>
        <div v-if="logsExpanded" class="logs-content">
          <div v-for="(log, i) in deviceStore.logs" :key="i" class="log-line">{{ log }}</div>
          <div v-if="deviceStore.logs.length === 0" class="log-empty">No logs yet...</div>
        </div>
      </div>
    </template>

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
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useDeviceStore } from './stores/device';
import { useLightingStore } from './stores/lighting';
// DeviceModal removed
import type { Device } from './stores/device';

const router = useRouter();
const deviceStore = useDeviceStore();
const lightingStore = useLightingStore();
const logsExpanded = ref(true);

// Watch for device connection changes
watch(() => deviceStore.connectedDevice, (newDevice) => {
  if (newDevice) {
    router.push('/keyperformance');
  }
});

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

const toggleLogs = () => {
  logsExpanded.value = !logsExpanded.value;
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
  min-height: 0; /* Allow flex shrinking */
  position: relative;
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

/* Logs Panel - At bottom of flex container */
.logs-panel {
  background: #1a1a1a;
  border-top: 1px solid #333;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  max-height: 300px;
}

.logs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: #252525;
  border-bottom: 1px solid #333;
  font-size: 0.9rem;
  font-weight: 600;
  color: #ccc;
}

.btn-toggle-logs {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 4px 8px;
  line-height: 1;
  min-width: 24px;
}

.btn-toggle-logs:hover {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.logs-content {
  flex: 1;
  overflow-y: auto;
  padding: 10px 16px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 0.75rem;
  color: #0f0;
  background: #000;
  max-height: 250px;
}

.log-line {
  margin: 2px 0;
  word-break: break-all;
}

.log-empty {
  color: #666;
  font-style: italic;
  text-align: center;
  padding: 20px;
}
</style>
