<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  data: [Object],
  titleCard: String,

})
</script>

<template>
  <div class="card">
    <div class="pb-2 flex items-center border-b">
      <div class="w-1 mr-2 rounded-lg h-5 bg-blue-300"></div>
      <p class="font-semibold text-sm text-default-text" v-text="props.titleCard"></p>
    </div>

    <div>
      <ul class="space-y-2 mt-3">
        <li  v-for="(item , index) in props.data" :key="index">
          <div class="flex items-center justify-between font-semibold text-sm">
            <div class="flex items-center">
              <img class="w-8 h-8 rounded-full mr-3" :src="item.img" />
              <span class="" v-text="item.title"></span>
            </div>
            <p  v-text="`$${item.price}`"></p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
