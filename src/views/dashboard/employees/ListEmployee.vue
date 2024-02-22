<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import ButtonIcon from '@/components/ButtonIcon.vue'
import TrashIcon from '@/components/icons/TrashIcon.vue'
import EditIcon from '@/components/icons/EditIcon.vue'
import { showNotification } from '@/composables/useNotification'
import Spinner from '@/assets/icons/Spinner.vue'
import { useRouter } from 'vue-router'
import { employeeList, employeeDelete } from '@/api/repositories/user.repository'
import Pagination from '@/components/Pagination.vue'
import DataTable from '@/components/DataTable.vue'
import Modal from '@/components/Modal.vue'

const router = useRouter()
const employees: any = ref([])
const limit = ref(10)
const actualPage = ref(1)
const loadingDelete = ref(false)
const loadingEmployees = ref(false)
const totalPages = ref(1)
const isOpenDeleteModal = ref(false)
const idToDelete = ref()

const deleteEmployee = async (id: string) => {
  try {
    loadingDelete.value = true

    const result = await employeeDelete(id)
    if (result.status == 'success') {
      showNotification('Empleado eliminado', 'success')
    }
    isOpenDeleteModal.value = false

    await getEmployees()
    loadingDelete.value = false
  } catch (error) {
    loadingDelete.value = false
    showNotification('Error al eliminar la categoría', 'error')
  }
}

const goToEditEmployee = async (id: string) => {
  await router.push({ name: 'edit-employee', params: { id } })
}

const getEmployees = async (page = 1) => {
  actualPage.value = page
  loadingEmployees.value = true
  const response = await employeeList(limit.value, actualPage.value)
  employees.value = response.data?.users
  loadingEmployees.value = false
  totalPages.value = response.totalPages
}

const titlesTable = computed(() => [
  {
    width: 'w-4/12',
    title: 'Nombre'
  },

  {
    width: 'w-1/6',
    title: ''
  },
  {
    width: 'w-1/2',
    title: ''
  },
  {
    width: 'w-4/12',
    title: ''
  }
])
const openModalDelete = (_id: number) => {
  idToDelete.value = _id
  isOpenDeleteModal.value = true
}

onMounted(async () => {
  getEmployees()
})
</script>

<template>
 
  <section>
    <div>
      <h1 class="title">Lista de Empleado</h1>
    </div>
    <DataTable
      :is-loading="loadingEmployees"
      title="Empleados"
      :noHaveData="employees.length === 0"
      :headers="titlesTable"
    >
      <template #body>
        <tr
          v-for="employee in employees"
          :key="employee?._id"
          class="border-b p-10 hover:bg-gray-50 text-default-text"
        >
          <td class="flex cursor-pointer items-center gap-2 p-3 capitalize">
            {{ employee.name }}
          </td>
          <td class="p-3"></td>
          <td class="p-3"></td>
          <td class="p-3 flex gap-2">
            <ButtonIcon
              color="bg-transparent hover:text-purple-500 text-blue-dark"
              size="p-0"
              @click="goToEditEmployee(employee?._id)"
            >
              <EditIcon />
            </ButtonIcon>
            <ButtonIcon
              color="bg-transparent text-blue-dark hover:text-red-500"
              size="p-2"
              :loading="loadingDelete"
              @click="openModalDelete(employee?._id)"
            >
              <TrashIcon />
            </ButtonIcon>
          </td>
        </tr>
      </template>
      <template #pagination>
        <section class="mt-4">
          <Pagination
            @changePageEmit="(page: number) => getEmployees(page)"
            :totalPages="totalPages"
            :actualPage="actualPage"
          />
        </section>
      </template>
    </DataTable>
  </section>

  <Modal
    v-if="isOpenDeleteModal"
    :title="'¿Está seguro de que desea eliminar?'"
    size="xs"
    withButton
    :firstButtonText="'Si, eliminar'"
    :secondaryButtonText="'Cancelar'"
    @close="isOpenDeleteModal = false"
    @secondButtonAction="isOpenDeleteModal = false"
    @firtsButtonAction="deleteEmployee(idToDelete)"
  />
</template>
