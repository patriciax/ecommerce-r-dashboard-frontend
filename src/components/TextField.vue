<script setup lang="ts">

    const model = defineModel()
    const props = defineProps({
        "disabled":{
          type: Boolean,
          default: false
        },
        "label": {
            type: String,
            required: true
        },
        "type": {
            type: String,
            required: true
        },
        "placeholder": {
            type: String
        },
        "error": {
          type: String,
          default: ''
        },
        "onlyNumber":{
          type: Boolean,
          default: false
        }
    })
  
  const isNumber = (evt: KeyboardEvent): void => {
    const keysAllowed: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
    const keyPressed: string = evt.key;
    
    if (!keysAllowed.includes(keyPressed)) {
    evt.preventDefault()
    }
  } 

</script>

<template>
    <div class="py-2">
      <p class="text-sm font-medium mb-0.5 text-default-text">{{ props.label }}</p>
      <input
        :disabled="props.disabled"
        v-model="model"
        :type="props.type"
        class="border border-gray-200  w-full rounded-md px-3 py-1.5 outline-none focus:border-blue-500 placeholder:text-xs"
        :placeholder="props.placeholder"
        @keypress="props.onlyNumber ? isNumber($event) : ''"
      />
      <p class="text-red-300" v-if="props.error">{{ props.error }}</p>
    </div>
</template>