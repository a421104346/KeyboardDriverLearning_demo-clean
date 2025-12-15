import { createRouter, createWebHistory } from 'vue-router';
import Lighting from '../views/Lighting/index.vue';
import KeyPerformance from '../views/KeyPerformance/index.vue';

const routes = [
  { path: '/', redirect: '/lighting' },
  { path: '/lighting', component: Lighting },
  { path: '/keyperformance', component: KeyPerformance }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

