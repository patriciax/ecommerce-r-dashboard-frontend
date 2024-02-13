<script setup lang="ts">
    import TextField from '@/components/TextField.vue';
    import Button from '@/components/Button.vue';
    import TextArea from '@/components/TextArea.vue';
    import DashboardLayout from '@/views/DashboardLayout.vue';
    import { reactive, ref, nextTick, computed, onMounted } from 'vue';
    import InputField from '@/components/InputField.vue';
    import { createCategory } from '@/api/repositories/category.repository';
    import { helpers, integer, numeric, required } from '@vuelidate/validators';
    import useVuelidate from '@vuelidate/core';
    import {showNotification} from '@/composables/useNotification';
    import {lastestCategories} from '@/api/repositories/category.repository';

    const lastestCategoriesList:any = ref([])

    const nameError = computed(() => {
        return v$?.value.$errors?.find(item => item.$property === 'categoryName')?.$message || ''
    })

    const showImageInputs = ref(true)
    const loading = ref(false)
    const state = reactive({
        categoryName: ''
    });

    const rules = {
        categoryName: { required:helpers.withMessage('Este campo no puede estar vacío', required)}
    }

    const v$ = useVuelidate(rules, state)

    const awaitTime = () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 1000);
        });
    }

    const submitCategory = async () =>{

        const isFormCorrect = await v$.value.$validate();
        if (!isFormCorrect) return

        loading.value = true
        try{

            var images64:any = []
            let imagefile:any = document.querySelector('.main');
            var mainImage64:any = null

            if(imagefile.files.length == 0){
                showNotification('Imágen es obligatoria', 'error')
                return
            }

            const reader = new FileReader();

            reader.onload = function() {
                const base64String = reader.result;
                mainImage64 = base64String
            };

            reader.readAsDataURL(imagefile.files[0]);

            while(mainImage64 == null){
                await awaitTime()
            }
            
            const data = {
                "mainImage": mainImage64,
                "title": state.categoryName,
            }

            const result = await createCategory(data)

            if(result.status == 'success'){
                showNotification('Categoría creada exitosamente', 'success')
            }

            clearForm()
            await getCategories()
            loading.value = false

        }catch(error){
            console.log(error)
            showNotification('Error al crear la categoría', 'error')

        }

    }

    const clearForm = () => {

        state.categoryName = ''

        showImageInputs.value = false
        nextTick(() => {
            showImageInputs.value = true
        })

        v$?.value.$reset()

    }

    const getCategories = async () => {
        const result = await lastestCategories()
        lastestCategoriesList.value = result.data?.categories
    }

    onMounted( () => { 
        getCategories()
    })

</script>

<template>
    <DashboardLayout>
        <div>
            <h1>Create product</h1>
        </div>
        <div class="flex gap-4">
            <div class="rounded-md bg-white shadow-lg p-4 w-4/5">
                <form class="w-full" enctype="multipart/form-data" @submit.prevent="submitCategory">
                    <TextField label="Titulo de la categoría" type="text" placeholder="Ingrese el nombre de la categoría" :error="`${nameError}`" v-model="state.categoryName"/>

                    <div class="flex w-full mb-3" v-if="showImageInputs">
                        <div>
                            <p class="font-bold">Imágen principal</p>
                            <InputField class="w-full" ref="main" fieldId="main"/>
                        </div>

                    </div>

                    <Button buttonType="submit" title="Crear categoría" color="bg-blue-500" :loading="loading"/>
                </form>
            </div>
            <div class="rounded-md bg-white shadow-lg w-1/5 p-4">
                <div class="flex items-center justify-start" v-for="category in lastestCategoriesList" :key="category.id">
                    <img :src="category?.image" alt="product" class="w-16 h-16 rounded-full"/>
                    <div class="pl-5">
                        <p>{{ category.name }}</p>
                    </div>
                </div>
            </div>
        </div>
    </DashboardLayout>
</template>