<template>
  <div class="calibration-panel">
    <div class="info">
      <div class="title">Calibration</div>
      <div class="description">Calibrate the keyboard to ensure accuracy and stability.</div>
    </div>
    <t-button class="start-btn" @click="startCalibration">Start Calibration</t-button>
    
    <div class="calibration-display">
      <div class="ruler-container">
        <div class="ruler-mark" v-for="(mark, index) in marks" :key="index">
          <span class="mark-label">{{ mark }} mm</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const marks = [0, 1, 2, 3, 4];

const startCalibration = () => {
  // TODO: Implement calibration logic
  console.log('Start calibration');
};
</script>

<style scoped lang="scss">
.calibration-panel {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: max-content 1fr;
  grid-template-rows: auto 1fr;
  column-gap: 40px;
  row-gap: 60px;
  background-color: #fff;
  color: #000;
}

.info {
  grid-column: 1;
  grid-row: 1;

  .title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 8px;
    color: #1a1a1a;
  }
  .description {
    font-size: 14px;
    color: #909399;
  }
}

.start-btn {
  grid-column: 2;
  grid-row: 1;
  justify-self: end;
  align-self: start;
  
  background-color: #000;
  border: 1px solid #000;
  color: #fff;
  border-radius: 2px;
  padding: 0 20px;
  height: 32px;
  line-height: 32px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #333;
    border-color: #333;
  }
}

.calibration-display {
  grid-column: 2;
  grid-row: 2;
  display: flex;
  justify-content: flex-start;
}

.ruler-container {
  display: flex;
  flex-direction: column;
  height: 400px;
  justify-content: space-between;
  width: 100px;
  
  .ruler-mark {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    
    .mark-label {
      font-size: 12px;
      color: #909399;
    }
  }
}
</style>
