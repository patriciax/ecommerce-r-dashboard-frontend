<script setup lang="ts">
import Navbar from '@/components/dashboard/Navbar.vue'
import Sidebar from '@/components/dashboard/Sidebar.vue'
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<template>
  <div>
    <Sidebar :isOpen="isOpen"  @close="isOpen = false" />
    <Navbar class="lg:pl-60" @isOpen="isOpen = !isOpen" />
    <div class="py-6 p-10 lg:pl-64 bg-background-layout pr-4 h-screen">
      <RouterView />
    </div>
  </div>
</template>
