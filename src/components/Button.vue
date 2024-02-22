<script setup lang="ts">
import Spinner from '@/assets/icons/Spinner.vue'
import type { ButtonHTMLAttributes, PropType } from 'vue'
import { computed } from 'vue'

const emit = defineEmits(['click'])
const props = defineProps({
  buttonType: {
    type: String as PropType<ButtonHTMLAttributes['type']>,
    default: 'button'
  },
  title: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'primary'
  },
  size: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  },
  isDisabled: {
    default: false,
    type: Boolean
  }
})

const colorBtn: any = {
  disabled: 'bg-gray-300 text-gray-500 cursor-not-allowed',
  primary: 'hover:bg-purple-500 hover:text-white transition-all text-center  bg-purple-100 font-medium px-6 py-2.5 rounded-md text-purple-500'
}

const classBtn = computed(() => {
  const _styles = []
  _styles.push(props.isDisabled ? colorBtn.disabled : colorBtn[props.color])
  return _styles.join(' ')
})
</script>

<template>
  <button
    :class="classBtn"
    :disabled="props.isDisabled || props.loading"
    :type="props.buttonType"
    @click="emit('click')"
  >
    <div class="text-center  flex justify-center">
      <template v-if="props.loading">
        <Spinner />
      </template>
      <template v-else>
        {{ props.title }}
      </template>
    </div>
  </button>
</template>
