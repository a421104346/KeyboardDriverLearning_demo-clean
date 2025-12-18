<template>
  <div class="firmware-page">
    <!-- Top Section: Current Device -->
    <t-card :bordered="false" class="device-card">
      <div class="card-header">
        <div class="icon-wrapper">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="6" width="20" height="12" rx="2" />
            <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h.01M10 14h.01M14 14h.01M18 14h.01" />
          </svg>
        </div>
        <span class="card-title">当前设备</span>
      </div>
      
      <div class="device-info-grid">
        <div class="info-item">
          <div class="label">设备名称</div>
          <div class="value primary-text">HM03</div>
        </div>
        <div class="info-item">
          <div class="label">设备ID <CopyIcon class="copy-icon" /></div>
          <div class="value id-text">HPGPMOmXIPOfGfnLopKyRHfojmKjKM4o</div>
        </div>
        <div class="info-item">
          <div class="label">当前版本</div>
          <div class="value link-text">V0.0.01</div>
        </div>
        <div class="info-item">
          <div class="label">运行状态</div>
          <div class="value success-text">APP模式_A分区</div>
        </div>
      </div>
    </t-card>

    <!-- Bottom Section: Upgrades -->
    <div class="upgrade-container">
      <!-- Local Upgrade -->
      <t-card :bordered="false" class="upgrade-card local-upgrade">
        <div class="card-header-with-desc">
          <div class="icon-wrapper">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </div>
          <div class="header-text">
            <div class="title">本地升级</div>
            <div class="desc">从本地选择固件文件进行升级</div>
          </div>
        </div>

        <div class="content-area">
          <!-- Empty state or file list could go here -->
        </div>

        <div class="actions">
          <t-button variant="outline" class="action-btn">
            <template #icon><UploadIcon /></template>
            选择文件
          </t-button>
          <t-button theme="primary" class="action-btn start-btn">
            <template #icon><ArrowRightIcon /></template>
            开始升级
          </t-button>
        </div>
      </t-card>

      <!-- Online Upgrade -->
      <t-card :bordered="false" class="upgrade-card online-upgrade">
        <div class="card-header-with-desc">
          <div class="icon-wrapper">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <div class="header-text">
            <div class="title">在线升级</div>
            <div class="desc">从服务器获取最新固件版本</div>
          </div>
        </div>

        <div class="version-list">
          <div class="version-item">
            <div class="version-left">
              <span class="version-number">v1.0.0</span>
              <t-tag theme="primary" variant="light" size="small" class="new-tag">最新</t-tag>
            </div>
            <div class="version-right">
              <span class="date">2025-01-01</span>
              <span class="size">180 KB</span>
              <ChevronDownIcon />
            </div>
          </div>
          
          <div class="version-item">
            <div class="version-left">
              <span class="version-number">v0.0.9</span>
            </div>
            <div class="version-right">
              <span class="date">2024-12-31</span>
              <span class="size">179.78 KB</span>
              <ChevronDownIcon />
            </div>
          </div>
        </div>
      </t-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CopyIcon, UploadIcon, ArrowRightIcon, ChevronDownIcon } from 'tdesign-icons-vue-next';
</script>

<style scoped lang="scss">
.firmware-page {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Common Icon Wrapper */
.icon-wrapper {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background-color: #7B61FF; /* Purple accent from image */
  border-radius: 12px;
  flex-shrink: 0;
  
  svg {
    width: 24px;
    height: 24px;
  }
}

.device-card {
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);

  :deep(.t-card__body) {
    padding: 24px 32px;
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 32px;

    .card-title {
      font-size: 20px;
      font-weight: 700;
      color: #333;
    }
  }

  .device-info-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;

    .info-item {
      display: flex;
      flex-direction: column;
      align-items: flex-start; /* 确保文字左对齐 */

      .label {
        font-size: 14px;
        color: #909399;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        gap: 6px;
        
        .copy-icon {
          cursor: pointer;
          color: #909399;
          font-size: 14px;
          &:hover {
             color: #7B61FF;
          }
        }
      }

      .value {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        
        &.id-text {
          font-size: 14px;
        }
        
        &.primary-text {
          color: #333;
        }
        
        &.link-text {
          color: #7B61FF;
          cursor: pointer;
        }
        
        &.success-text {
          color: #67C23A;
        }
      }
    }
  }
}

.upgrade-container {
  display: flex;
  gap: 24px;
  flex: 1;
  min-height: 0; /* Allow scrolling if needed */
  
  .upgrade-card {
    flex: 1;
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;

    :deep(.t-card__body) {
      padding: 32px;
      height: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
    }

    .card-header-with-desc {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;

      .header-text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        
        .title {
          font-size: 18px;
          font-weight: 700;
          color: #333;
          margin-bottom: 4px;
        }
        
        .desc {
          font-size: 14px;
          color: #909399;
        }
      }
    }

    &.local-upgrade {
      .content-area {
        flex: 1;
        /* Placeholder for file selection area */
        min-height: 200px; 
      }

      .actions {
        display: flex;
        gap: 16px;
        margin-top: auto;
        
        .action-btn {
          height: 40px;
          border-radius: 8px;
        }
        
        .start-btn {
          background-color: #9F8DFF; /* Lighter purple from image button */
          border-color: #9F8DFF;
          width: 120px;
          
          &:hover {
            background-color: #7B61FF;
            border-color: #7B61FF;
          }
        }
      }
    }

    &.online-upgrade {
      .version-list {
        display: flex;
        flex-direction: column;
        gap: 0;
        
        .version-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 0;
          border-bottom: 1px solid #f0f0f0;
          cursor: pointer;
          
          &:last-child {
            border-bottom: none;
          }

          .version-left {
            display: flex;
            align-items: center;
            gap: 12px;
            
            .version-number {
              font-size: 16px;
              font-weight: 600;
              color: #333;
            }
          }

          .version-right {
            display: flex;
            align-items: center;
            gap: 24px;
            color: #909399;
            font-size: 14px;
            
            .t-icon {
              color: #ccc;
            }
          }
        }
      }
    }
  }
}
</style>
