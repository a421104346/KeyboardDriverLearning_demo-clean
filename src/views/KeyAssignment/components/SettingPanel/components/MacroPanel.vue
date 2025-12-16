<template>
  <div class="macro-key-panel">
    <div class="key-grid">
      <div 
        v-for="i in 16" 
        :key="i" 
        class="key-item"
        @click="$emit('select-key', `M${i}`)"
      >
        <span class="key-text">M{{ i }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits(['select-key']);
</script>

<style scoped>
.macro-key-panel {
  width: 100%;
  padding: 10px 0;
  display: flex;
  justify-content: center;
}

.key-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  max-width: 1200px;
}

.key-item {
  width: 50px;
  height: 50px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

.key-item:hover {
  border-color: #2196F3;
  color: #2196F3;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(33, 150, 243, 0.15);
}

.key-text {
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
}

.key-item:hover .key-text {
  color: #2196F3;
}
</style>
