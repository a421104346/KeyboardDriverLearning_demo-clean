<template>
  <div class="mpt-panel">
    <div class="panel-header">
      <h3>Multi-Point Trigger (MPT)</h3>
      <p class="description">
        Configure multiple trigger points at different travel distances for a single key.
      </p>
    </div>

    <div class="placeholder-content">
      <p>⚙️ Coming Soon</p>
      <p class="hint">This feature enables advanced users to set multiple actuation points along the key travel path.</p>
    </div>
  </div>
</template>

<style scoped>
.mpt-panel {
  width: 100%;
  padding: 20px;
}

.panel-header {
  margin-bottom: 30px;
}

.panel-header h3 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1.5rem;
}

.description {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
}

.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  color: #999;
}

.placeholder-content p {
  margin: 10px 0;
  font-size: 1.1rem;
}

.placeholder-content .hint {
  font-size: 0.9rem;
  max-width: 500px;
}
</style>

