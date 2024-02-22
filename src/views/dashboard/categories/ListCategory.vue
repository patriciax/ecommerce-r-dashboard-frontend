<script setup lang="ts">
import { categoryList } from '@/api/repositories/category.repository'
import { categoryDelete } from '@/api/repositories/category.repository'
import { onMounted, ref, computed } from 'vue'
import ButtonIcon from '@/components/ButtonIcon.vue'
import TrashIcon from '@/components/icons/TrashIcon.vue'
import EditIcon from '@/components/icons/EditIcon.vue'
import { showNotification } from '@/composables/useNotification'
import { useRouter } from 'vue-router'
import Pagination from '@/components/Pagination.vue'
import DataTable from '@/components/DataTable.vue'
import Modal from '@/components/Modal.vue'

const router = useRouter()
const categories: any = ref([])
const limit = ref(10)
const actualPage = ref(1)
const loadingDelete = ref(false)
const loadingCategories = ref(false)
const totalPages = ref(1)
const isOpenDeleteModal = ref(false)
const idToDelete = ref()

const deleteCategory = async (id: string) => {
  try {
    loadingDelete.value = true

    const result = await categoryDelete(id)
    if (result.status == 'success') {
      showNotification('Categoría eliminada', 'success')
    }
    isOpenDeleteModal.value = false
    await getCategories()
    loadingDelete.value = false
  } catch (error) {
    loadingDelete.value = false
    showNotification('Error al eliminar la categoría', 'error')
  }
}

const goToEditCategory = async (id: string) => {
  await router.push({ name: 'edit-category', params: { id } })
}

const getCategories = async (page = 1) => {
  actualPage.value = page
  loadingCategories.value = true
  const response = await categoryList(limit.value, actualPage.value)
  categories.value = response.data?.categories
  totalPages.value = response.totalPages
  loadingCategories.value = false
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
    width: 'w-1/5',
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
  getCategories()
})
</script>

<template>
  <section>
    <div>
      <h1 class="title">Lista de Categorias</h1>
    </div>
    <DataTable
      :is-loading="loadingCategories"
      title="Categorias"
      :noHaveData="!categories.length"
      :headers="titlesTable"
    >
      <template #body>
        <tr
          v-for="category in categories"
          :key="category?._id"
          class="border-b p-10 hover:bg-gray-50 text-default-text"
        >
          <td class="flex cursor-pointer items-center gap-2 p-3 capitalize">
            {{ category.name }}
          </td>
          <td class="p-3"></td>
          <td class="p-3"></td>
          <!-- <td class="p-3">
            <img :src="category?.mainImage" alt="category" class="w-12 h-12 rounded-sm" />
          </td> -->
          <td class="p-3 flex gap-2 justify-end">
            <ButtonIcon
              color="bg-transparent hover:text-purple-500 text-blue-dark"
              size="p-2"
              @click="goToEditCategory(category?._id)"
            >
              <EditIcon />
            </ButtonIcon>
            <ButtonIcon
              color="bg-transparent text-blue-dark hover:text-red-500"
              size="p-2"
              :loading="loadingDelete"
              @click="openModalDelete(category?._id)"
            >
              <TrashIcon />
            </ButtonIcon>
          </td>
        </tr>
      </template>
      <template #pagination>
        <section class="mt-4">
          <Pagination
            @changePageEmit="(page) => getCategories(page)"
            :totalPages="totalPages"
            :actualPage="actualPage"
          />
        </section>
      </template>
    </DataTable>
  </section>
  <Modal
    v-if="isOpenDeleteModal"
    :title="'¿Está seguro de que desea eliminar esta categoria?'"
    size="xs"
    withButton
    :firstButtonText="'Si, eliminar'"
    :secondaryButtonText="'Cancelar'"
    @close="isOpenDeleteModal = false"
    @secondButtonAction="isOpenDeleteModal = false"
    @firtsButtonAction="deleteCategory(idToDelete)"
  />
</template>
