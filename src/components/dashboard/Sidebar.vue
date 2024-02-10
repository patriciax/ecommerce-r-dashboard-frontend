<script setup lang="ts">
import Accordion from './Accordion.vue';

const productsOptions = [
    {title: "Crear producto", link: "/dashboard/product/create"},
    {title: "Ver productos", link: "/dashboard/products"},
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

</script>

<template>
    <div class="w-60 h-screen bg-gray-800 fixed p-5">
        <Accordion title="Productos" :options="productsOptions"/>
        <Accordion title="Categorías" :options="categoriesOptions"/>
        <Accordion title="Tallas" :options="sizesOptions"/>
        <Accordion title="Colores" :options="colorsOptions"/>
    </div>
</template>