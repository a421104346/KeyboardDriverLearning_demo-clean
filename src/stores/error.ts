import { defineStore } from 'pinia';
import { ref } from 'vue';
import { AppError } from '../types/error';

export const useErrorStore = defineStore('error', () => {
  const errors = ref<AppError[]>([]);

  const addError = (error: AppError) => {
    errors.value.push(error);
    // Auto-remove after 3 seconds
    setTimeout(() => {
      errors.value.shift();
    }, 3000);
  };

  const clearErrors = () => {
    errors.value = [];
  };

  return { errors, addError, clearErrors };
});

