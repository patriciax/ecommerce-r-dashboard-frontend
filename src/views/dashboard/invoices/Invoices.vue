<script setup lang="ts">
import { invoicesList, updateInvoice, updateInvoiceStatus, updateGiftCardStatus } from '@/api/repositories/invoice.repository'
import { onMounted, ref,computed } from 'vue'
import ButtonIcon from '@/components/ButtonIcon.vue'
import Button from '@/components/Button.vue'
import EditIcon from '@/components/icons/EditIcon.vue'
import { showNotification } from '@/composables/useNotification'
import { useRouter } from 'vue-router'
import Pagination from '@/components/Pagination.vue'
import DataTable from '@/components/DataTable.vue'
import Modal from '@/components/Modal.vue'
import TextField from '@/components/TextField.vue'
import IconDocumentation from '@/components/icons/IconDocumentation.vue'
import IconPay from '@/components/icons/IconPay.vue'
import { getPagoMovil } from '@/api/repositories/pagoMovil.repository'
import { decimalNumberFormat } from '@/utils/numberFormat'
import { getPrice } from '@/api/repositories/product.repository'

const paymentIdentificationToShow = ref('')
const addressTrackingToShow= ref('')
const officeTrackingToShow= ref('')
const phoneTrackingToShow= ref('')

const dolarPrice = ref(0)
const openProductsModal = ref(false)
const isOpenAddTrackingModal = ref(false)
const invoiceToAddTracking = ref()
const invoiceToshowProducts = ref()
const openPagosModalZelle = ref(false)
const invoiceToShowPaymentMethod = ref()
const invoiceToShowPagos = ref()
const trackingToAdd = ref("")
const openPagosModal = ref(false)

const bank = ref("")
const identification = ref("")
const phone = ref("")
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
    title: 'Método de pago'
  },
  {
    width: 'w-1/12',
    title: 'Status'
  },
  {
    width: 'w-1/12',
    title: 'Tipo de compra'
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

const acceptPago = async () => {
  try {

    if(invoices.value.find((invoice: any) => invoice._id == invoiceToShowPagos.value)?.purchaseType == 'giftCard'){
      await updateGiftCardStatus(invoiceToShowPagos.value, { status: 'approved' })
    }else{
      await updateInvoiceStatus(invoiceToShowPagos.value, { status: 'approved' })
    }
    
    openPagosModal.value = false
    openPagosModalZelle.value = false
    await getInvoices()
  } catch (error) {
    showNotification('Error al aceptar el pago', 'error')
  }
}

const rejectPago = async () => {
  try {
    if(invoices.value.find((invoice: any) => invoice._id == invoiceToShowPagos.value)?.purchaseType == 'giftCard'){
      await updateGiftCardStatus(invoiceToShowPagos.value, { status: 'rejected' })
    }else{
      await updateInvoiceStatus(invoiceToShowPagos.value, { status: 'rejected' })
    }
    openPagosModal.value = false
    openPagosModalZelle.value = false
    await getInvoices()
  } catch (error) {
    showNotification('Error al aceptar el pago', 'error')
  }
}

const showTrackingUpdate = (invoice) => {

  paymentIdentificationToShow.value = invoice.payment?.identification
  addressTrackingToShow.value = `${invoice.carrier?.address} ${invoice.carrier?.state}`
  officeTrackingToShow.value = `${invoice.carrier?.carrierName} ${invoice.carrier?.office}`
  phoneTrackingToShow.value = invoice.phone

  isOpenAddTrackingModal.value = true; 
  invoiceToAddTracking.value = invoice._id
}

const productsToShow = computed(() => {
  return invoices.value.find((invoice: any) => invoice._id == invoiceToshowProducts.value)?.invoiceProduct
})

const pagosToShow = computed(() => {
  return invoices.value.find((invoice: any) => invoice._id == invoiceToShowPagos.value ||  invoice._id == invoiceToshowProducts.value)
})

onMounted(async () => {
    getInvoices()
    const response = await getPagoMovil()
    const responsePrice = await getPrice()
    if (responsePrice) {
      dolarPrice.value = responsePrice.price
    }
    bank.value = response.data?.bank
    identification.value = response.data?.identification
    phone.value = response.data?.phone
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
            {{ invoice.user?.name ?? invoice?.name }}
          </td>
          <td class="p-3">
            {{ invoice.user?.email  ?? invoice?.email }}
          </td>
          <td class="p-3">
            {{ invoice?.transactionOrder }}
          </td>
          <td class="p-3">
            {{ invoice?.payment?.type }}
          </td>
          <td class="p-3">
            {{ invoice?.payment?.status }}
          </td>
          <td class="p-3">
            {{ invoice?.payment?.purchaseType }}
          </td>
          <td class="p-3">
            {{ invoice?.carrier?.carrierName }}
          </td>
          <td class="p-3">
            {{ invoice?.payment?.purchaseType == 'giftCard' ? '' : (invoice.shippingTracking ?? 'Pendiente por tracking') }}
          </td>
          <td class="p-3 flex gap-2">
            <ButtonIcon
              v-if="invoice?.payment?.status == 'approved' && invoice?.payment?.purchaseType == 'invoice'"
              color="bg-transparent hover:text-purple-500 text-blue-dark"
              size="p-0"
              @click="showTrackingUpdate(invoice)"
            >
              <EditIcon />
            </ButtonIcon>

            <ButtonIcon
            v-if="invoice?.payment?.purchaseType == 'invoice'"
              color="bg-transparent hover:text-purple-500 text-blue-dark"
              size="p-0"
              @click="openProductsModal = true; invoiceToshowProducts = invoice._id"
            >
              <IconDocumentation/>
            </ButtonIcon>

            <ButtonIcon
              v-if="invoice?.payment?.type == 'pagoMovil' && invoice.payment?.status == 'pending'"
              color="bg-transparent hover:text-purple-500 text-blue-dark"
              size="p-0"
              @click="openPagosModal = true; invoiceToShowPagos = invoice._id"
            >
              <IconPay/>
            </ButtonIcon>

            <ButtonIcon
              v-if="invoice?.payment?.type == 'zelle' && invoice.payment?.status == 'pending'"
              color="bg-transparent hover:text-purple-500 text-blue-dark"
              size="p-0"
              @click="openPagosModalZelle = true; invoiceToShowPagos = invoice._id"
            >
              <IconPay/>
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
        <p class="text-left">Identificación: {{ paymentIdentificationToShow }}</p>
        <p class="text-left">Dirección: {{ addressTrackingToShow }}</p>
        <p class="text-left">Oficina: {{ officeTrackingToShow }}</p>
        <p class="text-left">Teléfono: {{ phoneTrackingToShow }}</p>
        <div class="mb-4">
          <TextField
            v-model="trackingToAdd"
            label="Número de tracking"
            type="text"
          />
        </div>
      </section>
    </Modal>

    <Modal
      v-if="openProductsModal"
      :title="'Productos de la compra'"
      size="lg"
      @close="openProductsModal = false"
    >
      <section>
        <div class="mb-4">
          <table class="w-full text-sm text-left rtl:text-right">
            <thead class=" uppercase ">
              <tr>
                <th scope="col" class="px-6 py-3">Nombre</th>
                <th scope="col" class="px-6 py-3">Talla</th>
                <th scope="col" class="px-6 py-3">Color</th>
                <th scope="col" class="px-6 py-3">Cantidad</th>
                <th scope="col" class="px-6 py-3">Precio</th>
              </tr>
            </thead>
            <tbody>
              <tr
                class="border-b dark:border-gray-700"
                v-for="product in productsToShow"
                :key="product._id"
              >
                <td class="px-6 py-4">{{ product.product.name }}</td>
                <td class="px-6 py-4">{{ product.size.name }}</td>
                <td class="px-6 py-4">{{ product.color.name }}</td>
                <td class="px-6 py-4">{{ product.quantity }}</td>
                <td class="px-6 py-4">{{ pagosToShow?.payment?.type == 'banesco' ||pagosToShow?.payment?.type == 'pagoMovil' ? 'Bs.' : '$' }}{{ decimalNumberFormat(pagosToShow.payment?.type == 'giftCard' || pagosToShow.payment?.type == 'zelle' || pagosToShow.payment?.type == 'paypal' ? (product.product.priceDiscount || product.product.price) : (product.product.priceDiscount || product.product.price) * dolarPrice) }}</td>
              </tr>
              <tr>
                <td class="px-6 py-4"></td>
                <td class="px-6 py-4"></td>
                <td class="px-6 py-4"></td>
                <td class="px-6 py-4 uppercase">Envío</td>
                <td class="px-6 py-4">{{ pagosToShow?.payment?.type == 'banesco' ||pagosToShow?.payment?.type == 'pagoMovil' ? 'Bs.' : '$' }}{{ decimalNumberFormat(pagosToShow.payment?.carrierRate?.amount ?? 0) }}</td>
              </tr>
              <tr>
                <td class="px-6 py-4"></td>
                <td class="px-6 py-4"></td>
                <td class="px-6 py-4"></td>
                <td class="px-6 py-4 uppercase">IVA</td>
                <td class="px-6 py-4">{{ pagosToShow?.payment?.type == 'banesco' ||pagosToShow?.payment?.type == 'pagoMovil' ? 'Bs.' : '$' }}{{ decimalNumberFormat(pagosToShow.payment?.taxAmount ?? 0) }}</td>
              </tr>
              <tr>
                <td class="px-6 py-4"></td>
                <td class="px-6 py-4"></td>
                <td class="px-6 py-4"></td>
                <td class="px-6 py-4 uppercase">Total</td>
                <td class="px-6 py-4">{{ pagosToShow?.payment?.type == 'banesco' ||pagosToShow?.payment?.type == 'pagoMovil' ? 'Bs.' : '$' }}{{ decimalNumberFormat(pagosToShow.payment?.total + (pagosToShow.payment?.carrierRate ? pagosToShow.payment?.carrierRate?.amount * 1 : 0) + pagosToShow.payment.taxAmount) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </Modal>

    <Modal
      v-if="openPagosModal"
      :title="'Métodos de pago'"
      size="lg"
      @close="openPagosModal = false"
    >
      <section>
        <div class="mb-4">
          <table class="w-full text-sm text-left rtl:text-right">
            <thead class=" uppercase ">
              <tr>
                <th scope="col" class="px-6 py-3">Banco</th>
                <th scope="col" class="px-6 py-3">Referencia</th>
                <th scope="col" class="px-6 py-3">Fecha</th>
                <th scope="col" class="px-6 py-3">Monto</th>
              </tr>
            </thead>
            <tbody>
              <tr
                class="border-b dark:border-gray-700"
                :key="pagosToShow._id"
              >
                <td class="px-6 py-4">{{ pagosToShow?.payment?.bank }}</td>
                <td class="px-6 py-4">{{ pagosToShow.pagoMovilReference }}</td>
                <td class="px-6 py-4">{{ pagosToShow.pagoMovilDate.substring(0, 10) }}</td>
                <td class="px-6 py-4">${{ pagosToShow.payment?.total.toFixed(2) }}</td>
              </tr>
              <tr>
                <td class="px-6 py-4"></td>
                <td class="px-6 py-4"></td>
                <td class="px-6 py-4"></td>
                <td class="px-6 py-4 uppercase">Envío</td>
                <td class="px-6 py-4">{{ pagosToShow?.payment?.type == 'banesco' ||pagosToShow?.payment?.type == 'pagoMovil' ? 'Bs.' : '$' }} {{ decimalNumberFormat(pagosToShow.payment?.carrierRate?.amount ?? 0) }}</td>
              </tr>
              <tr>
                <td class="px-6 py-4"></td>
                <td class="px-6 py-4"></td>
                <td class="px-6 py-4"></td>
                <td class="px-6 py-4 uppercase">IVA</td>
                <td class="px-6 py-4">{{ pagosToShow?.payment?.type == 'banesco' ||pagosToShow?.payment?.type == 'pagoMovil' ? 'Bs.' : '$' }} {{ decimalNumberFormat(pagosToShow.payment?.taxAmount ?? 0) }}</td>
              </tr>
              <tr>
                <td class="px-6 py-4"></td>
                <td class="px-6 py-4"></td>
                <td class="px-6 py-4"></td>
                <td class="px-6 py-4 uppercase">Total</td>
                <td class="px-6 py-4">{{ pagosToShow?.payment?.type == 'banesco' ||pagosToShow?.payment?.type == 'pagoMovil' ? 'Bs.' : '$' }} {{ decimalNumberFormat(pagosToShow.payment?.total + (pagosToShow.payment?.carrierRate ? pagosToShow.payment?.carrierRate?.amount * 1 : 0) + pagosToShow.payment.taxAmount) }}</td>
              </tr>
            </tbody>
            <tfoot class="flex space-x-2 mt-2" >
              <Button
              color="primary"
              title="Aceptar"
              size="w-full"  
              @click="acceptPago"
              />
              <Button
              color="secondary"
              title="Rechazar"
              size="w-full" 
              @click="rejectPago" 
              />
            </tfoot>
          </table>
        </div>
      </section>
    </Modal>

    <Modal
      v-if="openPagosModalZelle"
      :title="'Métodos de pago'"
      size="lg"
      @close="openPagosModalZelle = false"
    >
      <section>
        <div class="mb-4">
          <table class="w-full text-sm text-left rtl:text-right">
            <thead class=" uppercase ">
              <tr>
                <th scope="col" class="px-6 py-3">Zelle</th>
                <th scope="col" class="px-6 py-3">Referencia</th>
                <th scope="col" class="px-6 py-3">Fecha</th>
                <th scope="col" class="px-6 py-3">Monto</th>
              </tr>
            </thead>
            <tbody>
              <tr
                class="border-b dark:border-gray-700"
                :key="pagosToShow._id"
              >
                <td class="px-6 py-4">{{ pagosToShow?.payment?.zelleEmail }}</td>
                <td class="px-6 py-4">{{ pagosToShow.pagoMovilReference }}</td>
                <td class="px-6 py-4">{{ pagosToShow.pagoMovilDate.substring(0, 10) }}</td>
                <td class="px-6 py-4">${{ decimalNumberFormat(pagosToShow.payment?.total) }}</td>
              </tr>
              <tr>
                <td class="px-6 py-4"></td>
                <td class="px-6 py-4"></td>
                <td class="px-6 py-4"></td>
                <td class="px-6 py-4 uppercase">Envío</td>
                <td class="px-6 py-4">$ {{ decimalNumberFormat(pagosToShow.payment?.carrierRate?.amount ?? 0) }}</td>
              </tr>
              <tr>
                <td class="px-6 py-4"></td>
                <td class="px-6 py-4"></td>
                <td class="px-6 py-4"></td>
                <td class="px-6 py-4 uppercase">IVA</td>
                <td class="px-6 py-4">${{ decimalNumberFormat(pagosToShow.payment?.taxAmount ?? 0) }}</td>
              </tr>
              <tr>
                <td class="px-6 py-4"></td>
                <td class="px-6 py-4"></td>
                <td class="px-6 py-4"></td>
                <td class="px-6 py-4 uppercase">Total</td>
                <td class="px-6 py-4">${{ decimalNumberFormat(pagosToShow.payment?.total + (pagosToShow.payment?.carrierRate?.amount * 1 ?? 0) + pagosToShow.payment.taxAmount) }}</td>
              </tr>
            </tbody>
            <tfoot class="flex space-x-2  mt-2">
              <Button
              color="primary"
              title="Aceptar"
              size="w-full"  
              @click="acceptPago"
              />
              <Button
              color="secondary"
              title="Rechazar"
              size="w-full" 
              @click="rejectPago" 
              />
            </tfoot>
          </table>
        </div>
      </section>
    </Modal>


  </section>

</template>
