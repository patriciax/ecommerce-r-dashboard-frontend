<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps({
  bgIcon: String,
  options: [Object],
  colorChart: String
})
const chartOptions = ref({
  chart: {
    type: 'line',
    toolbar: {
      show: false
    }
  },
  stroke: {
    curve: 'smooth'
  },
  legend: {
    show: false
  },
  colors: [props.colorChart],

  grid: {
    show: false
  },
  yaxis: {
    labels: {
      show: false
    }
  },
  // xaxis: {
  //   labels: {
  //     show: false
  //   },
  //   axisBorder: {
  //     show: false
  //   },
  //   axisTicks: {
  //     show: false
  //   }
  // },

  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  }
})

const series = ref([
  {
    name: 'series-1',
    data: [30, 25, 60, 91, 5]
  }
])
</script>

<template>
  <div class="card rounded-md p-3 flex 2xl:flex-row flex-col">
    <div class="flex mt-4">
      <div class=" mr-6">
        <component
          v-if="props.options?.icon"
          :is="props.options?.icon"
          class="w-8 rounded-full text-white p-1.5"
          :class="props.bgIcon ? props.bgIcon : 'bg-purple-700'"
        />
      </div>
      <div>
        <p class="text-sm mb-1 text-blue-light" v-text="props.options?.title"></p>
        <p class="text-2xl font-medium" v-text="props.options?.count"></p>
      </div>
    </div>
    <!-- <div class="xl:w-44 w-auto m-auto">
      <apexchart type="line" :options="chartOptions" :series="series"></apexchart>
    </div> -->
  </div>
</template>
