<script setup lang="ts">
import { giftCardDelete, giftCardList } from '@/api/repositories/giftCard.repository'
import { onMounted, ref, computed } from 'vue'
import ButtonIcon from '@/components/ButtonIcon.vue'
import TrashIcon from '@/components/icons/TrashIcon.vue'
import EditIcon from '@/components/icons/EditIcon.vue'
import { showNotification } from '@/composables/useNotification'
import Spinner from '@/assets/icons/Spinner.vue'
import { useRouter } from 'vue-router'
import Pagination from '@/components/Pagination.vue'
import DataTable from '@/components/DataTable.vue'
import Modal from '@/components/Modal.vue'

const router = useRouter()
const giftCards: any = ref([])
const limit = ref(10)
const loadingDelete = ref(false)
const loadingGiftCard = ref(false)
const totalPages = ref(1)
const actualPage = ref(1)
const isOpenDeleteModal = ref(false)
const idToDelete = ref()

const deleteGiftCard = async (id: string) => {
  try {
    loadingDelete.value = true

    const result = await giftCardDelete(id)
    if (result.status == 'success') {
      showNotification('Gift Card eliminada', 'success')
    }
    isOpenDeleteModal.value = false

    await getGiftCards()
    loadingDelete.value = false
  } catch (error) {
    loadingDelete.value = false
    showNotification('Error al eliminar gift card', 'error')
  }
}

const goToEditGiftCard = async (id: string) => {
  await router.push({ name: 'edit-gift-card', params: { id } })
}

const getGiftCards = async (page = 1) => {
  actualPage.value = page
  loadingGiftCard.value = true
  const response = await giftCardList(limit.value, actualPage.value)

  totalPages.value = response.totalPages
  giftCards.value = response.data?.giftCards
  loadingGiftCard.value = false
}

const titlesTable = computed(() => [
  {
    width: 'w-4/12',
    title: 'Nombre'
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
  getGiftCards()
})
</script>

<template>

  <section>
    <div>
      <h1 class="title">Lista de Gift Cards</h1>
    </div>
    <DataTable
      :is-loading="loadingGiftCard"
      title="Gift Cards"
      :noHaveData="giftCards.length === 0"
      :headers="titlesTable"
    >
      <template #body>
        <tr
          v-for="giftCard in giftCards"
          :key="giftCard?._id"
          class="border-b p-10 hover:bg-gray-50 text-default-text"
        >
          <td class="flex cursor-pointer items-center gap-2 p-3 capitalize">
            {{ giftCard.name }}
          </td>
          <td class="p-3"></td>
          <td class="p-3"></td>
          <td class="p-3 flex gap-2">
            <ButtonIcon
              color="bg-transparent hover:text-purple-500 text-blue-dark"
              size="p-0"
              @click="goToEditGiftCard(giftCard?._id)"
            >
              <EditIcon />
            </ButtonIcon>
            <ButtonIcon
              color="bg-transparent text-blue-dark hover:text-red-500"
              size="p-2"
              :loading="loadingDelete"
              @click="openModalDelete(giftCard?._id)"
            >
              <TrashIcon />
            </ButtonIcon>
          </td>
        </tr>
      </template>
      <template #pagination>
        <section class="mt-4">
          <Pagination
            @changePageEmit="(page: number) => getGiftCards(page)"
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
    @firtsButtonAction="deleteGiftCard(idToDelete)"
  />
</template>
