<template>
  <Transition name="modal-fade">
    <div v-if="show" class="modal-overlay" @click="handleOverlayClick">
      <Transition name="modal-slide">
        <div v-if="show" class="modal-container" @click.stop>
          <!-- Header -->
          <div class="modal-header">
            <div class="modal-header-left">
              <h2 class="modal-title">{{ title }}</h2>
              <div class="modal-bind-keys">
                <span class="bind-key-label">按键绑定：</span>
                <div class="bind-key-box"></div>
                <div class="bind-key-box"></div>
                <span class="bind-key-hint">(请点击上方键盘选择要绑定的按键)</span>
              </div>
            </div>
            <button class="btn-close" @click="$emit('close')">×</button>
          </div>

          <!-- Body -->
          <div class="modal-body">
            <slot></slot>
          </div>

          <!-- Footer -->
          <div class="modal-footer">
            <button class="btn-cancel" @click="$emit('close')">取消</button>
            <button class="btn-confirm" @click="$emit('confirm')">确认</button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean;
  title: string;
}>();

const emit = defineEmits(['close', 'confirm']);

const handleOverlayClick = () => {
  emit('close');
};
</script>

<style scoped>
.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-container {
  background: #fff;
  border-radius: 16px;
  width: calc(100% - 40px);
  height: calc(100% - 40px);
  margin: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #eee;
  flex-shrink: 0;
}

.modal-header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.modal-title {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
}

.modal-bind-keys {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bind-key-label {
  font-size: 1rem;
  color: #333;
  font-weight: 500;
}

.bind-key-box {
  width: 56px;
  height: 56px;
  border: 2px solid #ddd;
  border-radius: 8px;
  background: #fff;
}

.bind-key-hint {
  font-size: 0.9rem;
  color: #999;
}

.btn-close {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  border-radius: 50%;
  cursor: pointer;
  font-size: 2rem;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  line-height: 1;
}

.btn-close:hover {
  background: #f5f5f5;
  color: #333;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  min-height: 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #eee;
  flex-shrink: 0;
}

.btn-cancel,
.btn-confirm {
  padding: 10px 30px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: #f5f5f5;
  color: #666;
}

.btn-cancel:hover {
  background: #e0e0e0;
  color: #333;
}

.btn-confirm {
  background: #222;
  color: #fff;
}

.btn-confirm:hover {
  background: #000;
}

/* Fade Animation */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Slide Animation */
.modal-slide-enter-active {
  transition: all 0.3s ease-out;
}

.modal-slide-leave-active {
  transition: all 0.25s ease;
}

.modal-slide-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.modal-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
