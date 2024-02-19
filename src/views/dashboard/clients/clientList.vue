<script setup lang="ts">
    
import { onMounted, ref } from 'vue';
import Spinner from '@/assets/icons/Spinner.vue';
import { useRouter } from 'vue-router'
import { clientList } from '@/api/repositories/client.repository';
import Pagination from '@/components/Pagination.vue';

    const router = useRouter()
    const clients:any = ref([])
    const limit = ref(10)
    const actualPage = ref(1)
    const loadingClients = ref(false)
    const totalPages = ref(1)

    const getClients = async (page = 1) => {
        actualPage.value = page
        loadingClients.value = true
        const response = await clientList(limit.value, actualPage.value)
        clients.value = response.data?.clients
        loadingClients.value = false
        totalPages.value = response.totalPages
    }

    onMounted(async () => {
        getClients()
    })

</script>

<template>
   <section>
        <div class="rounded-md bg-white shadow-lg w-full p-4">
            <div class="flex items-center justify-start">
                <table class="table-auto border-collapse border border-slate-500 w-full">
                    <thead>
                        <tr>
                            <th class="border border-slate-500">Nombre</th>
                            <th class="border border-slate-500">Email</th>
                        </tr>
                    </thead>
                    <tbody v-if="loadingClients">
                        <tr>
                            <td colspan="3">
                                <div class="flex justify-center items-center">
                                    <Spinner />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                            <tr v-if="!clients.length">
                                <td colspan="3">
                                    <div class="flex justify-center items-center">
                                        <p>No hay clientes a mostrar</p>
                                    </div>
                                </td>
                            </tr>
                            <tr v-for="client in clients" :key="client?._id">
                                <td class="border border-slate-500 px-4">{{ client.name }}</td>
                                <td class="border border-slate-500 px-4">{{ client.email }}</td>
                            </tr>
                        
                    </tbody>
                </table>
            </div>
            <Pagination @changePageEmit="(page:number) => getClients(page)" :totalPages="totalPages" :actualPage="actualPage" />
        </div>
    </section>
</template>