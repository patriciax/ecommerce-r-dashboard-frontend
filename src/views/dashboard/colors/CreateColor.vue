<script setup lang="ts">
    import TextField from '@/components/TextField.vue';
    import Button from '@/components/Button.vue';
    import DashboardLayout from '@/views/DashboardLayout.vue';
    import { reactive, ref, computed, onMounted } from 'vue';
    import { createColor, lastestColors } from '@/api/repositories/color.repository';
    import { helpers, integer, numeric, required } from '@vuelidate/validators';
    import useVuelidate from '@vuelidate/core';
    import {showNotification} from '@/composables/useNotification';

    const lastestColorsList:any = ref([])

    const nameError = computed(() => {
        return v$?.value.$errors?.find(item => item.$property === 'colorName')?.$message || ''
    })

    const loading = ref(false)
    const state = reactive({
        colorName: '',
        hexColor:''
    });

    const rules = {
        colorName: { required:helpers.withMessage('Este campo no puede estar vacío', required)},
        hexColor: { required:helpers.withMessage('Este campo no puede estar vacío', required)}
    }

    const v$ = useVuelidate(rules, state)

    const submitColor = async () =>{

        const isFormCorrect = await v$.value.$validate();
        if (!isFormCorrect) return

        loading.value = true
        try{
            
            const data = {
                "title": state.colorName,
                "hexColor": state.hexColor,
            }

            await createColor(data)
            clearForm()
            await getColors()
            loading.value = false

            showNotification('Color creado exitosamente', 'success')

        }catch(error){
            console.log(error)
            showNotification('Error al crear el color', 'error')

        }

    }

    const clearForm = () => {

        state.colorName = ''
        state.hexColor = ''
        v$?.value.$reset()

    }

    const getColors = async () => {
        const result = await lastestColors()
        lastestColorsList.value = result.data?.colors
    }

    onMounted( () => { 
        getColors()
    })

</script>

<template>
    <DashboardLayout>
        <div>
            <h1>Create product</h1>
        </div>
        <div class="flex gap-4">
            <div class="rounded-md bg-white shadow-lg p-4 w-4/5">
                <form class="w-full" enctype="multipart/form-data" @submit.prevent="submitColor">
                    <TextField label="Titulo del color" type="text" placeholder="Ingrese el nombre del color" :error="`${nameError}`" v-model="state.colorName"/>
                    <TextField label="Seleccione el color" type="color" :error="`${nameError}`" v-model="state.hexColor"/>

                    <Button buttonType="submit" title="Crear color" color="bg-blue-500" :loading="loading"/>
                </form>
            </div>
            <div class="rounded-md bg-white shadow-lg w-1/5 p-4">
                <div class="flex items-center justify-start" v-for="color in lastestColorsList" :key="color._id">
                    <div class="pl-5 mr-2">
                        <div class="w-10 h-10 rounded-full" :style="{backgroundColor: color.hex}"></div>
                    </div>
                    <p>{{ color.name }}</p>
                </div>
            </div>
        </div>
    </DashboardLayout>
</template>