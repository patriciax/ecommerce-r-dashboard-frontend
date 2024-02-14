<script setup lang="ts">
    
    import { colorDelete, colorList } from '@/api/repositories/color.repository';
    import { onMounted, ref } from 'vue';
    import ButtonIcon from '@/components/ButtonIcon.vue';
    import TrashIcon from '@/components/icons/TrashIcon.vue';
    import EditIcon from '@/components/icons/EditIcon.vue';
    import {showNotification} from '@/composables/useNotification';
    import Spinner from '@/assets/icons/Spinner.vue';
    import { useRouter } from 'vue-router'

    const router = useRouter()
    const colors:any = ref([])
    const limit = ref(10)
    const page = ref(1)
    const loadingDelete = ref(false)
    const loadingColors = ref(false)

    const deleteColor = async(id:string) => {
        try{

            loadingDelete.value = true

            const result = await colorDelete(id)
            if(result.status == 'success'){
                showNotification('Color eliminado', 'success')
            }
            
            await getColors()
            loadingDelete.value = false

        }catch(error){
            loadingDelete.value = false
            showNotification('Error al eliminar la talla', 'error')
        }
    }

    const goToEditColor = async(id:string) => {
        await router.push({name: 'edit-color', params: {id}})
    }

    const getColors = async () => {
        loadingColors.value = true
        const response = await colorList()
        colors.value = response.data?.colors
        loadingColors.value = false
    }

    onMounted(async () => {
        getColors()
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
                    <tbody v-if="loadingColors">
                        <tr>
                            <td colspan="3">
                                <div class="flex justify-center items-center">
                                    <Spinner />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                            <tr v-if="!colors.length">
                                <td colspan="3">
                                    <div class="flex justify-center items-center">
                                        <p>No hay colores a mostrar</p>
                                    </div>
                                </td>
                            </tr>
                            <tr v-for="color in colors" :key="color?._id">
                                <td class="border border-slate-500 px-4">{{ color.name }}</td>
                                <td class="border border-slate-500 px-4">
                                    <ButtonIcon color="bg-blue-500" size="p-2" @click="goToEditColor(color?._id)">
                                        <EditIcon/>
                                    </ButtonIcon>
                                    <ButtonIcon color="bg-red-500" size="p-2" :loading="loadingDelete" @click="deleteColor(color?._id)">
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