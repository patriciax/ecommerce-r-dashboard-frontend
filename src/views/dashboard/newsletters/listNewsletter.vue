<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import Spinner from '@/assets/icons/Spinner.vue'
import { useRouter } from 'vue-router'
import { listNewsletters } from '@/api/repositories/newsletter.repository'
import Pagination from '@/components/Pagination.vue'
import DataTable from '@/components/DataTable.vue'

const router = useRouter()
const newsletters: any = ref([])
const limit = ref(10)
const actualPage = ref(1)
const loadingNewsletters = ref(false)
const totalPages = ref(1)

const getNewsletters = async (page = 1) => {
  actualPage.value = page
  loadingNewsletters.value = true
  const response = await listNewsletters(limit.value, actualPage.value)
  newsletters.value = response.data?.newsletters
  loadingNewsletters.value = false
  totalPages.value = response.totalPages
}

const titlesTable = computed(() => [
  {
    width: 'w-4/12',
    title: 'Nombre'
  },

  {
    width: 'w-1/6',
    title: ''
  },
  {
    width: 'w-1/2',
    title: ''
  },
  {
    width: 'w-4/12',
    title: ''
  }
])
onMounted(async () => {
  getNewsletters()
})
</script>

<template>
  <section>
    <div>
      <h1 class="title">Lista dE Newsletter</h1>
    </div>
    <DataTable
      :is-loading="loadingNewsletters"
      title="Newsletter"
      :noHaveData="newsletters.length === 0"
      :headers="titlesTable"
    >
      <template #body>
        <tr
          v-for="newsletter in newsletters"
          :key="newsletter?._id"
          class="border-b p-10 hover:bg-gray-50 text-default-text"
        >
          <td class="flex cursor-pointer items-center gap-2 p-3 capitalize">
            {{ newsletter.title }}
          </td>
          <td class="p-3"></td>
          <td class="p-3"></td>
          <td class="p-3 flex gap-2"></td>
        </tr>
      </template>
      <template #pagination>
        <section class="mt-4">
          <Pagination
            @changePageEmit="(page: number) => getNewsletters(page)"
            :totalPages="totalPages"
            :actualPage="actualPage"
          />
        </section>
      </template>
    </DataTable>
  </section>
</template>
