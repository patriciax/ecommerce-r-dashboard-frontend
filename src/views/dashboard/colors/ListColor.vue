<script setup lang="ts">
import { colorDelete, colorList } from '@/api/repositories/color.repository'
import { onMounted, ref,computed } from 'vue'
import ButtonIcon from '@/components/ButtonIcon.vue'
import TrashIcon from '@/components/icons/TrashIcon.vue'
import EditIcon from '@/components/icons/EditIcon.vue'
import { showNotification } from '@/composables/useNotification'
import { useRouter } from 'vue-router'
import Pagination from '@/components/Pagination.vue'
import DataTable from '@/components/DataTable.vue'
import Modal from '@/components/Modal.vue'

const router = useRouter()
const colors: any = ref([])
const limit = ref(10)
const loadingDelete = ref(false)
const loadingColors = ref(false)
const totalPages = ref(1)
const actualPage = ref(1)
const isOpenDeleteModal = ref(false)
const idToDelete = ref()

const deleteColor = async (id: string) => {
  try {
    loadingDelete.value = true

    const result = await colorDelete(id)
    if (result.status == 'success') {
      showNotification('Color eliminado', 'success')
    }
    isOpenDeleteModal.value = false

    await getColors()
    loadingDelete.value = false
  } catch (error) {
    loadingDelete.value = false
    showNotification('Error al eliminar la talla', 'error')
  }
}

const goToEditColor = async (id: string) => {
  await router.push({ name: 'edit-color', params: { id } })
}

const getColors = async (page = 1) => {
  actualPage.value = page
  loadingColors.value = true
  const response = await colorList(limit.value, actualPage.value)

  totalPages.value = response.totalPages
  colors.value = response.data?.colors
  loadingColors.value = false
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
  getColors()
})
</script>

<template>

  <section>
    <div>
      <h1 class="title">Lista de colores</h1>
    </div>
    <DataTable
      :is-loading="loadingColors"
      title="Colores"
      :noHaveData="colors.length === 0"
      :headers="titlesTable"
    >
      <template #body>
        <tr
        v-for="color in colors" :key="color?._id"
          class="border-b p-10 hover:bg-gray-50 text-default-text"
        >
          <td class="flex cursor-pointer items-center gap-2 p-3 capitalize">
            {{ color.name }}
          </td>
          <td class="p-3">
            {{ color.stock }}
          </td>
          <td class="p-3">
          </td>
          <td class="p-3 flex gap-2">
            <ButtonIcon
              color="bg-transparent hover:text-purple-500 text-blue-dark"
              size="p-0"
              @click="goToEditColor(color?._id)"
            >
              <EditIcon />
            </ButtonIcon>
            <ButtonIcon
              color="bg-transparent text-blue-dark hover:text-red-500"
              size="p-2"
              :loading="loadingDelete"
              @click="openModalDelete(color?._id)"
            >
              <TrashIcon />
            </ButtonIcon>
          </td>
        </tr>
      </template>
      <template #pagination>
        <section class="mt-4">
          <Pagination
            @changePageEmit="(page: number) => getColors(page)"
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
    @firtsButtonAction="deleteColor(idToDelete)"
  />
</template>
