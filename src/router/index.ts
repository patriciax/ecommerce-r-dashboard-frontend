import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import { useAuthStore } from '@/stores/authStore'
import CreateProductVue from '@/views/dashboard/products/CreateProduct.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: '/dashboard/product/create',
      name: 'create-product',
      component: CreateProductVue,
      meta: { requiresAuth: true },
    }
  ]
})

router.beforeEach( async(to, from) => {

  const authStore = useAuthStore()
  if(!authStore.user){
    await authStore.getUserInfo()
  }
  
  if (to.meta.requiresAuth && !authStore.user) {
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    }
  }

  else if(authStore.user && to.name === 'login'){
    return {
      name: 'dashboard'
    }
  }
})

export default router
