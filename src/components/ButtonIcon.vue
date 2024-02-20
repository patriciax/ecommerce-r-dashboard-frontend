<script setup lang="ts">
import Spinner from '@/assets/icons/Spinner.vue'
import type { ButtonHTMLAttributes, PropType } from 'vue'

const props = defineProps({
  buttonType: {
    type: String as PropType<ButtonHTMLAttributes['type']>,
    default: 'button'
  },
  color: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <button
    :type="props.buttonType"
    :className="`px-2 py-4 rounded-md ${props.color} ${props.size} text-center`"
  >
    <div class="text-center flex justify-center">
      <template v-if="props.loading">
        <Spinner />
      </template>
      <template v-else>
        <slot />
      </template>
    </div>
  </button>
</template>
