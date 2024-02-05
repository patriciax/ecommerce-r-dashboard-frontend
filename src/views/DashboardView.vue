<script setup lang="ts">
import LineChartCard from '@/components/dashboard/LineChartCard.vue';
import ListChartCard from '@/components/dashboard/ListChartCard.vue';
import DashboardLayout from '@/views/DashboardLayout.vue';

</script>

<template>
    <DashboardLayout>
        <div class="flex gap-4 w-full">
            <div class="w-1/3">
                <ListChartCard/>
            </div>
            <div class="grid grid-cols-2 gap-4 w-2/3 h-max">
                <LineChartCard/>
                <LineChartCard />
                <LineChartCard/>
                <LineChartCard />
            </div>
        </div>
        <div class="flex gap-4 w-full mt-4">
            <div class="w-2/3">
                <ListChartCard/>
            </div>
            <div class="grid grid-cols-1 gap-4 w-1/3 h-max">
                <LineChartCard/>
                <LineChartCard />
            </div>
        </div>
    </DashboardLayout>
</template>