<script setup lang="ts">
import { ref } from 'vue'

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
  grid: {
    show: false
  },
  yaxis: {
    labels: {
      show: false
    }
  },
  xaxis: {
    labels: {
      show: false
    },
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
    data: [30, 25, 60, 10, 5, 40, 70, 91]
  }
])

const props = defineProps({
  bgIcon: String,
  options: [Object]
})
</script>

<template>
  <div class="card rounded-md p-3 flex justify-around w-full h-28">
    <div class="flex items-center justify-between">
      <div class="h-full mt-6 mr-6">
        <component
          v-if="props.options?.icon"
          :is="props.options?.icon"
          class="w-8 rounded-full text-white p-1.5"
          :class="props.bgIcon ? props.bgIcon : 'bg-purple-700'"
        />
      </div>
      <div>
        <p class="text-sm mb-0.5 text-blue-light" v-text="props.options?.title"></p>
        <p class="text-2xl font-medium" v-text="props.options?.count"></p>
      </div>
      <div class="w-44">
        <apexchart type="line" :options="chartOptions" :series="series"></apexchart>
      </div>
    </div>
  </div>
</template>
