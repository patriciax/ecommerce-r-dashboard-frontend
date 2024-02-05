<script setup lang="ts">
    import Navbar from '@/components/dashboard/Navbar.vue';
import Sidebar from '@/components/dashboard/Sidebar.vue';
</script>

<template>
    <div>
        <Sidebar />
        <Navbar class="pl-60"/>
        <div class="pt-14 pl-64 bg-gray-300 pr-4 h-screen">
            <slot></slot>
        </div>
    </div>
</template>