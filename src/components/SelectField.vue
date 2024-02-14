<script setup lang="ts">
    const props = defineProps({
        label: String,
        placeholder: String,
        options: Array<{ id: number, name: string }>,
    });

    const model = defineModel()
</script>

<template>
    <div class="flex flex-col w-full">
        <label>{{ props.label }}</label>
        <select class="w-full rounded-md p-3 border border-gray-20 bg-transparent" v-model="model">
            <option value="" selected disabled>{{ props.placeholder }}</option>
            <option :value="option.id" v-for="option in props.options">{{ option.name }}</option>
        </select>
    </div>
</template>