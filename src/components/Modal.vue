<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  XCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const emit = defineEmits(['firtsButtonAction', 'secondButtonAction', 'close'])
const props = defineProps({
  modalType: {
    type: String,
    default: 'primary'
  },
  isLoading: {
    default: false
  },
  persistent: {
    type: Boolean,
    default: false
  },
  withOutClose: {
    type: Boolean,
    default: false
  },
  title: {
    type: String
  },
  titleStyle: {
    type: String
  },
  isIcon: {
    type: Boolean,
    default: false
  },
  withButton: {
    type: Boolean
  },
  isDisabled: {
    default: false
  },
  firstButtonText: {
    required: false,
    type: String
  },
  secondaryButtonText: {
    required: false,
    type: String
  },
  withSecondButton: {
    type: Boolean
  },
  firstButtonColor: {
    type: String,
    default: ''
  },
  size: {
    default: 'max-w-lg',
    type: String
  },
  withoutOverflowAuto: {
    type: Boolean
  }
})

const clickOutside = () => {
  if (!props.persistent && !props.isLoading) handleClose()
}

const iconAlert = computed(() => {
  const icon = {
    error: XCircleIcon,
    success: CheckCircleIcon,
    warning: ExclamationTriangleIcon
  }

  return icon[props.modalType]
})

const target = ref(null)

const handleClose = () => emit('close')
const firtsButtonAction = () => emit('firtsButtonAction')
const secondButtonAction = () => emit('secondButtonAction')

const sizeModal = {
  medium: ''
}

const classModal = computed(() => {
  const _styles = [sizeModal[props.size]]
  _styles.push(props.isFull ? 'w-full' : props.size)
  return _styles.join(' ')
})
</script>
<template>
  <div
    class="fixed left-0 right-0 top-0 z-40 grid h-screen max-h-full w-full overflow-y-auto overflow-x-hidden p-4 text-center md:inset-0"
  >
    <div ref="target" class="absolute inset-0 bg-black bg-opacity-30" @click="clickOutside" />

    <div class="relative flex justify-center">
      <!-- Modal content -->
      <div
        class="light-scroll relative m-auto max-h-90 rounded-lg bg-white p-6 shadow md:p-10 lg:h-auto dark:bg-background-dark"
        :class="[classModal, { 'overflow-auto': !withoutOverflowAuto }]"
      >
        <div>
          <div class="absolute right-2 top-2">
            <button
              v-if="!props.withOutClose"
              :isDisabled="props.isLoading"
              type="button"
              class="rounded-lg bg-transparent p-1.5 text-sm text-text-light hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
              @click="handleClose"
            >
              <XMarkIcon class="w-6" />
            </button>
          </div>
          <component :is="iconAlert" v-if="props.isIcon" class="mx-auto mb-4 w-11" />
          <p
            v-show="props.title"
            class="mb-2 text-xl font-semibold text-text-light dark:text-text-dark"
            :class="titleStyle"
            v-text="props.title"
          />
        </div>

        <section>
          <slot />
        </section>
        <section v-if="props.withButton" class="mt-30 flex justify-center gap-4 text-center">
          <button
            :disabled="props.isDisabled"
            isFull
            @click="firtsButtonAction"
            v-text="props.firstButtonText"
            class="bg-red-600 text-white px-4 hover:bg-red-500 py-2 rounded-lg"
          />
          <button
            v-if="props.secondaryButtonText"
            isFull
            class="bg-gray-100 text-blue-dark px-6 hover:bg-gray-200 py-2 rounded-lg"

            @click="secondButtonAction"
            v-text="props.secondaryButtonText"
          />
        </section>
      </div>
    </div>
  </div>
</template>
