import { createRouter, createWebHistory } from 'vue-router';
import Lighting from '../views/Lighting.vue';
import KeyTest from '../views/KeyTest.vue';

const routes = [
  { path: '/', redirect: '/lighting' },
  { path: '/lighting', component: Lighting },
  { path: '/keytest', component: KeyTest }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

