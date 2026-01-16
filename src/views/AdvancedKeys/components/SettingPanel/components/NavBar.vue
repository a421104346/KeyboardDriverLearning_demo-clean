<template>
  <div class="nav-bar-wrapper">
    <div class="nav-bar">
      <div class="nav-indicator" :style="indicatorStyle"></div>
      <div 
        v-for="(tab, index) in tabs" 
        :key="tab.id"
        :ref="el => setItemRef(el, index)"
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
import { ref, computed, watch, nextTick, onMounted } from 'vue';

interface Tab {
  id: string;
  label: string;
}

const props = defineProps<{
  tabs: Tab[];
  modelValue: string;
}>();

defineEmits(['update:modelValue']);

// --- Indicator Logic ---
const itemRefs = ref<(HTMLElement | null)[]>([]);
const indicatorLeft = ref(0);
const indicatorWidth = ref(0);
const indicatorTop = ref(0);
const indicatorHeight = ref(0);

const setItemRef = (el: any, index: number) => {
  if (el) itemRefs.value[index] = el;
};

const updateIndicator = () => {
  const index = props.tabs.findIndex(t => t.id === props.modelValue);
  if (index !== -1 && itemRefs.value[index]) {
    const el = itemRefs.value[index];
    if (el) {
      indicatorLeft.value = el.offsetLeft;
      indicatorTop.value = el.offsetTop;
      indicatorWidth.value = el.offsetWidth;
      indicatorHeight.value = el.offsetHeight;
    }
  }
};

const indicatorStyle = computed(() => ({
  transform: `translate(${indicatorLeft.value}px, ${indicatorTop.value}px)`,
  width: `${indicatorWidth.value}px`,
  height: `${indicatorHeight.value}px`
}));

watch(() => props.modelValue, () => {
  nextTick(updateIndicator);
});

onMounted(() => {
  nextTick(() => {
    setTimeout(updateIndicator, 50);
  });
});
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
  position: relative; /* Context for indicator */
}

.nav-indicator {
  position: absolute;
  top: 0;
  left: 0;
  background-color: #222;
  border-radius: 6px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  z-index: 1;
}

.nav-item {
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 6px;
  font-size: 1rem; /* Match button font size */
  font-weight: 600; /* Match button font weight */
  color: #666;
  transition: color 0.2s; /* Only animate color */
  user-select: none;
  white-space: nowrap;
  position: relative;
  z-index: 2; /* Sit above indicator */
}

.nav-item:hover {
  /* background: #f5f5f5; */
  color: #333;
}

.nav-item.active {
  /* background: #222; */
  color: #fff;
}
</style>

