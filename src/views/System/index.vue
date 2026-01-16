<template>
  <div class="system-page" v-animate-stagger>
    <div class="header stagger-enter">
      <div class="icon-wrapper">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"/>
        </svg>
      </div>
      <span class="title">System Settings</span>
    </div>

    <t-card :bordered="false" class="settings-card stagger-enter">
      <div class="setting-list">
        <!-- Polling Rate Settings -->
        <div class="setting-item">
          <div class="info">
            <div class="item-title">Polling Rate</div>
            <div class="item-desc">Adjust USB polling rate, higher rate means faster response</div>
          </div>
          <div class="control">
            <t-select 
              v-model="settings.reportRate" 
              :options="rateOptions" 
              borderless
              :filterable="false"
              align="right"
              style="width: 100px"
            />
          </div>
        </div>

        <t-divider />

        <!-- System Switch -->
        <div class="setting-item">
          <div class="info">
            <div class="item-title">System Switch</div>
            <div class="item-desc">Switch keyboard system compatibility mode</div>
          </div>
          <div class="control">
            <t-select 
              v-model="settings.systemMode" 
              :options="systemOptions"
              borderless
              :filterable="false"
              align="right"
              style="width: 120px"
            />
          </div>
        </div>

        <t-divider />

        <!-- Win Lock -->
        <div class="setting-item">
          <div class="info">
            <div class="item-title">Win Lock</div>
            <div class="item-desc">Lock Windows key to prevent accidental presses in games</div>
          </div>
          <div class="control">
            <t-switch v-model="settings.winLock" size="large" />
          </div>
        </div>

        <t-divider />

        <!-- Full Key Lock -->
        <div class="setting-item">
          <div class="info">
            <div class="item-title">Full Key Lock</div>
            <div class="item-desc">Lock all keys to prevent accidental presses</div>
          </div>
          <div class="control">
            <t-switch v-model="settings.fullKeyLock" size="large" />
          </div>
        </div>

        <t-divider />

        <!-- Factory Reset -->
        <div class="setting-item">
          <div class="info">
            <div class="item-title">Factory Reset</div>
            <div class="item-desc">Restore all settings to factory defaults, this action cannot be undone</div>
          </div>
          <div class="control">
            <t-button variant="outline" theme="danger" @click="handleReset">
              Reset
            </t-button>
          </div>
        </div>
      </div>
    </t-card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';

const settings = reactive({
  reportRate: '8k',
  systemMode: 'Windows',
  winLock: true,
  fullKeyLock: false
});

const rateOptions = [
  { label: '4k', value: '4k' },
  { label: '8k', value: '8k' }
];

const systemOptions = [
  { label: 'Windows', value: 'Windows' },
  { label: 'Mac', value: 'Mac' }
];

const handleReset = () => {
  MessagePlugin.success('Factory reset successful');
  settings.reportRate = '8k';
  settings.systemMode = 'Windows';
  settings.winLock = false;
  settings.fullKeyLock = false;
};
</script>

<style scoped lang="scss">
.system-page {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
  align-items: center; /* Horizontal Center */
  justify-content: center; /* Vertical Center */
  gap: 24px;
}

.header {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 800px; /* Limit Width */

  .icon-wrapper {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    background-color: #000;
    border-radius: 8px;
    
    svg {
      width: 20px;
      height: 20px;
    }
  }

  .title {
    font-size: 20px;
    font-weight: 600;
    color: #333;
  }
}

.settings-card {
  width: 100%;
  max-width: 800px; /* Limit Width */
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  
  :deep(.t-card__body) {
    padding: 8px 32px;
  }

  /* Override TDesign Select styles to look like plain text */
  :deep(.t-select__wrap) {
    width: auto;
    
    .t-input {
      background: transparent;
      border: none;
      box-shadow: none !important;
      padding: 0;
    }
    
    .t-input__inner {
      text-align: right;
      font-size: 14px;
      color: #333;
    }
    
    .t-input--focused {
      box-shadow: none !important;
    }
  }
}

.setting-list {
  display: flex;
  flex-direction: column;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;

  .info {
    .item-title {
      font-size: 16px;
      font-weight: 500;
      color: #333;
      margin-bottom: 4px;
    }

    .item-desc {
      font-size: 14px;
      color: #999;
    }
  }

  .control {
    display: flex;
    align-items: center;
  }
}

:deep(.t-divider) {
  margin: 0;
  opacity: 0.6;
}
</style>
