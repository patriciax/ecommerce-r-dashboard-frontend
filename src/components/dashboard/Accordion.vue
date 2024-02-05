<script setup lang="ts">
import ChevronIcon from '@/assets/icons/ChevronIcon.vue';
import CircleIcon from '@/assets/icons/CircleIcon.vue';
import { ref } from 'vue';

const showAccordion = ref(false);

const props = defineProps({
  title: String,
  options: [Object]
});

</script>

<template>
    <div class="rounded-md bg-gray-600 flex text-white font-bold p-2 justify-between cursor-pointer" @click="showAccordion = !showAccordion">
      <span class="ml-2">{{ props.title }}</span>
      <ChevronIcon :class="showAccordion ? 'rotate-180' : ''"/>
    </div>
    <Transition>
      <div class="text-white pl-8 mt-2" v-if="showAccordion">
        <ul class="space-y-2">
          <RouterLink v-for="option in options" :to="option.link">
            <li class="flex items-center hover:bg-gray-500 hover:font-bold rounded-md py-2 px-2 cursor-pointer">
            <CircleIcon class="h-4"/> <span class="ml-2 text-sm">{{ option.title }}</span>
          </li>
          </RouterLink>
        </ul>
      </div>
    </Transition>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>