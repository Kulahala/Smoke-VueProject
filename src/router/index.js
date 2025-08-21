import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import CategoryView from '../views/CategoryView.vue';
import ProductDetail from '../views/ProductDetail.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/category/:id',
    name: 'Category',
    component: CategoryView
  },
  {
    path: '/product/:id',
    name: 'Product',
    component: ProductDetail
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/blog',
    name: 'Blog',
    component: () => import('../views/BlogView.vue')
  },
  // Optional: Add a 404 not found route
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue') // Lazy load for non-critical component
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
