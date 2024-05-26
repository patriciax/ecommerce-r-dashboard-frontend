<script setup lang="ts">
import LineChartCard from '@/components/dashboard/LineChartCard.vue'
import ListChartCard from '@/components/dashboard/ListChartCard.vue'
import { ref, computed, onMounted } from 'vue'
import { UserGroupIcon, BanknotesIcon, PencilIcon } from '@heroicons/vue/24/outline'
import DataTable from '@/components/DataTable.vue'
import { useAuthStore } from '@/stores/authStore'
import { statistic } from '@/api/repositories/statistic.repository'
import { decimalNumberFormat } from '@/utils/numberFormat'

const authStore = useAuthStore()
const statistics = ref(null)

const chartCustomer = ref({
  title: 'Clientes totales',
  icon: UserGroupIcon,
  count: ' 125,367'
})

const totalClients = ref({})
const totalRevenue = ref({})
const todayRevenue = ref({})

const products = ref([])
const productsLessSale = ref([])

onMounted(async () => {
  const response = await statistic()
 if(response){
    statistics.value = response
    totalClients.value = {
      title: 'Clientes totales',
      icon: UserGroupIcon,
      count: statistics.value.clients
    }

    totalRevenue.value = {
      title: 'Ingresos totales',
      icon: BanknotesIcon,
      count: `$${decimalNumberFormat(statistics.value.totalPayment)}`
    }

    todayRevenue.value = {
      title: 'Ingresos de hoy',
      icon: BanknotesIcon,
      count: `$${decimalNumberFormat(statistics.value.todayPurchase)}`
    }
    

    products.value = statistics.value.mostPurchasedProducts.map((item) => ({
      img: item.product.mainImage,
      title: `${item.product.name} - ${item.color.name} - ${item.size.name}`,
      price: `${decimalNumberFormat(item.product.priceDiscount || item.product.price )}`
    }))

    productsLessSale.value = statistics.value.lessPurchasedProducts.map((item) => ({
      img: item.product.mainImage,
      title: `${item.product.name} - ${item.color.name} - ${item.size.name}`,
      price: `${decimalNumberFormat(item.product.priceDiscount || item.product.price )}`
    }))
 }
})

const titlesTable = computed(() => [
  {
    width: 'w-4/12',
    title: 'Fecha'
  },

  {
    width: 'w-4/12',
    title: 'Cliente'
  },
  {
    width: 'w-2/12',
    title: 'Monto'
  }
])

</script>

<template>
  <div class="mb-8">
    <p class="font-bold mb-1 text-lg" v-text="`Bienvenido, ${authStore?.user?.name}`"></p>
    <p
      class="text-sm text-gray-400"
      v-text="'Siga aquí su actividad de ventas, clientes potenciales y acuerdos.'"
    ></p>
  </div>
  <section class="layout xl:gap-10 gap-4  xl:grid mb-6">
    <ListChartCard :data="products" :title-card="'Productos más vendidos'" />
    <ListChartCard :data="productsLessSale" :title-card="'Productos menos vendidos'" />

    <section class="grid xl:grid-cols-2 gap-6 expanded">
      <LineChartCard :options="totalClients" colorChart="#7E22CE" />
      <LineChartCard :options="totalRevenue" bg-icon="bg-cyan-500" colorChart="#06B6D4" />
      <LineChartCard :options="todayRevenue" bg-icon="bg-green-600" colorChart="#16A34A" />

      <section class="col-span-2">
        <DataTable :noHaveData="statistics?.latestSales?.length === 0" :headers="titlesTable">
          <template #body>
            <tr
              v-for="(item, index) in statistics?.latestSales"
              :key="index"
              class="border-b bg-white p-20 hover:bg-gray-50 text-default-text"
            >
              <td class="flex w-full cursor-pointer items-center gap-2 p-3">
                {{ item.created.toString().slice(0, 10) }}
              </td>
              <td class="p-3" v-text="item.name || '-'" />
              <td class="p-3" v-text="decimalNumberFormat(item.payment.total + item.payment.taxAmount + (item.payment?.carrierRate?.amount * 1 || 0))" />
            </tr>
          </template>
        </DataTable>
      </section>
    </section>
    

    <!-- <ListChartCard :data="productsAdd" :title-card="'Los favoritos'" />
    <LineChartCard :options="chartCustomer" bg-icon="bg-green-600" colorChart="#16A34A" /> -->
  </section>
</template>
