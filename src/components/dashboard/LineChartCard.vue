<script setup lang="ts">
import UserIcon from '@/assets/icons/UserIcon.vue';
import { ref } from 'vue';

const chartOptions = ref({
    chart: {
        type: 'line',
        toolbar: {
            show: false,
        }
    },
    stroke: {
        curve: 'smooth',
    },
    legend: {
        show: false,
    },
    grid:{
        show: false,
    },
    yaxis:{
        labels:{
            show: false,
        }
    },
    xaxis:{
        labels:{
            show: false,
        },
        axisBorder:{
            show: false,
        },
        axisTicks:{
            show: false,
        }
    }
})

const series = ref([{
    name: 'series-1',
    data: [30, 25, 60, 10, 5, 40, 70, 91]
}])

</script>

<template>
    <div class="rounded-md bg-white shadow-md flex p-3 items-center h-28 justify-between">
        <div>
            <UserIcon />
        </div>
        <div>
            <div>
                <p>Total Customers</p>
                <p class="text-2xl mt-3">125,367</p>
            </div>
        </div>
        <div class="w-44">
            <apexchart type="line" :options="chartOptions" :series="series"
            ></apexchart>
        </div>
    </div>
</template>