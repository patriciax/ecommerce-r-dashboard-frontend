<script setup lang="ts">
    import TextField from '@/components/TextField.vue';
    import Button from '@/components/Button.vue';
    
    import { reactive, ref, computed, onMounted } from 'vue';
    import { createSize, lastestSizes } from '@/api/repositories/size.repository';
    import { helpers, required } from '@vuelidate/validators';
    import useVuelidate from '@vuelidate/core';
    import {showNotification} from '@/composables/useNotification';

    const lastestSizesList:any = ref([])

    const nameError = computed(() => {
        return v$?.value.$errors?.find(item => item.$property === 'sizeName')?.$message || ''
    })

    const nameEnglishError = computed(() => {
        return v$?.value.$errors?.find(item => item.$property === 'sizeNameEnglish')?.$message || ''
    })

    const loading = ref(false)
    const state = reactive({
        sizeName: '',
        sizeNameEnglish: ''
    });

    const rules = {
        sizeName: { required:helpers.withMessage('Este campo no puede estar vacío', required)},
        sizeNameEnglish: { required:helpers.withMessage('Este campo no puede estar vacío', required)}
    }

    const v$ = useVuelidate(rules, state)

    const submitSize = async () =>{

        const isFormCorrect = await v$.value.$validate();
        if (!isFormCorrect) return

        loading.value = true
        try{
            
            const data = {
                "title": state.sizeName,
                "titleEnglish": state.sizeNameEnglish
            }

            await createSize(data)
            clearForm()
            await getSizes()
            loading.value = false

            showNotification('Talla creada exitosamente', 'success')

        }catch(error){
            console.log(error)
            showNotification('Error al crear la tall', 'error')

        }

    }

    const clearForm = () => {

        state.sizeName = ''
        state.sizeNameEnglish = ''
        v$?.value.$reset()

    }

    const getSizes = async () => {
        const result = await lastestSizes()
        lastestSizesList.value = result.data?.sizes
    }

    onMounted( () => { 
        getSizes()
    })

</script>

<template>
   <section>
        <div>
            <h1>Create product</h1>
        </div>
        <div class="flex gap-4">
            <div class="rounded-md bg-white shadow-lg p-4 w-4/5">
                <form class="w-full" enctype="multipart/form-data" @submit.prevent="submitSize">
                    <TextField label="Titulo de la talla" type="text" placeholder="Ingrese el nombre de la talla" :error="`${nameError}`" v-model="state.sizeName"/>
                    <TextField label="Titulo de la talla en inglés" type="text" placeholder="Ingrese el nombre de la talla en inglés" :error="`${nameEnglishError}`" v-model="state.sizeNameEnglish"/>

                    <Button buttonType="submit" title="Crear talla" color="bg-blue-500" :loading="loading"/>
                </form>
            </div>
            <div class="rounded-md bg-white shadow-lg w-1/5 p-4">
                <div class="flex items-center justify-start" v-for="size in lastestSizesList" :key="size._id">
                    <div class="pl-5">
                        <p>{{ size.name }}</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>