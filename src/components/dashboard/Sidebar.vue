<script setup lang="ts">
import Accordion from './Accordion.vue'
import { useAuthStore } from '@/stores/authStore'
import {
  ArchiveBoxIcon,
  RectangleGroupIcon,
  Squares2X2Icon,
  SwatchIcon,
  UserGroupIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: Boolean
})

const authStore = useAuthStore()

const productsOptions = [
  { title: 'Crear producto', link: '/dashboard/product/create' },
  { title: 'Ver productos', link: '/dashboard/product/list' }
]

const categoriesOptions = [
  { title: 'Crear categoría', link: '/dashboard/category/create' },
  { title: 'Ver categorías', link: '/dashboard/category/list' }
]

const sizesOptions = [
  { title: 'Crear talla', link: '/dashboard/size/create' },
  { title: 'Ver tallas', link: '/dashboard/size/list' }
]

const colorsOptions = [
  { title: 'Crear color', link: '/dashboard/color/create' },
  { title: 'Ver colores', link: '/dashboard/color/list' }
]

const employeeOptions = [
  { title: 'Crear empleado', link: '/dashboard/employee/create' },
  { title: 'Ver empleados', link: '/dashboard/employee/list' }
]

const giftCardOptions = [
  { title: 'Crear gift card', link: '/dashboard/gift-card/create' },
  { title: 'Ver gift cards', link: '/dashboard/gift-card/list' }
]

const clientsOptions = [
  { title: 'Ver clientes', link: '/dashboard/clients/list' }
]

const newsletterOptions = [
  { title: 'Crear newsletter', link: '/dashboard/newsletters/create' },
  { title: 'Ver newsletter', link: '/dashboard/newsletters/list' }
]
</script>

<template>
  <div
    class="w-60 h-screen z-20 bg-blue-dark fixed p-5 c-sidebar"
    :class="isOpen ? 'block' : 'hidden lg:block'"
  >
    <button class="flex justify-end w-full lg:hidden" @click="$emit('close')">
      <XMarkIcon class="w-5 text-white" />
    </button>
    <section class="text-center mb-4 border-b border-slate-700 pb-4">
      <router-link to="/">
        <p v-text="'Dashboard'" class="text-white uppercase text-sm font-bold" />
      </router-link>
    </section>
    <p
      v-text="'Principal'"
      class="text-[10px] text-secondary uppercase tracking-wide font-light mb-4"
    />
    <Accordion
      :icon="ArchiveBoxIcon"
      title="Productos"
      :options="productsOptions"
      v-if="authStore.user?.role?.permissions.find((item: any) => item == 'PRODUCT-CREATE')"
    />
    <Accordion
      :icon="Squares2X2Icon"
      title="Categorías"
      :options="categoriesOptions"
      v-if="authStore.user?.role?.permissions.find((item: any) => item == 'CATEGORY-CREATE')"
    />
    <Accordion
      :icon="RectangleGroupIcon"
      title="Tallas"
      :options="sizesOptions"
      v-if="authStore.user?.role?.permissions.find((item: any) => item == 'SIZE-CREATE')"
    />
    <Accordion
      :icon="SwatchIcon"
      title="Colores"
      :options="colorsOptions"
      v-if="authStore.user?.role?.permissions.find((item: any) => item == 'COLOR-CREATE')"
    />

    <p
      v-if="authStore.user?.role?.name == 'ADMIN'"
      v-text="'GENERAL'"
      class="text-[10px] text-secondary uppercase tracking-wide font-light my-4"
    />

    <Accordion
      :icon="UserGroupIcon"
      title="Empleados"
      :options="employeeOptions"
      v-if="authStore.user?.role?.permissions.find((item: any) => item == 'EMPLOYEE-CREATE')"
    />

    <Accordion
    :icon="SwatchIcon"
      title="Gift cards"
      :options="giftCardOptions"
      v-if="authStore.user?.role?.permissions.find((item: any) => item == 'GIFT-CARD-CREATE')"
    />

    <Accordion
    :icon="SwatchIcon"
      title="Clientes"
      :options="clientsOptions"
      v-if="authStore.user?.role?.permissions.find((item: any) => item == 'CLIENT-LIST')"
    />

    <Accordion
    :icon="SwatchIcon"
      title="Newsletters"
      :options="newsletterOptions"
      v-if="authStore.user?.role?.permissions.find((item: any) => item == 'NEWSLETTER-LIST')"
    />
  </div>
</template>
