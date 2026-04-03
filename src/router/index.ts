import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import CreateCard from '@/views/CreateCard.vue'
import PreviewCard from '@/views/PreviewCard.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/create',
      name: 'create',
      component: CreateCard,
    },
    {
      path: '/edit/:id',
      name: 'edit',
      component: CreateCard,
    },
    {
      path: '/preview/:id',
      name: 'preview',
      component: PreviewCard,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/About.vue'),
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('@/views/Privacy.vue'),
    },
    {
      path: '/help',
      name: 'help',
      component: () => import('@/views/Help.vue'),
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
