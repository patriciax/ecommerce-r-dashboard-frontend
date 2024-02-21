<script setup lang="ts">
    const props = defineProps({
        label: String,
        placeholder: String,
        options: Array<{ id: number | string, name: string }>,
        "error": {
          type: String,
          default: ''
        },
    });

    const model = defineModel()
</script>

<template>
    <div class="flex flex-col w-full">
        <label class="text-sm font-medium mb-0.5 text-default-text">{{ props.label }}</label>
        <select class="w-full rounded-md p-3 border border-gray-20 bg-transparent" v-model="model">
            <option value="" selected disabled>{{ props.placeholder }}</option>
            <option :value="option.id" v-for="option in props.options">{{ option.name }}</option>
        </select>
        <p class="text-red-300">{{ props.error }}</p>
    </div>
</template>