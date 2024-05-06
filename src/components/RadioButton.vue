<script setup lang="ts">

    const model = defineModel()
    const props = defineProps({
        value: {
            type: String,
        },
        label: {
            type: String
        }
    })

</script>

<template>
    <div>
        <p>{{ props.label }}</p>
        <input type="radio" v-model="model" :value="props.value" />
    </div>
</template>