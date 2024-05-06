<script setup lang="ts">
import { showNotification } from '@/composables/useNotification'
import { nextTick, ref } from 'vue'

const showVideo = ref(true)
const showInput = ref(true)
const props = defineProps({
  fieldId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: 'Clic para cargar'
  },
  defaultVideo:{
    type: String,
    default: ''
  }
})

const emits = defineEmits(['changedVideo'])

const fileInput: any = ref(null)

const previewVideo: any = ref(null)

const selectImage = () => {
  fileInput.value?.click()
}

const pickFile = () => {
  let input = fileInput.value
  let file = input?.files

  if (file && file[0]) {
    if (file[0]['size'] / 1000 > 10000) {
      showNotification('Tamaño de video muy grande', 'error')
      previewVideo.value = null
      showInput.value = false
      nextTick(() => {
        showInput.value = true
      })
      return
    }

    if (file[0]['type'].split('/')[0] !== 'video') {
      showNotification('Archivo seleccionado no es un video', 'error')
      previewVideo.value = null
      showInput.value = false
      nextTick(() => {
        showInput.value = true
      })
      return
    }

    let reader = new FileReader()
    reader.onload = (e) => {
      previewVideo.value = e?.target?.result
      showVideo.value = false
      setTimeout(() => showVideo.value = true, 100)
    }
    reader.readAsDataURL(file[0])
  }
  emits('changedVideo', true)
}
</script>

<template>
  <div>
    <label
      class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-100 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-100 hover:bg-gray-100 dark:border-gray-300 dark:hover:border-gray-200 dark:hover:bg-gray-100"
    >
      <div class="flex flex-col items-center justify-center pt-5 pb-6" v-if="!previewVideo">
        <svg
          class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 16"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
          />
        </svg>
        <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
          <span class="font-semibold">{{ $props.title }}</span>
        </p>
        <p class="text-xs text-center text-gray-500 dark:text-gray-400">
          MP4, MOV or WEBM
        </p>
      </div>
      <div
        v-if="previewVideo"
        class="imagePreviewWrapper rounded-lg "
      >
        <video muted autoplay loop playsinline v-if="showVideo">
            <source :src="previewVideo" type="video/mp4">
            <source :src="previewVideo" type="video/mov">
            <source :src="previewVideo" type="video/webm">
            
            Your browser does not support HTML video.
        </video>
      </div>

      <div
        v-if="props.defaultVideo && !previewVideo"
        class="imagePreviewWrapper rounded-lg "
      >
        <video muted autoplay loop playsinline v-if="props.defaultVideo">
            <source :src="props.defaultVideo" type="video/mp4">
            <source :src="props.defaultVideo" type="video/mov">
            <source :src="props.defaultVideo" type="video/webm">
            
            Your browser does not support HTML video.
        </video>
      </div>

      <input
        accept="video/*"
        id="dropzone-file"
        class="hidden"
        :class="props.fieldId"
        ref="fileInput"
        type="file"
        v-if="showInput"
        @input="pickFile"
      />
    </label>

    <!-- <input
      v-if="showInput"
      accept="image/*"
      class="w-44"
      :class="props.fieldId"
      ref="fileInput"
      type="file"
      @input="pickFile"
    />

    <div
      v-if="previewImage && showInput"
      class="imagePreviewWrapper"
      :style="{ 'background-image': `url(${previewImage})` }"
      @click="selectImage"
    ></div>---->
  </div>
</template>

<style scoped>
.imagePreviewWrapper {
  width: 11rem;
  height: 11rem;
  display: block;
  cursor: pointer;
  margin: 0 auto 30px;
  background-size: cover;
  background-position: center center;
}

input[type='file'] {
  color: transparent;
}
</style>
