<template>
  <div class="media-key-panel">
    <div class="key-grid">
      <div 
        v-for="item in mediaKeys" 
        :key="item.name" 
        class="media-key-item"
        @click="$emit('select-key', item.name)"
        :title="item.label"
      >
        <img :src="getIconPath(item.icon)" :alt="item.label" class="key-icon" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const mediaKeys = [
  { label: 'Microphone', name: 'Microphone', icon: '20484_MicroPhone.svg' },
  { label: 'Screen Brightness +', name: 'Brightness+', icon: '20591_ScreenLightness+.svg' },
  { label: 'Screen Brightness -', name: 'Brightness-', icon: '20592_ScreenLightness-.svg' },
  { label: 'Next Track', name: 'Next Track', icon: '20661_NextTrack.svg' },
  { label: 'Previous Track', name: 'Prev Track', icon: '20662_PreviousTrack.svg' },
  { label: 'Stop', name: 'Stop', icon: '20663_Stop.svg' },
  { label: 'Play/Pause', name: 'Play/Pause', icon: '20685_PlayOrPause.svg' },
  { label: 'Mute', name: 'Mute', icon: '20706_Mute.svg' },
  { label: 'Volume +', name: 'Volume+', icon: '20713_Volume+.svg' },
  { label: 'Volume -', name: 'Volume-', icon: '20714_Volume-.svg' },
  { label: 'Multimedia Player', name: 'Player', icon: '20867_MultimediaPlayer.svg' },
  { label: 'Email', name: 'Email', icon: '20874_Email.svg' },
  { label: 'Calculator', name: 'Calculator', icon: '20882_Calculator.svg' },
  { label: 'Browser', name: 'Browser', icon: '20884_Browser.svg' },
  { label: 'Search', name: 'Search', icon: '21025_Search.svg' },
  { label: 'Browser Home', name: 'Browser Home', icon: '21027_Browser.svg' },
  { label: 'Browser Back', name: 'Browser Back', icon: '21028_PreviousPageBrowser.svg' },
  { label: 'Browser Forward', name: 'Browser Forward', icon: '21029_NextPageBrowser.svg' },
  { label: 'Browser Stop', name: 'Browser Stop', icon: '21030_StopBrowser.svg' },
  { label: 'Browser Refresh', name: 'Browser Refresh', icon: '21031_RefreshBrowser.svg' },
  { label: 'Browser Bookmarks', name: 'Bookmarks', icon: '21034_BookmarksBrowser.svg' },
  { label: 'macOS Task Center', name: 'Task Center', icon: '21151_MacosTaskCenter.svg' },
  { label: 'macOS Launchpad', name: 'Launchpad', icon: '21154_MacosBootConsole.svg' },
];

const getIconPath = (filename: string) => {
  return new URL(`../../../../../assets/images/KeyIcon/media/${filename}`, import.meta.url).href;
};

defineEmits(['select-key']);
</script>

<style scoped>
.media-key-panel {
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

.media-key-item {
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

.media-key-item:hover {
  border-color: #2196F3;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(33, 150, 243, 0.15);
}

.key-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
  opacity: 0.7;
  transition: opacity 0.2s;
  /* If SVGs are white, invert them to black/dark gray */
  filter: invert(0.8) sepia(0) saturate(0) hue-rotate(0deg) brightness(0.8) contrast(1.2);
}

.media-key-item:hover .key-icon {
  opacity: 1;
  /* Make it slightly darker/sharper on hover */
  filter: invert(0) sepia(0) saturate(0) hue-rotate(0deg) brightness(0) contrast(1);
}
</style>
