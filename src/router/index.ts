import { createRouter, createWebHistory } from 'vue-router';
import Lighting from '../views/Lighting/index.vue';
import KeyPerformance from '../views/KeyPerformance/index.vue';
import KeyAssignment from '../views/KeyAssignment/index.vue';
import AdvancedKeys from '../views/AdvancedKeys/index.vue';
import Macro from '../views/Macro/index.vue';
import System from '../views/System/index.vue';
import Configurations from '../views/Configurations/index.vue';
import Firmware from '../views/Firmware/index.vue';

const routes = [
  { path: '/', redirect: '/keyperformance' },
  { path: '/lighting', component: Lighting },
  { path: '/keyperformance', component: KeyPerformance },
  { path: '/keyassignment', component: KeyAssignment },
  { path: '/advancedkeys', component: AdvancedKeys },
  { path: '/macros', component: Macro },
  { path: '/system', component: System },
  { path: '/configurations', component: Configurations },
  { path: '/firmware', component: Firmware }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
