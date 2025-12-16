<template>
  <div class="nav-bar-wrapper">
    <div class="nav-bar">
      <div 
        v-for="tab in tabs" 
        :key="tab.id"
        class="nav-item"
        :class="{ active: modelValue === tab.id }"
        @click="$emit('update:modelValue', tab.id)"
      >
        {{ tab.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Tab {
  id: string;
  label: string;
}

defineProps<{
  tabs: Tab[];
  modelValue: string;
}>();

defineEmits(['update:modelValue']);
</script>

<style scoped>
.nav-bar-wrapper {
  padding-left: 10px;
  display: flex;
  justify-content: flex-start; /* Align left */
}

.nav-bar {
  display: inline-flex;
  background: #fff;
  border-radius: 8px;
  padding: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  gap: 4px;
}

.nav-item {
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 6px;
  font-size: 1rem; /* Match button font size */
  font-weight: 600; /* Match button font weight */
  color: #666;
  transition: all 0.2s;
  user-select: none;
  white-space: nowrap;
}

.nav-item:hover {
  background: #f5f5f5;
  color: #333;
}

.nav-item.active {
  background: #222;
  color: #fff;
}
</style>

