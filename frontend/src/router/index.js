import { createRouter, createWebHistory } from 'vue-router'
import PredictAppView from '@/views/PredictAppView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: PredictAppView
    },
    {
      path: '/about',
      name: 'about',
    }
  ]
})

export default router
