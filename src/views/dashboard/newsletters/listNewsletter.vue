<script setup lang="ts">
    
import { onMounted, ref } from 'vue';
import Spinner from '@/assets/icons/Spinner.vue';
import { useRouter } from 'vue-router'
import { listNewsletters } from '@/api/repositories/newsletter.repository';
import Pagination from '@/components/Pagination.vue';

    const router = useRouter()
    const newsletters:any = ref([])
    const limit = ref(10)
    const actualPage = ref(1)
    const loadingNewsletters = ref(false)
    const totalPages = ref(1)

    const getNewsletters = async (page = 1) => {
        actualPage.value = page
        loadingNewsletters.value = true
        const response = await listNewsletters(limit.value, actualPage.value)
        newsletters.value = response.data?.newsletters
        loadingNewsletters.value = false
        totalPages.value = response.totalPages
    }

    onMounted(async () => {
        getNewsletters()
    })

</script>

<template>
   <section>
        <div class="rounded-md bg-white shadow-lg w-full p-4">
            <div class="flex items-center justify-start">
                <table class="table-auto border-collapse border border-slate-500 w-full">
                    <thead>
                        <tr>
                            <th class="border border-slate-500">Titulo</th>
                        </tr>
                    </thead>
                    <tbody v-if="loadingNewsletters">
                        <tr>
                            <td colspan="3">
                                <div class="flex justify-center items-center">
                                    <Spinner />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                            <tr v-if="!newsletters.length">
                                <td colspan="3">
                                    <div class="flex justify-center items-center">
                                        <p>No hay newsletters a mostrar</p>
                                    </div>
                                </td>
                            </tr>
                            <tr v-for="newsletter in newsletters" :key="newsletter?._id">
                                <td class="border border-slate-500 px-4">{{ newsletter.title }}</td>
                            </tr>
                        
                    </tbody>
                </table>
            </div>
            <Pagination @changePageEmit="(page:number) => getNewsletters(page)" :totalPages="totalPages" :actualPage="actualPage" />
        </div>
    </section>
</template>