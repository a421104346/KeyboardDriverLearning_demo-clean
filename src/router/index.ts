import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', redirect: '/keyperformance' },
  { path: '/lighting', component: () => import('../views/Lighting/index.vue') },
  { path: '/keyperformance', component: () => import('../views/KeyPerformance/index.vue') },
  { path: '/keyassignment', component: () => import('../views/KeyAssignment/index.vue') },
  { path: '/advancedkeys', component: () => import('../views/AdvancedKeys/index.vue') },
  { path: '/macros', component: () => import('../views/Macro/index.vue') },
  { path: '/system', component: () => import('../views/System/index.vue') },
  { path: '/configurations', component: () => import('../views/Configurations/index.vue') },
  { path: '/firmware', component: () => import('../views/Firmware/index.vue') },
  { path: '/keytest', component: () => import('../views/KeyTest/index.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
