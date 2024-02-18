<script setup lang="ts">
import UserLogged from './UserLogged.vue'
import { Bars3BottomLeftIcon } from '@heroicons/vue/24/outline'
</script>

<template>
  <div class="bg-white flex justify-between sticky top-0 z-0 items-center h-14 px-10">
    <button @click="$emit('isOpen')" class="">
      <Bars3BottomLeftIcon class="w-6 ml-3 text-default-text" />
    </button>
    <UserLogged name="Willian Rodriguez" role="Administrador" class="cursor-pointer" />
  </div>
</template>
