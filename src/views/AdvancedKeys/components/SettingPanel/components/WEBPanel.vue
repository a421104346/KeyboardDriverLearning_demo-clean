<template>
  <div class="web-panel">
    <div class="panel-column left">
      <div class="section-title">
        <h3>网址按键 (WEB)</h3>
        <p>绑定一个按键，按下后自动打开指定网址。</p>
      </div>

      <div class="web-input-wrapper">
        <div class="input-label-row">
        <label for="web-url">URL 地址</label>
          <span class="length-hint">{{ config.web.length }} / {{ config.length }}</span>
        </div>
        <div class="input-group">
          <input 
            id="web-url" 
            type="text" 
            v-model="config.web" 
            placeholder="https://www.example.com"
            class="url-input"
          />
        </div>
        <p class="hint">请以 http:// 或 https:// 开头</p>
      </div>
    </div>

    <!-- WEB Panel doesn't really need ChooseKey -->
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
  gap: 40px;
  padding: 10px;
  box-sizing: border-box;
}

.panel-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.panel-column.right {
  flex: 1.2;
}

.section-title {
  margin-bottom: 2px;
}

.section-title h3 {
  margin: 0 0 2px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.section-title p {
  margin: 0;
  font-size: 0.85rem;
  color: #999;
  line-height: 1.4;
}

.web-input-wrapper {
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.input-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.web-input-wrapper label {
  font-weight: 500;
  color: #333;
  font-size: 0.95rem;
}

.length-hint {
  font-size: 0.8rem;
  color: #999;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.url-input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: all 0.2s;
  color: #333;
}

.url-input:focus {
  border-color: #000;
  outline: none;
}

.hint {
  font-size: 0.8rem;
  color: #ccc;
  margin: 0;
}

.empty-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9f9f9;
  border-radius: 8px;
}

.preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #e0e0e0;
}

.preview-icon {
  font-size: 4rem;
  margin-bottom: 10px;
}

.preview-text {
  font-size: 0.9rem;
  color: #bbb;
}
</style>
