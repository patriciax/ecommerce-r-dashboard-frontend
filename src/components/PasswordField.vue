<script setup lang="ts">
    import { defineModel, ref } from 'vue';
    import EyeIcon from '@/assets/icons/EyeIcon.vue'
    import EyeSlashIcon from '@/assets/icons/EyeSlashIcon.vue'

    const hidePassword = ref(true)
    const model = defineModel()

    const props = defineProps({
        "label": {
            type: String,
            required: true
        },
        "name": {
            type: String,
            required: true
        },
        "placeholder": {
            type: String,
            required: true
        },
        "error": {
          type: String,
          default: ''
        }
    })
</script>

<template>
    <div class="py-3">
      <p class="text-sm font-medium mb-0.5 text-default-text">{{props.label}}</p>
      <div class="flex border border-gray-200 mt-2 w-full rounded-md px-3 py-2 justify-between">
        <input
          class="outline-none w-11/12"
          :type="hidePassword ? 'password' : 'text'"
          :placeholder="props.placeholder"
          v-model="model"
        />
        <button
          type="button"
          class="w-1/12 justify-end flex"
          @click="hidePassword = !hidePassword"
        >
          <template v-if="hidePassword">
            <EyeIcon />
          </template>
          <template v-else>
            <EyeSlashIcon />
          </template>
          
        </button>
      </div>
      <p class="text-red-300" v-if="props.error">{{ props.error }}</p>
    </div>
</template>