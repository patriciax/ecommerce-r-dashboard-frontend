<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import ButtonIcon from '@/components/ButtonIcon.vue'
import TrashIcon from '@/components/icons/TrashIcon.vue'
import EditIcon from '@/components/icons/EditIcon.vue'
import { showNotification } from '@/composables/useNotification'
import { useRouter } from 'vue-router'
import { sizeDelete, sizeList } from '@/api/repositories/size.repository'
import Pagination from '@/components/Pagination.vue'
import DataTable from '@/components/DataTable.vue'
import Modal from '@/components/Modal.vue'

const router = useRouter()
const sizes: any = ref([])
const limit = ref(10)
const actualPage = ref(1)
const totalPages = ref(1)
const loadingDelete = ref(false)
const loadingSizes = ref(false)
const isOpenDeleteModal = ref(false)
const idToDelete = ref()

const deleteSize = async (id: string) => {
  try {
    loadingDelete.value = true

    const result = await sizeDelete(id)
    if (result.status == 'success') {
      showNotification('Talla eliminada', 'success')
    }
    isOpenDeleteModal.value = false

    await getSizes()
    loadingDelete.value = false
  } catch (error) {
    loadingDelete.value = false
    showNotification('Error al eliminar la talla', 'error')
  }
}

const goToEditSize = async (id: string) => {
  await router.push({ name: 'edit-size', params: { id } })
}

const getSizes = async (page = 1) => {
  actualPage.value = page
  loadingSizes.value = true
  const response = await sizeList(limit.value, page)
  totalPages.value = response.totalPages
  sizes.value = response.data?.sizes
  loadingSizes.value = false
}
const titlesTable = computed(() => [
  {
    width: 'w-4/12',
    title: 'Nombre'
  },

  {
    width: 'w-1/6',
    title: 'Stock'
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
const openModalDelete = (_id: number) => {
  idToDelete.value = _id
  isOpenDeleteModal.value = true
}

onMounted(async () => {
  getSizes()
})
</script>

<template>
  <section>
    <div>
      <h1 class="title">Lista de tallas</h1>
    </div>
    <DataTable
      :is-loading="loadingSizes"
      title="Tallas"
      :noHaveData="sizes.length === 0"
      :headers="titlesTable"
    >
      <template #body>
        <tr
        v-for="size in sizes" :key="size?._id"
          class="border-b p-10 hover:bg-gray-50 text-default-text"
        >
          <td class="flex cursor-pointer items-center gap-2 p-3 capitalize">
            {{ size.name }}
          </td>
          <td class="p-3">
            {{ size.stock }}
          </td>
          <td class="p-3">
          </td>
          <td class="p-3 flex gap-2">
            <ButtonIcon
              color="bg-transparent hover:text-purple-500 text-blue-dark"
              size="p-0"
              @click="goToEditSize(size?._id)"
            >
              <EditIcon />
            </ButtonIcon>
            <ButtonIcon
              color="bg-transparent text-blue-dark hover:text-red-500"
              size="p-2"
              :loading="loadingDelete"
              @click="openModalDelete(size?._id)"
            >
              <TrashIcon />
            </ButtonIcon>
          </td>
        </tr>
      </template>
      <template #pagination>
        <section class="mt-4">
          <Pagination
            @changePageEmit="(page: number) => getSizes(page)"
            :totalPages="totalPages"
            :actualPage="actualPage"
          />
        </section>
      </template>
    </DataTable>
  </section>

  <Modal
    v-if="isOpenDeleteModal"
    :title="'¿Está seguro de que desea eliminar?'"
    size="xs"
    withButton
    :firstButtonText="'Si, eliminar'"
    :secondaryButtonText="'Cancelar'"
    @close="isOpenDeleteModal = false"
    @secondButtonAction="isOpenDeleteModal = false"
    @firtsButtonAction="deleteSize(idToDelete)"
  />
</template>
