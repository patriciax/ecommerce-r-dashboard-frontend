<script setup lang="ts">
    
import { categoryList } from '@/api/repositories/category.repository';
import { categoryDelete } from '@/api/repositories/category.repository';
import { onMounted, ref } from 'vue';
import ButtonIcon from '@/components/ButtonIcon.vue';
import TrashIcon from '@/components/icons/TrashIcon.vue';
import EditIcon from '@/components/icons/EditIcon.vue';
import {showNotification} from '@/composables/useNotification';
import Spinner from '@/assets/icons/Spinner.vue';
import { useRouter } from 'vue-router'
import { sizeDelete, sizeList } from '@/api/repositories/size.repository';

const router = useRouter()
    const sizes:any = ref([])
    const limit = ref(10)
    const page = ref(1)
    const loadingDelete = ref(false)
    const loadingSizes = ref(false)

    const deleteSize = async(id:string) => {
        try{

            loadingDelete.value = true

            const result = await sizeDelete(id)
            if(result.status == 'success'){
                showNotification('Talla eliminada', 'success')
            }
            
            await getSizes()
            loadingDelete.value = false

        }catch(error){
            loadingDelete.value = false
            showNotification('Error al eliminar la talla', 'error')
        }
    }

    const goToEditSize = async(id:string) => {
        await router.push({name: 'edit-size', params: {id}})
    }

    const getSizes = async () => {
        loadingSizes.value = true
        const response = await sizeList()
        sizes.value = response.data?.sizes
        loadingSizes.value = false
    }

    onMounted(async () => {
        getSizes()
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
                    <tbody v-if="loadingSizes">
                        <tr>
                            <td colspan="3">
                                <div class="flex justify-center items-center">
                                    <Spinner />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                            <tr v-if="!sizes.length">
                                <td colspan="3">
                                    <div class="flex justify-center items-center">
                                        <p>No hay tallas a mostrar</p>
                                    </div>
                                </td>
                            </tr>
                            <tr v-for="size in sizes" :key="size?._id">
                                <td class="border border-slate-500 px-4">{{ size.name }}</td>
                                <td class="border border-slate-500 px-4">
                                    <ButtonIcon color="bg-blue-500" size="p-2" @click="goToEditSize(size?._id)">
                                        <EditIcon/>
                                    </ButtonIcon>
                                    <ButtonIcon color="bg-red-500" size="p-2" :loading="loadingDelete" @click="deleteSize(size?._id)">
                                        <TrashIcon />
                                    </ButtonIcon>
                                </td>
                            </tr>
                        
                    </tbody>
                </table>
            </div>
        </div>
    </section>
</template>