<script setup lang="ts">
import Navbar from '@/components/dashboard/Navbar.vue'
import Sidebar from '@/components/dashboard/Sidebar.vue'
</script>

<template>
  <div>
    <Sidebar />
    <Navbar class="pl-60" />
    <div class="py-6 pl-64 bg-background-layout pr-4 h-screen">
      <RouterView />
    </div>
  </div>
</template>
