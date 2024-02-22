<script setup lang="ts">
import { onMounted, ref, watch, type Ref } from 'vue'
import {

  XMarkIcon
} from '@heroicons/vue/24/outline'

interface Option {
  id: string
  name: string
}

const selectedOption: Ref<String | null> = ref(null)
const selectedRows: Ref<Option[]> = ref([])

const props = defineProps({
  label: String,
  placeholder: String,
  options: Array<Option>,
  defaultValues: Array<string>,
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['changeValue'])

const addOption = () => {
  selectedRows.value.find((row: Option) => row.id === selectedOption.value)
    ? (selectedRows.value = selectedRows.value.filter(
        (row: Option) => row.id !== selectedOption.value
      ))
    : selectedRows.value.push(
        props.options?.find((option: Option) => option.id === selectedOption.value) as Option
      )
  emit('changeValue', selectedRows.value)
}

const removeOption = (option: Option) => {
  selectedRows.value = selectedRows.value.filter((row: Option) => row.id !== option.id)
  emit('changeValue', selectedRows.value)
}

watch(
  () => props.defaultValues,
  (newValue) => {
    selectedRows.value =
      newValue?.map(
        (id: string) => props.options?.find((option: Option) => option.id === id) as Option
      ) ?? []
  }
)
</script>

<template>
  <div class="flex flex-col w-full">
    <label class="text-sm font-medium mb-0.5 text-default-text">{{ props.label }}</label>
    <select
      class="w-full rounded-md p-3 border border-gray-20 bg-transparent"
      @change="addOption"
      v-model="selectedOption"
    >
      <option value="null" selected disabled>{{ props.placeholder }}</option>
      <option :value="option.id" v-for="option in props.options">{{ option.name }}</option>
    </select>
    <p class="text-red-300" v-if="props.error">{{ props.error }}</p>

    <div class="flex flex-wrap gap-2 mt-2">
      <div
        v-for="row in selectedRows"
        class="bg-slate-100 flex p-2 hover:bg-slate-200 rounded-md items-center justify-between cursor-pointer"
        @click="removeOption(row)"
      >
        <span class="font-bold text-sm mr-3">{{ row?.name }}</span>
        <XMarkIcon class="w-4"/>
      </div>
    </div>
  </div>
</template>
