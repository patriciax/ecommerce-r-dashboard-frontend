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

const router = useRouter()
    const categories:any = ref([])
    const limit = ref(10)
    const page = ref(1)
    const loadingDelete = ref(false)
    const loadingCategories = ref(false)

    const deleteCategory = async(id:string) => {
        try{

            loadingDelete.value = true

            const result = await categoryDelete(id)
            if(result.status == 'success'){
                showNotification('Categoría eliminada', 'success')
            }
            
            await getCategories()
            loadingDelete.value = false

        }catch(error){
            loadingDelete.value = false
            showNotification('Error al eliminar la categoría', 'error')
        }
    }

    const goToEditCategory = async(id:string) => {
        await router.push({name: 'edit-category', params: {id}})
    }

    const getCategories = async () => {
        loadingCategories.value = true
        const response = await categoryList()
        categories.value = response.data?.categories
        loadingCategories.value = false
    }

    onMounted(async () => {
        getCategories()
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
                            <th class="border border-slate-500">Imágen</th>
                            <th class="border border-slate-500">Acciones</th>
                        </tr>
                    </thead>
                    <tbody v-if="loadingCategories">
                        <tr>
                            <td colspan="3">
                                <div class="flex justify-center items-center">
                                    <Spinner />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                            <tr v-if="!categories.length">
                                <td colspan="3">
                                    <div class="flex justify-center items-center">
                                        <p>No hay categorías a mostrar</p>
                                    </div>
                                </td>
                            </tr>
                            <tr v-for="category in categories" :key="category?._id">
                                <td class="border border-slate-500 px-4">{{ category.name }}</td>
                                <td class="border border-slate-500 px-4"><img :src="category?.image" alt="product" class="w-12 h-12 rounded-sm"/></td>
                                <td class="border border-slate-500 px-4">
                                    <ButtonIcon color="bg-blue-500" size="p-2" @click="goToEditCategory(category?._id)">
                                        <EditIcon/>
                                    </ButtonIcon>
                                    <ButtonIcon color="bg-red-500" size="p-2" :loading="loadingDelete" @click="deleteCategory(category?._id)">
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