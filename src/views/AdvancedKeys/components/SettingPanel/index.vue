<template>
  <div class="setting-container">
    <!-- Navigation Bar (Capsule Style) -->
    <NavBar 
      v-model="currentTab" 
      :tabs="tabs"
    />

    <!-- Add Button below navbar, aligned left -->
    <div class="button-wrapper">
      <button class="btn-add-advanced" @click="showModal = true">
        <span class="icon">+</span>
        <span class="text">添加高级键</span>
      </button>
    </div>

    <!-- Modal Dialog -->
    <Modal 
      :show="showModal" 
      :title="currentTabTitle"
      @close="showModal = false"
      @confirm="handleConfirm"
    >
      <component :is="currentTabComponent" />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import NavBar from './components/NavBar.vue';
import Modal from './components/Modal.vue';
import SOCDPanel from './components/SOCDPanel.vue';
import DKSPanel from './components/DKSPanel.vue';
import ModTapPanel from './components/ModTapPanel.vue';
import MPTPanel from './components/MPTPanel.vue';
import ToggleKeyPanel from './components/ToggleKeyPanel.vue';
import ENDPanel from './components/ENDPanel.vue';
import EKPanel from './components/EKPanel.vue';
import WEBPanel from './components/WEBPanel.vue';

const currentTab = ref('socd');
const showModal = ref(false);

const tabs = [
  { id: 'socd', label: '优先设定 (SOCD)', component: SOCDPanel },
  { id: 'dks', label: '动态键程 (DKS)', component: DKSPanel },
  { id: 'modtap', label: '双效点击 (MT)', component: ModTapPanel },
  { id: 'mpt', label: '多点触发 (MPT)', component: MPTPanel },
  { id: 'toggle', label: '切换开关 (TGL)', component: ToggleKeyPanel },
  { id: 'end', label: '松开触发 (END)', component: ENDPanel },
  { id: 'ek', label: '封禁键 (EK)', component: EKPanel },
  { id: 'web', label: '网址按键 (WEB)', component: WEBPanel }
];

const currentTabComponent = computed(() => {
  const tab = tabs.find(t => t.id === currentTab.value);
  return tab ? tab.component : SOCDPanel;
});

const currentTabTitle = computed(() => {
  const tab = tabs.find(t => t.id === currentTab.value);
  return tab ? tab.label : '';
});

const handleConfirm = () => {
  console.log('Confirm advanced key settings for:', currentTab.value);
  // TODO: Save settings to device
  showModal.value = false;
};
</script>

<style scoped>
.setting-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  position: relative; /* For modal positioning */
}

.button-wrapper {
  padding-left: 10px; /* Align with navbar */
}

.btn-add-advanced {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 28px;
  background: #fff;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.btn-add-advanced:hover {
  border-color: #2196F3;
  color: #2196F3;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(33, 150, 243, 0.2);
}

.btn-add-advanced:active {
  transform: translateY(0);
}

.btn-add-advanced .icon {
  font-size: 1.4rem;
  font-weight: 300;
}

.btn-add-advanced .text {
  letter-spacing: 0.5px;
}
</style>
