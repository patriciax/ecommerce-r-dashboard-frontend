<script setup lang="ts">
    import { showNotification } from '@/composables/useNotification';
    import { nextTick, ref } from 'vue';

    const showInput = ref(true)
    const props = defineProps({
        fieldId: {
            type: String,
            required: true
        }
    })

    const emits = defineEmits(['changedImage'])

    const fileInput:any = ref(null)

    const previewImage:any = ref(null)

    const selectImage = () => {
        fileInput.value?.click()
    }
    
    const pickFile = () => {
        let input = fileInput.value
        let file = input?.files

        if (file && file[0]) {

            if(file[0]['size'] / 1000 > 10000){
                showNotification("Tamaño de imágen muy grande", "error")
                previewImage.value = null
                showInput.value = false
                nextTick(() => {
                    showInput.value = true
                })
                return
            }

            if(file[0]['type'].split('/')[0] !== 'image'){
                showNotification("Archivo seleccionado no es una imágen", "error")
                previewImage.value = null
                showInput.value = false
                nextTick(() => {
                    showInput.value = true
                })
                return
            }

            let reader = new FileReader
            reader.onload = e => {
                previewImage.value = e?.target?.result
            }
            reader.readAsDataURL(file[0])
        }
        emits('changedImage', true)
    }

</script>

<template>
    <div>
  
      <input
        v-if="showInput"
        accept="image/*"
        class="w-44"
        :class="props.fieldId"
        ref="fileInput"
        type="file"
        @input="pickFile">

        <div
        v-if="previewImage && showInput"
        class="imagePreviewWrapper"
        :style="{ 'background-image': `url(${previewImage})` }"
        @click="selectImage">
      </div>
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