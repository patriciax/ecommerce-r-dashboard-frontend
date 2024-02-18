<script setup lang="ts">
import LineChartCard from '@/components/dashboard/LineChartCard.vue'
import ListChartCard from '@/components/dashboard/ListChartCard.vue'
import { ref, computed } from 'vue'
import { ArchiveBoxIcon, UserGroupIcon, BanknotesIcon, PencilIcon } from '@heroicons/vue/24/outline'
import DataTable from '@/components/DataTable.vue'

const chartCustomer = ref({
  title: 'Clientes totales',
  icon: UserGroupIcon,
  count: ' 125,367'
})

const chartCustomer2 = ref({
  title: 'Ingresos totales',
  icon: BanknotesIcon,
  count: '$125'
})

const products = ref([
  {
    title: 'Product',
    img: 'https://picsum.photos/200/300',
    price: '200'
  },
  {
    title: 'Product 2',
    img: 'https://picsum.photos/200/300',
    price: '20'
  },
  {
    title: 'Product 3',
    img: 'https://picsum.photos/200/300',
    price: '0'
  },
  {
    title: 'Product 4',
    img: 'https://picsum.photos/200/300',
    price: '500'
  },
  {
    title: 'Product 5',
    img: 'https://picsum.photos/200/300',
    price: '900'
  },
  {
    title: 'Product 6',
    img: 'https://picsum.photos/200/300',
    price: '10'
  }
])
const productsAdd = ref([
  {
    title: 'Product 5',
    img: 'https://picsum.photos/200/300',
    price: '900'
  },
  {
    title: 'Product 6',
    img: 'https://picsum.photos/200/300',
    price: '10'
  }
])

const titlesTable = computed(() => [
  {
    width: 'w-4/12',
    title: 'Campo 1'
  },

  {
    width: 'w-4/12',
    title: 'Campo 2'
  },
  {
    width: 'w-2/12',
    title: 'Campo 3'
  },
  {
    width: 'w-2/12',
    title: 'Actions'
  }
])

const data = ref([
  {
    name: 'product 1',
    cantidad: '2',
    precio: '200'
  },
  {
    name: 'product 1',
    cantidad: '2',
    precio: '200'
  },
  {
    name: 'product 1',
    cantidad: '2',
    precio: '200'
  }
])
</script>

<template>
  <div class="mb-8">
    <p class="font-bold mb-1 text-lg" v-text="'Bienvenido, Willian Rodriguez'"></p>
    <p
      class="text-sm text-gray-400"
      v-text="'Siga aquí su actividad de ventas, clientes potenciales y acuerdos.'"
    ></p>
  </div>
  <section class="layout xl:gap-10 gap-4 grid mb-6">
    <ListChartCard :data="products" :title-card="'Últimos productos vendidos'" />
    <ListChartCard :data="productsAdd" :title-card="'Últimos productos agregados'" />

    <section class="grid grid-cols-2 gap-6 expanded">
      <LineChartCard :options="chartCustomer" colorChart="#7E22CE" />
      <LineChartCard :options="chartCustomer2" bg-icon="bg-cyan-500" colorChart="#06B6D4" />
      <LineChartCard :options="chartCustomer" bg-icon="bg-green-600" colorChart="#16A34A" />
      <LineChartCard :options="chartCustomer" bg-icon="bg-orange-500" colorChart="#F97316" />

      <section class="col-span-2">
        <DataTable :noHaveData="data.length === 0" :headers="titlesTable">
          <template #body>
            <tr
              v-for="(item, index) in data"
              :key="index"
              class="border-b bg-white p-20 hover:bg-gray-50 text-default-text"
            >
              <td class="flex w-full cursor-pointer items-center gap-2 p-3">
                {{ item.name }}
              </td>
              <td class="p-3" v-text="item.cantidad || '-'" />
              <td class="p-3" v-text="item.precio || '-'" />

              <td class="flex gap-4 px-6 py-3">
                <button class="group border p-2 rounded-md hover:bg-blue-light ">
                  <PencilIcon class="w-4 text-blue-light group-hover:text-white" />
                </button>
              </td>
            </tr>
          </template>
        </DataTable>
      </section>
    </section>

    <ListChartCard :data="productsAdd" :title-card="'Los favoritos'" />
    <LineChartCard :options="chartCustomer" bg-icon="bg-green-600" colorChart="#16A34A" />

  </section>
</template>
