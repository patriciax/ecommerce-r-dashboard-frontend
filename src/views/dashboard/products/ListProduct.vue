<script setup lang="ts">
    
    import { productDelete, productList } from '@/api/repositories/product.repository';
    import { onMounted, ref } from 'vue';
    import ButtonIcon from '@/components/ButtonIcon.vue';
    import TrashIcon from '@/components/icons/TrashIcon.vue';
    import EditIcon from '@/components/icons/EditIcon.vue';
    import {showNotification} from '@/composables/useNotification';
    import Spinner from '@/assets/icons/Spinner.vue';
    import { useRouter } from 'vue-router'

    const router = useRouter()
    const products:any = ref([])
    const limit = ref(10)
    const page = ref(1)
    const loadingDelete = ref(false)
    const loadingProducts = ref(false)

    const deleteProduct = async(id:string) => {
        try{

            loadingDelete.value = true

            const result = await productDelete(id)
            if(result.status == 'success'){
                showNotification('producto eliminado', 'success')
            }
            
            await getProducts()
            loadingDelete.value = false

        }catch(error){
            loadingDelete.value = false
            showNotification('Error al eliminar la talla', 'error')
        }
    }

    const goToEditProduct = async(id:string) => {
        await router.push({name: 'edit-product', params: {id}})
    }

    const getProducts = async () => {
        loadingProducts.value = true
        const response = await productList()
        products.value = response.data?.products
        loadingProducts.value = false
    }

    onMounted(async () => {
        getProducts()
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
                    <tbody v-if="loadingProducts">
                        <tr>
                            <td colspan="3">
                                <div class="flex justify-center items-center">
                                    <Spinner />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                            <tr v-if="!products.length">
                                <td colspan="3">
                                    <div class="flex justify-center items-center">
                                        <p>No hay productos a mostrar</p>
                                    </div>
                                </td>
                            </tr>
                            <tr v-for="product in products" :key="product?._id">
                                <td class="border border-slate-500 px-4">{{ product.name }}</td>
                                <td class="border border-slate-500 px-4"><img :src="product?.mainImage" alt="product" class="w-12 h-12 rounded-sm"/></td>
                                
                                <td class="border border-slate-500 px-4">
                                    <ButtonIcon color="bg-blue-500" size="p-2" @click="goToEditProduct(product?._id)">
                                        <EditIcon/>
                                    </ButtonIcon>
                                    <ButtonIcon color="bg-red-500" size="p-2" :loading="loadingDelete" @click="deleteProduct(product?._id)">
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