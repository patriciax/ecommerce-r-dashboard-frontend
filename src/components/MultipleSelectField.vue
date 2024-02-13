<script setup lang="ts">
import { ref, type Ref } from 'vue';

    interface Option {
        id: string
        name: string
    }

    const selectedOption : Ref<String | null> = ref(null);
    const selectedRows: Ref<Option[]> = ref([]);

    const props = defineProps({
        label: String,
        placeholder: String,
        options: Array<Option>,
    });

    const emit = defineEmits(['changeValue'])

    const addOption = () => {

        selectedRows.value.find((row:Option) => row.id === selectedOption.value) ? 
        selectedRows.value = selectedRows.value.filter((row:Option) => row.id !== selectedOption.value) : 
        selectedRows.value.push(props.options?.find((option:Option) => option.id === selectedOption.value) as Option)
        emit('changeValue', selectedRows.value)
    }

    const removeOption = (option:Option) => {
        selectedRows.value = selectedRows.value.filter((row:Option) => row.id !== option.id)
        emit('changeValue', selectedRows.value)
    }

</script>

<template>
    <div class="flex flex-col w-full">
        <label>{{ props.label }}</label>
        <select class="w-full rounded-md p-3" @change="addOption" v-model="selectedOption">
            <option value="null" selected disabled>{{ props.placeholder }}</option>
            <option :value="option.id" v-for="option in props.options">{{ option.name }}</option>
        </select>

        <div class="flex flex-wrap gap-2 mt-2">
            <div v-for="row in selectedRows" class="bg-gray-200 flex p-2 rounded-md items-center justify-between cursor-pointer" @click="removeOption(row)">
                <span class="font-bold text-lg mr-3">{{ row.name }}</span>
                <span>x</span>
            </div>
        </div>
    </div>
</template>