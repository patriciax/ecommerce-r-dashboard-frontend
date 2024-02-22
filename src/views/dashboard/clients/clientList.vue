<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import Spinner from '@/assets/icons/Spinner.vue'
import { useRouter } from 'vue-router'
import { clientList } from '@/api/repositories/client.repository'
import Pagination from '@/components/Pagination.vue'
import DataTable from '@/components/DataTable.vue'

const router = useRouter()
const clients: any = ref([])
const limit = ref(10)
const actualPage = ref(1)
const loadingClients = ref(false)
const totalPages = ref(1)

const getClients = async (page = 1) => {
  actualPage.value = page
  loadingClients.value = true
  const response = await clientList(limit.value, actualPage.value)
  clients.value = response.data?.clients
  loadingClients.value = false
  totalPages.value = response.totalPages
}

const titlesTable = computed(() => [
  {
    width: 'w-4/12',
    title: 'Nombre'
  },

  {
    width: 'w-1/6',
    title: 'Email'
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
  getClients()
})
</script>

<template>
  <section>
    <div>
      <h1 class="title">Lista de clientes</h1>
    </div>
    <DataTable
      :is-loading="loadingClients"
      title="Clientes"
      :noHaveData="clients.length === 0"
      :headers="titlesTable"
    >
      <template #body>
        <tr
          v-for="client in clients"
          :key="client?._id"
          class="border-b p-10 hover:bg-gray-50 text-default-text"
        >
          <td class="flex cursor-pointer items-center gap-2 p-3 capitalize">
            {{ client.name }}
          </td>
          <td class="p-3">
            {{ client.email }}
          </td>
          <td class="p-3"></td>
          <td class="p-3 flex gap-2"></td>
        </tr>
      </template>
      <template #pagination>
        <section class="mt-4">
          <Pagination
            @changePageEmit="(page: number) => getClientss(page)"
            :totalPages="totalPages"
            :actualPage="actualPage"
          />
        </section>
      </template>
    </DataTable>
  </section>
</template>
