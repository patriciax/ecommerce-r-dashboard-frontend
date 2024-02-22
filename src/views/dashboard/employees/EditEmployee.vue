<script setup lang="ts">
import TextField from '@/components/TextField.vue'
import Button from '@/components/Button.vue'

import { reactive, ref, computed, onMounted } from 'vue'
import { getEmployee, lastestEmployees, updateEmployee } from '@/api/repositories/user.repository'
import { helpers, minLength, required, email, alphaNum } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import { showNotification } from '@/composables/useNotification'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const lastestEmployeesList: any = ref([])

const nameError = computed(() => {
  return v$?.value.$errors?.find((item) => item.$property === 'employeeName')?.$message || ''
})

const emailError = computed(() => {
  return v$?.value.$errors?.find((item) => item.$property === 'employeeEmail')?.$message || ''
})

const passwordError = computed(() => {
  return v$?.value.$errors?.find((item) => item.$property === 'employeePassword')?.$message || ''
})

const loading = ref(false)
const state = reactive({
  employeeName: '',
  employeeEmail: '',
  employeePassword: ''
})

const rules = {
  employeeName: { required: helpers.withMessage('Este campo no puede estar vacío', required) },
  employeeEmail: {
    required: helpers.withMessage('Este campo no puede estar vacío', required),
    email: helpers.withMessage('El email no es válido', email)
  },
  employeePassword: {
    minLength: helpers.withMessage('La contraseña debe tener al menos 6 caracteres', minLength(6))
  }
}

const v$ = useVuelidate(rules, state)

const submitEmployee = async () => {
  const isFormCorrect = await v$.value.$validate()
  if (!isFormCorrect) return

  loading.value = true
  try {
    const data = {
      name: state.employeeName,
      email: state.employeeEmail,
      password: state.employeePassword
    }

    const result = await updateEmployee(route.params.id.toString(), data)

    if (result.status == 'success') {
      showNotification('Empleado actualizado exitosamente', 'success')
    }

    loading.value = false

    await router.push({ name: 'list-employee' })
  } catch (error) {
    console.log(error)
    showNotification('Error al actualizar empleado', 'error')
  }
}

const getLastEmployees = async () => {
  const result = await lastestEmployees()
  lastestEmployeesList.value = result.data?.users
}

const loadData = async () => {
  const result = await getEmployee(route.params.id.toString())
  if (result.status == 'success') {
    state.employeeName = result.data?.name
    state.employeeEmail = result.data?.email
  }
}

onMounted(() => {
  getLastEmployees()
  loadData()
})
</script>

<template>
  <section>
    <div>
      <h1 class="title">Editar Empleado</h1>
    </div>
    <div class="flex flex-col xl:flex-row gap-4">
      <div class="card-principal">
        <form
          class="w-full flex flex-col gap-x-10 gap-y-4"
          enctype="multipart/form-data"
          @submit.prevent="submitEmployee"
        >
          <TextField
            label="Nombre del empleado"
            type="text"
            placeholder="Ingrese el nombre del empleado"
            :error="`${nameError}`"
            v-model="state.employeeName"
          />
          <TextField
            :disabled="true"
            label="Email del empleado"
            type="text"
            placeholder="Ingrese el email del empleado"
            :error="`${emailError}`"
            v-model="state.employeeEmail"
          />
          <TextField
            label="Clave del empleado"
            type="text"
            placeholder="Ingrese la clave del empleado"
            :error="`${passwordError}`"
            v-model="state.employeePassword"
          />

          <section class="text-end col-span-2 mt-4">
            <Button buttonType="submit" title="Editar empleado " class="" :loading="loading" />
          </section>
     
        </form>
      </div>
      <div class="card-secondary">
        <div class="pb-2 flex items-center border-b mb-4">
          <div class="w-1 mr-2 rounded-lg h-5 bg-indigo-400"></div>
          <p class="font-semibold text-sm text-default-text" v-text="'Últimos agregados'"></p>
        </div>
        <div
          class="flex items-center justify-start bg-gray-100 px-4 pt-2 rounded-lg pb-2 mb-3"
          v-for="employee in lastestEmployeesList"
          :key="employee._id"
        >
          <div class="">
            <p class="text-sm font-semibold mb-0.5 truncate w-36 text-default-text capitalize">{{ employee.name }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
