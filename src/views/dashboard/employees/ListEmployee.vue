<script setup lang="ts">
    
import { onMounted, ref } from 'vue';
import ButtonIcon from '@/components/ButtonIcon.vue';
import TrashIcon from '@/components/icons/TrashIcon.vue';
import EditIcon from '@/components/icons/EditIcon.vue';
import {showNotification} from '@/composables/useNotification';
import Spinner from '@/assets/icons/Spinner.vue';
import { useRouter } from 'vue-router'
import { employeeList, employeeDelete } from '@/api/repositories/user.repository';
import Pagination from '@/components/Pagination.vue';

const router = useRouter()
    const employees:any = ref([])
    const limit = ref(10)
    const actualPage = ref(1)
    const loadingDelete = ref(false)
    const loadingEmployees = ref(false)
    const totalPages = ref(1)

    const deleteEmployee = async(id:string) => {
        try{

            loadingDelete.value = true

            const result = await employeeDelete(id)
            if(result.status == 'success'){
                showNotification('Empleado eliminado', 'success')
            }
            
            await getEmployees()
            loadingDelete.value = false

        }catch(error){
            loadingDelete.value = false
            showNotification('Error al eliminar la categoría', 'error')
        }
    }

    const goToEditEmployee = async(id:string) => {
        await router.push({name: 'edit-employee', params: {id}})
    }

    const getEmployees = async (page = 1) => {
        actualPage.value = page
        loadingEmployees.value = true
        const response = await employeeList(limit.value, actualPage.value)
        employees.value = response.data?.users
        loadingEmployees.value = false
        totalPages.value = response.totalPages
    }

    onMounted(async () => {
        getEmployees()
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
                    <tbody v-if="loadingEmployees">
                        <tr>
                            <td colspan="3">
                                <div class="flex justify-center items-center">
                                    <Spinner />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                            <tr v-if="!employees.length">
                                <td colspan="3">
                                    <div class="flex justify-center items-center">
                                        <p>No hay empleados a mostrar</p>
                                    </div>
                                </td>
                            </tr>
                            <tr v-for="employee in employees" :key="employee?._id">
                                <td class="border border-slate-500 px-4">{{ employee.name }}</td>
                                <td class="border border-slate-500 px-4">
                                    <ButtonIcon color="bg-blue-500" size="p-2" @click="goToEditEmployee(employee?._id)">
                                        <EditIcon/>
                                    </ButtonIcon>
                                    <ButtonIcon color="bg-red-500" size="p-2" :loading="loadingDelete" @click="deleteEmployee(employee?._id)">
                                        <TrashIcon />
                                    </ButtonIcon>
                                </td>
                            </tr>
                        
                    </tbody>
                </table>
            </div>
            <Pagination @changePageEmit="(page:number) => getEmployees(page)" :totalPages="totalPages" :actualPage="actualPage" />
        </div>
    </section>
</template>