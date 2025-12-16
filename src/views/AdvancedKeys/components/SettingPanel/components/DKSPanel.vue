<template>
  <div class="dks-panel">
    <div class="panel-header">
      <h3>Dynamic Key Stroke (DKS)</h3>
      <p class="description">
        Configure dynamic key stroke behavior based on press speed or travel distance.
      </p>
    </div>

    <div class="placeholder-content">
      <p>⚙️ Coming Soon</p>
      <p class="hint">This advanced feature will allow you to configure different outputs based on how fast or deep you press a key.</p>
    </div>
  </div>
</template>

<style scoped>
.dks-panel {
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

