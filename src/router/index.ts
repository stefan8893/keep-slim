import '@/auth/useAuth';
import { useAuth } from '@/auth/useAuth';
import BodyDataView from '@/views/BodyDataView.vue';
import HomeView from '@/views/HomeView.vue';
import ProfileVue from '@/views/ProfileVue.vue';
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
          component: HomeView,
        },
        {
          path: 'body-data',
          component: BodyDataView,
        },
        {
          path: 'profile',
          component: ProfileVue,
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
