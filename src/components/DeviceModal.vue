<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h3>Select Device</h3>
      <div v-if="devices.length > 0" class="device-list">
        <div 
          v-for="d in devices" 
          :key="d.id" 
          class="device-item"
          @click="$emit('connect', d)"
        >
          <span class="device-name">{{ d.name }}</span>
          <span class="device-id">ID: {{ d.id }}</span>
        </div>
      </div>
      <div v-else class="no-devices">
        <p>No authorized devices found.</p>
        <button @click="$emit('request')" class="btn-primary">Authorize New Device</button>
      </div>
      <button class="btn-close" @click="$emit('close')">Cancel</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { KeyboardDeviceInfo } from '../types/device';

defineProps<{
  devices: KeyboardDeviceInfo[];
}>();

defineEmits(['close', 'connect', 'request']);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: #252525;
  padding: 24px;
  border-radius: 12px;
  width: 400px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  border: 1px solid #444;
}

.modal-content h3 {
  margin-top: 0;
  border-bottom: 1px solid #444;
  padding-bottom: 10px;
  color: #fff;
}

.device-list {
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.device-item {
  background: #333;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.2s;
}

.device-item:hover {
  background: #444;
}

.device-name {
  font-weight: 600;
  color: #fff;
}

.device-id {
  font-size: 0.8em;
  color: #888;
}

.no-devices {
  text-align: center;
  padding: 20px 0;
  color: #888;
}

.btn-primary {
  width: 100%;
  padding: 10px;
  background: #2196F3;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  margin-bottom: 10px;
  font-weight: 600;
}
.btn-primary:hover {
  background: #1976D2;
}

.btn-close {
  background: transparent;
  border: 1px solid #444;
  color: #888;
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
}
.btn-close:hover {
  border-color: #666;
  color: #fff;
}
</style>

