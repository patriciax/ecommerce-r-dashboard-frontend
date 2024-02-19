<script setup lang="ts">
    import TextField from '@/components/TextField.vue';
    import Button from '@/components/Button.vue';
    
    import { reactive, ref, computed, onMounted } from 'vue';
    import { getEmployee, lastestEmployees, updateEmployee } from '@/api/repositories/user.repository';
    import { helpers, minLength, required, email, alphaNum } from '@vuelidate/validators';
    import useVuelidate from '@vuelidate/core';
    import {showNotification} from '@/composables/useNotification';
    import { useRoute, useRouter } from 'vue-router';

    const router = useRouter()
    const route = useRoute()
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
        employeePassword: { minLength:helpers.withMessage('La contraseña debe tener al menos 6 caracteres', minLength(6))}
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

            const result = await updateEmployee(route.params.id.toString(), data)

            if(result.status == 'success'){
                showNotification('Empleado actualizado exitosamente', 'success')
            }

            loading.value = false

            await router.push({name: 'list-employee'})

        }catch(error){
            console.log(error)
            showNotification('Error al actualizar empleado', 'error')

        }

    }

    const getLastEmployees = async () => {
        const result = await lastestEmployees()
        lastestEmployeesList.value = result.data?.users
    }

    const loadData = async() => {
        const result = await getEmployee(route.params.id.toString())
        if(result.status == 'success'){
            state.employeeName = result.data?.name
            state.employeeEmail = result.data?.email
        }
    }

    onMounted( () => { 
        getLastEmployees()
        loadData()
    })

</script>

<template>
   <section>
        <div>
            <h1>Create product</h1>
        </div>
        <div class="flex gap-4">
            <div class="rounded-md bg-white shadow-lg p-4 w-4/5">
                <form class="w-full" enctype="multipart/form-data" @submit.prevent="submitEmployee">
                    <TextField label="Nombre del empleado" type="text" placeholder="Ingrese el nombre del empleado" :error="`${nameError}`" v-model="state.employeeName"/>
                    <TextField :disabled="true" label="Email del empleado" type="text" placeholder="Ingrese el email del empleado" :error="`${emailError}`" v-model="state.employeeEmail"/>
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
    </section>
</template>