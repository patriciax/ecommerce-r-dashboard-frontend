<script setup lang="ts">
import Accordion from './Accordion.vue';

const productsOptions = [
    {title: "Crear producto", link: "/dashboard/product/create"},
    {title: "Ver productos", link: "/dashboard/products"},
]

</script>

<template>
    <div class="w-60 h-screen bg-gray-800 fixed p-5">
        <Accordion title="Productos" :options="productsOptions"/>
    </div>
</template>