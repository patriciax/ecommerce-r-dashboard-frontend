import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import { useAuthStore } from '@/stores/authStore'
import CreateProductVue from '@/views/dashboard/products/CreateProduct.vue'
import CreateCategoryVue from '@/views/dashboard/categories/CreateCategory.vue'
import ListCategoryVue from '@/views/dashboard/categories/ListCategory.vue'
import EditCategoryVue from '@/views/dashboard/categories/EditCategory.vue'
import CreateSizeVue from '@/views/dashboard/sizes/CreateSize.vue'
import ListSizeVue from '@/views/dashboard/sizes/ListSize.vue'
import EditSizeVue from '@/views/dashboard/sizes/EditSize.vue'
import CreateColorVue from '@/views/dashboard/colors/CreateColor.vue'
import ListColorVue from '@/views/dashboard/colors/ListColor.vue'
import EditColorVue from '@/views/dashboard/colors/EditColor.vue'
import CreateEmployeeVue from '@/views/dashboard/employees/CreateEmployee.vue'
import ListEmployeeVue from '@/views/dashboard/employees/ListEmployee.vue'
import EditEmployeeVue from '@/views/dashboard/employees/EditEmployee.vue'
import ListProductVue from '@/views/dashboard/products/ListProduct.vue'

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
    },
    {
      path: '/dashboard/product/list',
      name: 'list-product',
      component: ListProductVue,
      meta: { requiresAuth: true },
    },




    {
      path: '/dashboard/category/create',
      name: 'create-category',
      component: CreateCategoryVue,
      meta: { requiresAuth: true },
    },
    {
      path: '/dashboard/category/list',
      name: 'list-category',
      component: ListCategoryVue,
      meta: { requiresAuth: true },
    },
    {
      path: '/dashboard/category/:id',
      name: 'edit-category',
      component: EditCategoryVue,
      meta: { requiresAuth: true },
    },



    {
      path: '/dashboard/size/create',
      name: 'create-size',
      component: CreateSizeVue,
      meta: { requiresAuth: true },
    },
    {
      path: '/dashboard/size/list',
      name: 'list-size',
      component: ListSizeVue,
      meta: { requiresAuth: true },
    },
    {
      path: '/dashboard/size/:id',
      name: 'edit-size',
      component: EditSizeVue,
      meta: { requiresAuth: true },
    },




    {
      path: '/dashboard/color/create',
      name: 'create-color',
      component: CreateColorVue,
      meta: { requiresAuth: true },
    },
    {
      path: '/dashboard/color/list',
      name: 'list-color',
      component: ListColorVue,
      meta: { requiresAuth: true },
    },
    {
      path: '/dashboard/color/:id',
      name: 'edit-color',
      component: EditColorVue,
      meta: { requiresAuth: true },
    },



    {
      path: '/dashboard/employee/create',
      name: 'create-employee',
      component: CreateEmployeeVue,
      meta: { requiresAuth: true },
    },
    {
      path: '/dashboard/employee/list',
      name: 'list-employee',
      component: ListEmployeeVue,
      meta: { requiresAuth: true },
    },
    {
      path: '/dashboard/employee/:id',
      name: 'edit-employee',
      component: EditEmployeeVue,
      meta: { requiresAuth: true },
    }
  ]
})

router.beforeEach( async(to, from) => {

  const authStore = useAuthStore()

  if(!authStore.user && localStorage.getItem(import.meta.env.VITE_BEARER_TOKEN_KEY)){
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
