<script setup lang="ts">
import { invoicesList, updateInvoice } from '@/api/repositories/invoice.repository'
import { onMounted, ref,computed } from 'vue'
import ButtonIcon from '@/components/ButtonIcon.vue'
import TrashIcon from '@/components/icons/TrashIcon.vue'
import EditIcon from '@/components/icons/EditIcon.vue'
import { showNotification } from '@/composables/useNotification'
import { useRouter } from 'vue-router'
import Pagination from '@/components/Pagination.vue'
import DataTable from '@/components/DataTable.vue'
import Modal from '@/components/Modal.vue'
import TextField from '@/components/TextField.vue'

const isOpenAddTrackingModal = ref(false)
const invoiceToAddTracking = ref()
const trackingToAdd = ref("")

const router = useRouter()
const invoices: any = ref([])
const limit = ref(10)
const loadingInvoices = ref(false)
const totalPages = ref(1)
const actualPage = ref(1)

const getInvoices = async (page = 1) => {
  actualPage.value = page
  loadingInvoices.value = true
  const response = await invoicesList(limit.value, actualPage.value)

  totalPages.value = response.totalPages
  invoices.value = response.data?.invoices
  loadingInvoices.value = false
}

const titlesTable = computed(() => [
  {
    width: 'w-1/12',
    title: 'Fecha'
  },
  {
    width: 'w-2/12',
    title: 'Usuario'
  },
  {
    width: 'w-1/12',
    title: 'Email'
  },
  {
    width: 'w-1/12',
    title: 'Número de compra'
  },
  {
    width: 'w-1/12',
    title: 'Servicio de envío'
  },
  {
    width: 'w-1/12',
    title: 'Tracking'
  },
  {
    width: 'w-1/12',
    title: 'Acciones'
  }
])

const updateTracking = async (invoice: any) => {
  
  try {

    if(!trackingToAdd.value) return showNotification('El tracking es requerido', 'error')

    await updateInvoice(invoiceToAddTracking.value, { shippingTracking: trackingToAdd.value })
    isOpenAddTrackingModal.value = false
    trackingToAdd.value = ""
    await getInvoices()
  } catch (error) {
    showNotification('Error al actualizar el tracking', 'error')
  }

}

onMounted(async () => {
    getInvoices()
})
</script>

<template>

  <section>
    <div>
      <h1 class="title">Lista de compras</h1>
    </div>
    <DataTable
      :is-loading="loadingInvoices"
      title="Compras"
      :noHaveData="invoices.length === 0"
      :headers="titlesTable"
    >
      <template #body>
        <tr
        v-for="invoice in invoices" :key="invoice?._id"
          class="border-b p-10 hover:bg-gray-50 text-default-text"
        >
          <td class="flex cursor-pointer items-center gap-2 p-3 capitalize">
            {{ invoice.created.toString().substring(0, 10) }}
          </td>
          <td class="p-3">
            {{ invoice.user?.name ?? invoice.name }}
          </td>
          <td class="p-3">
            {{ invoice.user?.email  ?? invoice.email }}
          </td>
          <td class="p-3">
            {{ invoice.transactionOrder }}
          </td>
          <td class="p-3">
            {{ invoice.shippingService }}
          </td>
          <td class="p-3">
            {{ invoice.shippingTracking ?? 'Pendiente por tracking' }}
          </td>
          <td class="p-3 flex gap-2">
            <ButtonIcon
              color="bg-transparent hover:text-purple-500 text-blue-dark"
              size="p-0"
              @click="isOpenAddTrackingModal = true; invoiceToAddTracking = invoice._id"
            >
              <EditIcon />
            </ButtonIcon>
          </td>
        </tr>
      </template>
      <template #pagination>
        <section class="mt-4">
          <Pagination
            @changePageEmit="(page: number) => getInvoices(page)"
            :totalPages="totalPages"
            :actualPage="actualPage"
          />
        </section>
      </template>
    </DataTable>


    <Modal
      v-if="isOpenAddTrackingModal"
      :title="'Añadir tracking'"
      size="xs"
      withButton
      :firstButtonText="'Si, actualizar'"
      :secondaryButtonText="'Cancelar'"
      @close="isOpenAddTrackingModal = false"
      @secondButtonAction="isOpenAddTrackingModal = false"
      @firtsButtonAction="updateTracking(invoiceToAddTracking)"
    >
      <section>
        <div class="mb-4">
          <TextField
            v-model="trackingToAdd"
            label="Número de tracking"
            type="text"
          />
        </div>
      </section>
    </Modal>


  </section>

</template>
