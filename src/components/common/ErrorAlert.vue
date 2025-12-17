<template>
  <div class="error-alerts">
    <div v-for="(err, index) in errorStore.errors" :key="index" class="error-alert">
      <span>{{ err.message }}</span>
      <button class="close-btn" @click="remove(index)">×</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useErrorStore } from '../../stores/error';

const errorStore = useErrorStore();

const remove = (index: number) => {
    errorStore.errors.splice(index, 1);
};
</script>

<style scoped>
.error-alerts {
  position: fixed;
  top: 80px; /* Below header */
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.error-alert {
  background-color: #f44336;
  color: white;
  padding: 12px 20px;
  border-radius: 4px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 300px;
  animation: slideIn 0.3s ease;
}

.close-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  margin-left: auto;
  padding: 0 5px;
}

@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
</style>

