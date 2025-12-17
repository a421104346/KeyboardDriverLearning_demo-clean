<template>
  <div class="web-panel">
    <div class="panel-column left">
      <div class="section-title">
        <h3>网址按键 (WEB)</h3>
        <p>绑定一个按键，按下后自动打开指定网址。</p>
      </div>

      <div class="web-input-wrapper">
        <label for="web-url">URL 地址</label>
        <div class="input-group">
          <input 
            id="web-url" 
            type="text" 
            v-model="config.web" 
            placeholder="https://www.example.com"
            class="url-input"
          />
          <span class="length-hint">{{ config.web.length }} / {{ config.length }}</span>
        </div>
        <p class="hint">请以 http:// 或 https:// 开头</p>
      </div>
    </div>

    <!-- WEB Panel doesn't really need ChooseKey, but for consistency we can keep the layout or use the space for preview -->
    <div class="panel-column right empty-placeholder">
      <div class="preview">
        <span class="preview-icon">🌐</span>
        <span class="preview-text">一键直达</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

const config = reactive({
  length: 255, // Max length constraint
  web: 'https://www.google.com',
});
</script>

<style scoped>
.web-panel {
  display: flex;
  height: 100%;
  gap: 20px;
  padding: 10px;
}
.panel-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.section-title h3 {
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  color: #333;
}
.section-title p {
  margin: 0;
  font-size: 0.85rem;
  color: #888;
}
.web-input-wrapper {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.web-input-wrapper label {
  font-weight: 500;
  color: #333;
}
.input-group {
  display: flex;
  align-items: center;
  gap: 10px;
}
.url-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.2s;
}
.url-input:focus {
  border-color: #2196F3;
  outline: none;
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
}
.length-hint {
  font-size: 0.8rem;
  color: #999;
}
.hint {
  font-size: 0.8rem;
  color: #666;
  margin: 0;
}
.empty-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 8px;
}
.preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #ccc;
}
.preview-icon {
  font-size: 4rem;
  margin-bottom: 10px;
}
</style>
