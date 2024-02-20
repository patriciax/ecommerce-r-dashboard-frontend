<script setup lang="ts">
import { productDelete, productList } from '@/api/repositories/product.repository'
import { onMounted, ref, computed } from 'vue'
import ButtonIcon from '@/components/ButtonIcon.vue'
import TrashIcon from '@/components/icons/TrashIcon.vue'
import EditIcon from '@/components/icons/EditIcon.vue'
import { showNotification } from '@/composables/useNotification'
import Modal from '@/components/Modal.vue'
import { useRouter } from 'vue-router'
import Pagination from '@/components/Pagination.vue'
import DataTable from '@/components/DataTable.vue'

const router = useRouter()
const products: any = ref([])
const limit = ref(10)
const actualPage = ref(1)
const totalPages = ref(1)
const loadingDelete = ref(false)
const loadingProducts = ref(false)
const isOpenDeleteModal = ref(false)
const  idToDelete =ref()
const deleteProduct = async (id: string) => {
  try {
    loadingDelete.value = true

    const result = await productDelete(id)
    if (result.status == 'success') {
      showNotification('producto eliminado', 'success')
    }

    await getProducts()
    loadingDelete.value = false
  } catch (error) {
    loadingDelete.value = false
    showNotification('Error al eliminar la talla', 'error')
  }
}

const goToEditProduct = async (id: string) => {
  await router.push({ name: 'edit-product', params: { id } })
}

const getProducts = async (page = 1) => {
  actualPage.value = page
  loadingProducts.value = true
  const response = await productList(limit.value, actualPage.value)
  totalPages.value = response.totalPages
  products.value = response.data?.products
  loadingProducts.value = false
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
    title: 'imagen'
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
  getProducts()
})
</script>

<template>
  <section>
    <div>
      <h1 class="title">Lista de productos</h1>
    </div>
    <DataTable :is-loading="loadingProducts" title="Productos" :noHaveData="products.length === 0" :headers="titlesTable">
      <template #body>
        <tr
          v-for="product in products"
          :key="product?._id"
          class="border-b p-10 hover:bg-gray-50 text-default-text"
        >
          <td class="flex cursor-pointer items-center gap-2 p-3 capitalize">
            {{ product.name }}
          </td>
          <td class="p-3">
            {{ product.stock }}
          </td>
          <td class="p-3">
            <img :src="product?.mainImage" alt="product" class="w-12 h-12 rounded-sm" />
          </td>
          <td class="p-3 flex gap-2">
            <ButtonIcon color="bg-transparent hover:text-purple-500 text-blue-dark" size="p-0" @click="goToEditProduct(product?._id)">
              <EditIcon />
            </ButtonIcon>
            <ButtonIcon
              color="bg-transparent text-blue-dark hover:text-red-500"
            size="p-2"
              :loading="loadingDelete"
              @click="openModalDelete"
            >
              <TrashIcon />
            </ButtonIcon>
          </td>
        </tr>
      </template>
      <template #pagination>
    <section class="mt-4">
        <Pagination
          @changePageEmit="(page: number) => getProducts(page)"
          :totalPages="totalPages"
          :actualPage="actualPage"
        />
    </section>
      </template>
    </DataTable>
  </section>

  <Modal
    v-if="isOpenDeleteModal"
    :title="'¿Está seguro de que desea eliminar este producto?'"
    size="xs"
    withButton
    :firstButtonText="'Si, eliminar'"
    :secondaryButtonText="'Cancelar'"
    @close="isOpenDeleteModal = false"
    @secondButtonAction="isOpenDeleteModal = false"
    @firtsButtonAction="deleteProduct(idToDelete)"
  />
</template>
