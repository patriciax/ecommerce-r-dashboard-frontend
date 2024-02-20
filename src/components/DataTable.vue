<script setup lang="ts">
import Spinner from '@/assets/icons/Spinner.vue'

const props = defineProps({
  headers: {
    type: Object
  },
  hideActions: {
    type: Boolean,
    default: false
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  noHaveData: {
    type: Boolean,
    default: false
  },
  pagination: {
    type: Object,
    default: () => {}
  },
  havePagination: {
    type: Boolean,
    default: true
  },
  heightTable: {
    type: String,
    default: 'h-550'
  },
  title: {
    type: String,
  }
})
</script>
<template>
  <section class="card">
    <div class="pb-2  flex items-center border-b">
      <div class="w-1 mr-2 rounded-lg h-5 bg-blue-300"></div>
      <p class="font-semibold text-sm text-default-text" v-text="props.title"></p>
    </div>
    <div
      class="overflow-y-overlay light-scroll overflow-x-auto rounded-lg"
      :class="props.heightTable"
    >
      <table class="w-full bg-gray-50 text-left text-sm text-gray-500">
        <thead class="sticky top-0 z-10 bg-slate-100 rounded-lg text-sm text-gray-700 dark:bg-text-light">
          <tr>
            <th
              v-for="(head, index) in props.headers"
              :key="index"
              scope="col"
              class="p-3"
              :class="head.width"
              v-text="head.title"
            />
          </tr>
        </thead>
        <tbody>
          <template v-if="props.isLoading">
            <tr>
              <td
                class="bg-white py-3 text-center text-sm m-auto"
                :colspan="props.headers?.length"
              >
              <Spinner />

            </td>
            </tr>

          </template>

          <template v-else-if="props.noHaveData">
            <tr>
              <td
                class="bg-white py-3 text-center text-sm"
                :colspan="props.headers?.length"
                v-text="'No hay datos disponible'"
              />
            </tr>
          </template>

          <template v-else>
            <slot name="body" />
          </template>
        </tbody>
      </table>
    </div>
    <slot name="pagination"/>

  </section>
</template>
