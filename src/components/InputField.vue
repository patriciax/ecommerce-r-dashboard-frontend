<script setup lang="ts">
    import { ref } from 'vue';

    const props = defineProps({
        fieldId: {
            type: String,
            required: true
        }
    })

    const fileInput:any = ref(null)

    const previewImage:any = ref(null)

    const selectImage = () => {
        fileInput.value?.click()
    }
    
    const pickFile = () => {
        let input = fileInput.value
        let file = input?.files
        if (file && file[0]) {
            let reader = new FileReader
            reader.onload = e => {
                previewImage.value = e?.target?.result
            }
            reader.readAsDataURL(file[0])
        }
    }

</script>

<template>
    <div>
  
      <input
        :class="props.fieldId"
        ref="fileInput"
        type="file"
        @input="pickFile">

        <div
        v-if="previewImage"
        class="imagePreviewWrapper"
        :style="{ 'background-image': `url(${previewImage})` }"
        @click="selectImage">
      </div>
    </div>
</template>
  
  <style scoped>
  .imagePreviewWrapper {
      width: 250px;
      height: 250px;
      display: block;
      cursor: pointer;
      margin: 0 auto 30px;
      background-size: cover;
      background-position: center center;
  }
  </style>