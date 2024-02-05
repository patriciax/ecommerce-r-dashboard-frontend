<script setup lang="ts">

    const model = defineModel()
    const props = defineProps({
        "label": {
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
      <p>{{ props.label }}</p>
      <QuillEditor theme="snow" v-model:content="model" content-type="html"/>
      <p class="text-red-300" v-if="props.error">{{ props.error }}</p>
    </div>
</template>