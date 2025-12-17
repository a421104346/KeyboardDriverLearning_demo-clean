<template>
  <div class="choose-key-card">
    <!-- Tab 导航 -->
    <div class="choose-key-tabs">
      <div 
        v-for="tab in tabs" 
        :key="tab.value"
        class="tab-item"
        :class="{ active: activeTab === tab.value }"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
      </div>
    </div>

    <!-- 按键列表 -->
    <div class="choose-key-list-wrapper">
      <div class="choose-key-list">
        <Key v-for="key in currentKeyList" :key="key" :key-value="Number(key)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { KEY_MAP } from '@/config/keymap';
import Key from './Key.vue';

// 定义支持的类型
// 您的 keymap.ts 目前主要是基础按键，我暂时将所有按键归为 'basic'，后续您可以扩展 keymap.ts 添加 type 字段
const props = defineProps<{
  types?: string[];
}>();

const activeTab = ref('basic');

const tabs = [
  { label: '基础按键', value: 'basic' },
  // { label: '媒体', value: 'media' }, // 暂时注释，除非 keymap 支持分类
  // { label: '鼠标', value: 'mouse' },
];

// 简单过滤：这里暂时显示所有 keymap 中的按键
// 实际项目中，建议在 keymap.ts 中为每个按键添加 { type: 'basic' | 'media' } 属性来进行过滤
const currentKeyList = computed(() => {
  // 这里简单返回所有数字键值
  return Object.keys(KEY_MAP).map(Number).filter(k => k > 0);
});

</script>

<style scoped>
.choose-key-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #f9f9f9;
  border-radius: 8px;
  overflow: hidden;
}

.choose-key-tabs {
  display: flex;
  padding: 0 16px;
  border-bottom: 1px solid #e0e0e0;
  background: #fff;
}

.tab-item {
  padding: 12px 16px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab-item:hover {
  color: #2196F3;
}

.tab-item.active {
  color: #2196F3;
  border-bottom-color: #2196F3;
  font-weight: 600;
}

.choose-key-list-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.choose-key-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>

