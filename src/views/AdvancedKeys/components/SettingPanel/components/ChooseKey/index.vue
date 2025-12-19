<template>
  <div class="choose-key-card">
    <!-- Tab Navigation -->
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

    <!-- Key List -->
    <div class="choose-key-list-wrapper">
      <div class="choose-key-list">
        <Key 
          v-for="item in currentKeyList" 
          :key="item.name || item.value" 
          :key-data="item"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { KEY_MAP } from '@/config/keymap';
import Key from './Key.vue';

const activeTab = ref('basic');

const tabs = [
  { label: 'Basic Keys', value: 'basic' },
  { label: 'Media Keys', value: 'media' },
  { label: 'Mouse Keys', value: 'mouse' },
];

// Media Keys Data (from MediaKeyPanel.vue)
const mediaKeys = [
  { label: 'Microphone', name: 'Microphone', icon: '20484_MicroPhone.svg', type: 'media' },
  { label: 'Screen Brightness +', name: 'Brightness+', icon: '20591_ScreenLightness+.svg', type: 'media' },
  { label: 'Screen Brightness -', name: 'Brightness-', icon: '20592_ScreenLightness-.svg', type: 'media' },
  { label: 'Next Track', name: 'Next Track', icon: '20661_NextTrack.svg', type: 'media' },
  { label: 'Previous Track', name: 'Prev Track', icon: '20662_PreviousTrack.svg', type: 'media' },
  { label: 'Stop', name: 'Stop', icon: '20663_Stop.svg', type: 'media' },
  { label: 'Play/Pause', name: 'Play/Pause', icon: '20685_PlayOrPause.svg', type: 'media' },
  { label: 'Mute', name: 'Mute', icon: '20706_Mute.svg', type: 'media' },
  { label: 'Volume +', name: 'Volume+', icon: '20713_Volume+.svg', type: 'media' },
  { label: 'Volume -', name: 'Volume-', icon: '20714_Volume-.svg', type: 'media' },
  { label: 'Multimedia Player', name: 'Player', icon: '20867_MultimediaPlayer.svg', type: 'media' },
  { label: 'Email', name: 'Email', icon: '20874_Email.svg', type: 'media' },
  { label: 'Calculator', name: 'Calculator', icon: '20882_Calculator.svg', type: 'media' },
  { label: 'Browser', name: 'Browser', icon: '20884_Browser.svg', type: 'media' },
  { label: 'Search', name: 'Search', icon: '21025_Search.svg', type: 'media' },
  { label: 'Browser Home', name: 'Browser Home', icon: '21027_Browser.svg', type: 'media' },
  { label: 'Browser Back', name: 'Browser Back', icon: '21028_PreviousPageBrowser.svg', type: 'media' },
  { label: 'Browser Forward', name: 'Browser Forward', icon: '21029_NextPageBrowser.svg', type: 'media' },
  { label: 'Browser Stop', name: 'Browser Stop', icon: '21030_StopBrowser.svg', type: 'media' },
  { label: 'Browser Refresh', name: 'Browser Refresh', icon: '21031_RefreshBrowser.svg', type: 'media' },
  { label: 'Browser Bookmarks', name: 'Bookmarks', icon: '21034_BookmarksBrowser.svg', type: 'media' },
  { label: 'macOS Task Center', name: 'Task Center', icon: '21151_MacosTaskCenter.svg', type: 'media' },
  { label: 'macOS Launchpad', name: 'Launchpad', icon: '21154_MacosBootConsole.svg', type: 'media' },
];

// Mouse Keys Data (from MousePanel.vue)
const mouseKeys = [
  { label: 'Mouse Up', name: 'Mouse Up', icon: '6657_MouseUp.svg', type: 'mouse' },
  { label: 'Mouse Down', name: 'Mouse Down', icon: '6658_MouseDown.svg', type: 'mouse' },
  { label: 'Mouse Left', name: 'Mouse Left', icon: '6659_MouseLeft.svg', type: 'mouse' },
  { label: 'Mouse Right', name: 'Mouse Right', icon: '6660_MouseRight.svg', type: 'mouse' },
  { label: 'Wheel Up', name: 'Wheel Up', icon: '6661_MouseWheelUp.svg', type: 'mouse' },
  { label: 'Wheel Down', name: 'Wheel Down', icon: '6662_MouseWheelDown.svg', type: 'mouse' },
  { label: 'Left Click', name: 'Left Click', icon: '6663_MouseLeftClick.svg', type: 'mouse' },
  { label: 'Right Click', name: 'Right Click', icon: '6664_MouseRightClick.svg', type: 'mouse' },
  { label: 'Middle Click', name: 'Middle Click', icon: '6665_MouseMiddleClick.svg', type: 'mouse' },
  { label: 'Scroll Up', name: 'Scroll Up', icon: '6666_MouseScrollUp.svg', type: 'mouse' },
  { label: 'Scroll Down', name: 'Scroll Down', icon: '6667_MouseScrollDown.svg', type: 'mouse' },
];

const currentKeyList = computed(() => {
  if (activeTab.value === 'basic') {
    return Object.keys(KEY_MAP)
      .map(Number)
      .filter(k => k > 0 && k < 60000 && k !== 1574) // Filter out K1574
      .map(k => ({
        value: k,
        type: 'basic'
      }));
  } else if (activeTab.value === 'media') {
    return mediaKeys;
  } else if (activeTab.value === 'mouse') {
    return mouseKeys;
  }
  return [];
});

</script>

<style scoped>
.choose-key-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #f9f9f9;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.choose-key-tabs {
  display: flex;
  padding: 8px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  gap: 8px;
}

.tab-item {
  padding: 6px 12px;
  font-size: 0.9rem;
  color: #666;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
  font-weight: 500;
}

.tab-item:hover {
  background: #f5f5f5;
  color: #333;
}

.tab-item.active {
  background: #222;
  color: #fff;
}

.choose-key-list-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #fff;
}

.choose-key-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
