<script setup lang="ts">
import { onMounted } from 'vue';
import Accordion from './Accordion.vue';
import {useAuthStore} from '@/stores/authStore'

const authStore = useAuthStore()

const productsOptions = [
    {title: "Crear producto", link: "/dashboard/product/create"},
    {title: "Ver productos", link: "/dashboard/product/list"},
]

const categoriesOptions = [
    {title: "Crear categoría", link: "/dashboard/category/create"},
    {title: "Ver categorías", link: "/dashboard/category/list"},
]

const sizesOptions = [
    {title: "Crear talla", link: "/dashboard/size/create"},
    {title: "Ver tallas", link: "/dashboard/size/list"},
]

const colorsOptions = [
    {title: "Crear color", link: "/dashboard/color/create"},
    {title: "Ver colores", link: "/dashboard/color/list"},
]

const employeeOptions = [
    {title: "Crear empleado", link: "/dashboard/employee/create"},
    {title: "Ver empleados", link: "/dashboard/employee/list"},
]

</script>

<template>
    <div class="w-60 h-screen bg-gray-800 fixed p-5">
        <Accordion title="Productos" :options="productsOptions" v-if="authStore.user?.role?.permissions.find((item:any) => item == 'PRODUCT-CREATE')"/>
        <Accordion title="Categorías" :options="categoriesOptions" v-if="authStore.user?.role?.permissions.find((item:any) => item == 'CATEGORY-CREATE')"/>
        <Accordion title="Tallas" :options="sizesOptions" v-if="authStore.user?.role?.permissions.find((item:any) => item == 'SIZE-CREATE')"/>
        <Accordion title="Colores" :options="colorsOptions" v-if="authStore.user?.role?.permissions.find((item:any) => item == 'COLOR-CREATE')"/>
        <Accordion title="Empleados" :options="employeeOptions" v-if="authStore.user?.role?.permissions.find((item:any) => item == 'EMPLOYEE-CREATE')"/>
    </div>
</template>