<script setup lang="ts">
    
    import { giftCardDelete, giftCardList } from '@/api/repositories/giftCard.repository';
    import { onMounted, ref } from 'vue';
    import ButtonIcon from '@/components/ButtonIcon.vue';
    import TrashIcon from '@/components/icons/TrashIcon.vue';
    import EditIcon from '@/components/icons/EditIcon.vue';
    import {showNotification} from '@/composables/useNotification';
    import Spinner from '@/assets/icons/Spinner.vue';
    import { useRouter } from 'vue-router'
    import Pagination from '@/components/Pagination.vue';

    const router = useRouter()
    const giftCards:any = ref([])
    const limit = ref(10)
    const loadingDelete = ref(false)
    const loadingGiftCard = ref(false)
    const totalPages = ref(1)
    const actualPage = ref(1)

    const deleteGiftCard = async(id:string) => {
        try{

            loadingDelete.value = true

            const result = await giftCardDelete(id)
            if(result.status == 'success'){
                showNotification('Gift Card eliminada', 'success')
            }
            
            await getGiftCards()
            loadingDelete.value = false

        }catch(error){
            loadingDelete.value = false
            showNotification('Error al eliminar gift card', 'error')
        }
    }

    const goToEditGiftCard = async(id:string) => {
        await router.push({name: 'edit-gift-card', params: {id}})
    }

    const getGiftCards = async (page = 1) => {
        actualPage.value = page
        loadingGiftCard.value = true
        const response = await giftCardList(limit.value, actualPage.value)
        
        totalPages.value = response.totalPages
        giftCards.value = response.data?.giftCards
        loadingGiftCard.value = false
    }

    onMounted(async () => {
        getGiftCards()
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
                            <th class="border border-slate-500">Acciones</th>
                        </tr>
                    </thead>
                    <tbody v-if="loadingGiftCard">
                        <tr>
                            <td colspan="3">
                                <div class="flex justify-center items-center">
                                    <Spinner />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                            <tr v-if="!giftCards.length">
                                <td colspan="3">
                                    <div class="flex justify-center items-center">
                                        <p>No hay colores a mostrar</p>
                                    </div>
                                </td>
                            </tr>
                            <tr v-for="giftCard in giftCards" :key="giftCard?._id">
                                <td class="border border-slate-500 px-4">{{ giftCard.name }}</td>
                                <td class="border border-slate-500 px-4">
                                    <ButtonIcon color="bg-blue-500" size="p-2" @click="goToEditGiftCard(giftCard?._id)">
                                        <EditIcon/>
                                    </ButtonIcon>
                                    <ButtonIcon color="bg-red-500" size="p-2" :loading="loadingDelete" @click="deleteGiftCard(giftCard?._id)">
                                        <TrashIcon />
                                    </ButtonIcon>
                                </td>
                            </tr>
                        
                    </tbody>
                </table>
            </div>
            <Pagination @changePageEmit="(page) => getGiftCards(page)" :totalPages="totalPages" :actualPage="actualPage" />
        </div>
    </section>
</template>