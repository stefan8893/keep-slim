import '@/auth/useAuth';
import { useAuth } from '@/auth/useAuth';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/LandingView.vue'),
      beforeEnter: () => {
        const { isAuthenticated } = useAuth();
        if (isAuthenticated()) return { path: '/home', replace: true };
      },
    },
    {
      path: '/',
      component: () => import('@/layouts/TheAppLayout.vue'),
      beforeEnter: () => {
        const { isAuthenticated } = useAuth();
        if (!isAuthenticated()) return { path: '/', replace: true };
      },
      children: [
        {
          path: 'home',
          component: () => import('@/views/HomeView.vue'),
        },
        {
          path: 'body-data',
          component: () => import('@/views/BodyDataTableView.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
});

export default router;
