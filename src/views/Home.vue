<script setup lang="ts">
import LineChartCard from '@/components/dashboard/LineChartCard.vue'
import ListChartCard from '@/components/dashboard/ListChartCard.vue'
import { ref } from 'vue'
import { ArchiveBoxIcon, UserGroupIcon,BanknotesIcon } from '@heroicons/vue/24/outline'

const chartCustomer = ref({
  title: 'Clientes totales',
  icon: UserGroupIcon,
  count:' 125,367'
})

const chartCustomer2 = ref({
  title: 'Ingresos totales',
  icon: BanknotesIcon,
  count: '$125'
})
const chartCustomer3 = ref({
  title: 'Conversion Ratio',
  icon: ArchiveBoxIcon,
  count: 125
})
</script>

<template>
  <section class="grid grid-cols-2 gap-10 ">
    <ListChartCard />
    <section class="grid grid-cols-2 gap-6">
      <LineChartCard :options="chartCustomer" />
      <LineChartCard :options="chartCustomer2" bg-icon="bg-cyan-500" />
      <LineChartCard :options="chartCustomer" bg-icon="bg-green-600"/>
      <LineChartCard :options="chartCustomer"  bg-icon="bg-orange-500"/>

    </section>
  </section>
  <!-- <div class="flex gap-4 w-full">
            <div class="w-1/3">
                <ListChartCard/>
            </div>
            <div class="grid grid-cols-2 gap-4 w-2/3 h-max">
                <LineChartCard/>
                <LineChartCard />
                <LineChartCard/>
                <LineChartCard />
            </div>
        </div> -->
 
</template>
