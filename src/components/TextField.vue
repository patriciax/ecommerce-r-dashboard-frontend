<script setup lang="ts">

    const model = defineModel()
    const props = defineProps({
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
    <div class="py-3">
      <p>{{ props.label }}</p>
      <input
        v-model="model"
        :type="props.type"
        class="border border-gray-200 mt-2 w-full rounded-md px-3 py-2 outline-none focus:border-blue-500"
        :placeholder="props.placeholder"
        @keypress="props.onlyNumber ? isNumber($event) : ''"
      />
      <p class="text-red-300" v-if="props.error">{{ props.error }}</p>
    </div>
</template>