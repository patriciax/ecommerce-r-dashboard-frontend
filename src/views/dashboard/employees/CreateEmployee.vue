<script setup lang="ts">
    import TextField from '@/components/TextField.vue';
    import Button from '@/components/Button.vue';
    import DashboardLayout from '@/views/DashboardLayout.vue';
    import { reactive, ref, nextTick, computed, onMounted } from 'vue';
    import { createEmployee, getEmployees, lastestEmployees } from '@/api/repositories/user.repository';
    import { helpers, minLength, required, email, alphaNum } from '@vuelidate/validators';
    import useVuelidate from '@vuelidate/core';
    import {showNotification} from '@/composables/useNotification';

    const lastestEmployeesList:any = ref([])

    const nameError = computed(() => {
        return v$?.value.$errors?.find(item => item.$property === 'employeeName')?.$message || ''
    })

    const emailError = computed(() => {
        return v$?.value.$errors?.find(item => item.$property === 'employeeEmail')?.$message || ''
    })

    const passwordError = computed(() => {
        return v$?.value.$errors?.find(item => item.$property === 'employeePassword')?.$message || ''
    })

    const loading = ref(false)
    const state = reactive({
        employeeName: '',
        employeeEmail: '',
        employeePassword: ''
    });

    const rules = {
        employeeName: { required:helpers.withMessage('Este campo no puede estar vacío', required)},
        employeeEmail: { required:helpers.withMessage('Este campo no puede estar vacío', required), email:helpers.withMessage('El email no es válido', email)},
        employeePassword: { required:helpers.withMessage('Este campo no puede estar vacío', required), minLength:helpers.withMessage('La contraseña debe tener al menos 6 caracteres', minLength(6))}
    }

    const v$ = useVuelidate(rules, state)

    const submitEmployee = async () =>{

        const isFormCorrect = await v$.value.$validate();
        if (!isFormCorrect) return

        loading.value = true
        try{
            
            const data = {
                "name": state.employeeName,
                "email": state.employeeEmail,
                "password": state.employeePassword
            }

            const result = await createEmployee(data)

            if(result.status == 'success'){
                showNotification('Empleado creado exitosamente', 'success')
            }

            clearForm()
            await getLastEmployees()
            loading.value = false

        }catch(error){
            console.log(error)
            showNotification('Error al crear el empleado', 'error')

        }

    }

    const clearForm = () => {

        state.employeeName = ''
        state.employeeEmail = ''
        state.employeePassword = ''
        v$?.value.$reset()

    }

    const getLastEmployees = async () => {
        const result = await lastestEmployees()
        lastestEmployeesList.value = result.data?.users
    }

    onMounted( () => { 
        getLastEmployees()
    })

</script>

<template>
    <DashboardLayout>
        <div>
            <h1>Create product</h1>
        </div>
        <div class="flex gap-4">
            <div class="rounded-md bg-white shadow-lg p-4 w-4/5">
                <form class="w-full" enctype="multipart/form-data" @submit.prevent="submitEmployee">
                    <TextField label="Nombre del empleado" type="text" placeholder="Ingrese el nombre del empleado" :error="`${nameError}`" v-model="state.employeeName"/>
                    <TextField label="Email del empleado" type="text" placeholder="Ingrese el email del empleado" :error="`${emailError}`" v-model="state.employeeEmail"/>
                    <TextField label="Clave del empleado" type="text" placeholder="Ingrese la clave del empleado" :error="`${passwordError}`" v-model="state.employeePassword"/>

                    <Button buttonType="submit" title="Crear empleado" color="bg-blue-500" :loading="loading"/>
                </form>
            </div>
            <div class="rounded-md bg-white shadow-lg w-1/5 p-4">
                <div class="flex items-center justify-start" v-for="employee in lastestEmployeesList" :key="employee._id">
                    <div class="pl-5">
                        <p>{{ employee.name }}</p>
                    </div>
                </div>
            </div>
        </div>
    </DashboardLayout>
</template>