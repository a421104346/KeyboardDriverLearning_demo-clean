<template>
  <div class="preset-panel">
    <div class="panel">
      <h4 class="panel-title">Performance Preset</h4>
      
      <div class="carousel-container">
        <!-- Left Arrow -->
        <button class="nav-btn prev-btn" @click="prev">
          <ChevronLeftIcon />
        </button>

        <!-- Carousel Track -->
        <div class="carousel-viewport">
          <div class="carousel-track">
            <!-- 
               Render ALL games.
               We use CSS transforms to position them based on their relative distance 
               to the activeIndex.
            -->
            <div 
              v-for="(game, index) in games" 
              :key="game.id" 
              class="game-card"
              :class="{ 
                'is-active': index === activeIndex,
                'is-prev': getCircularDiff(index) === -1,
                'is-next': getCircularDiff(index) === 1,
              }"
              :style="getItemStyle(index)"
              @click="handleItemClick(index)"
            >
              <div class="game-logo-wrapper">
                <img :src="game.logo" :alt="game.name" class="game-logo" />
              </div>
              <transition name="fade">
                 <span v-if="index === activeIndex" class="game-name">{{ game.name }}</span>
              </transition>
            </div>
          </div>
        </div>

        <!-- Right Arrow -->
        <button class="nav-btn next-btn" @click="next">
          <ChevronRightIcon />
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ChevronLeftIcon, ChevronRightIcon } from 'tdesign-icons-vue-next';

// Import logos
import cs2Logo from '@/assets/images/Games_logo/counter-strike-2-seeklogo.svg';
import dota2Logo from '@/assets/images/Games_logo/dota-2-logo-png_seeklogo-442452.svg';
import lolLogo from '@/assets/images/Games_logo/league-of-legends-seeklogo.svg';
import valorantLogo from '@/assets/images/Games_logo/valorant-seeklogo.svg';
import mbLogo from '@/assets/images/Games_logo/MBlogo.svg';

const games = [
  { id: 'default', name: 'Default', logo: mbLogo },
  { id: 'cs2', name: 'CS 2', logo: cs2Logo },
  { id: 'valorant', name: 'VALORANT', logo: valorantLogo },
  { id: 'lol', name: 'League of Legends', logo: lolLogo },
  { id: 'dota2', name: 'Dota 2', logo: dota2Logo },
];

const activeIndex = ref(0);
const ITEM_SPACING = 160; 

// Calculate shortest circular distance
const getCircularDiff = (index: number) => {
  const len = games.length;
  let diff = (index - activeIndex.value) % len;
  
  // Normalize to [-len/2, len/2]
  if (diff > len / 2) diff -= len;
  if (diff < -len / 2) diff += len;
  
  return diff;
};

const getItemStyle = (index: number) => {
  const diff = getCircularDiff(index);
  const translateX = diff * ITEM_SPACING;
  
  const absDiff = Math.abs(diff);
  const scale = Math.max(1 - absDiff * 0.2, 0.6); 
  // Ensure strict invisibility at edges to hide the "fly-over" effect
  const opacity = Math.max(1 - absDiff * 0.5, 0); 
  
  const blur = absDiff > 0 ? '6px' : '0px'; 
  const grayscale = absDiff > 0 ? '1' : '0';
  const zIndex = 10 - Math.round(absDiff); // Ensure integer z-index

  return {
    transform: `translateX(${translateX}px) scale(${scale})`,
    opacity,
    filter: `blur(${blur}) grayscale(${grayscale})`,
    zIndex,
    // Hide interaction for invisible items
    pointerEvents: (absDiff > 1 ? 'none' : 'auto') as 'none' | 'auto',
  };
};

const handleItemClick = (index: number) => {
  const diff = getCircularDiff(index);
  if (diff === -1) prev();
  if (diff === 1) next();
};

const prev = () => {
  activeIndex.value = (activeIndex.value - 1 + games.length) % games.length;
};

const next = () => {
  activeIndex.value = (activeIndex.value + 1) % games.length;
};
</script>

<style scoped lang="scss">
.preset-panel {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.panel {
  padding: 20px;
  background: var(--bg-color-card, #fff);
  border-radius: 8px;
  text-align: left;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.panel-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary, #333);
  text-align: center;
}

.carousel-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  position: relative;
  flex: 1; 
  overflow: visible;
  min-height: 200px;
}

.carousel-viewport {
  width: 500px;
  max-width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  perspective: 1000px;
}

.carousel-track {
  position: relative;
  width: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.game-card {
  position: absolute;
  width: 140px;
  height: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border-radius: 12px;
  background-color: #fff;
  cursor: pointer;
  
  /* Smooth transition for all properties including filter */
  transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
  
  box-shadow: none;
  border: 1px solid transparent;
  user-select: none;
}

.game-card.is-active {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  border-color: #e5e5e5;
}

.game-logo-wrapper {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.game-logo {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.game-name {
  margin-top: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  text-align: center;
}

.nav-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #e0e0e0;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
}

.nav-btn:hover {
  background: #f5f5f5;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
