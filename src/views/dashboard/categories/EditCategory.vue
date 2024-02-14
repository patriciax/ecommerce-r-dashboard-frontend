<script setup lang="ts">
    import TextField from '@/components/TextField.vue';
    import Button from '@/components/Button.vue';
    import TextArea from '@/components/TextArea.vue';
    
    import { reactive, ref, nextTick, computed, onMounted } from 'vue';
    import InputField from '@/components/InputField.vue';
    import { updateCategory } from '@/api/repositories/category.repository';
    import { helpers, integer, numeric, required } from '@vuelidate/validators';
    import useVuelidate from '@vuelidate/core';
    import {showNotification} from '@/composables/useNotification';
    import {lastestCategories, getCategory} from '@/api/repositories/category.repository';
    import { useRoute } from 'vue-router';
import ButtonIcon from '@/components/ButtonIcon.vue';
import TrashIcon from '@/components/icons/TrashIcon.vue';
import router from '@/router';

    const route = useRoute()
    const lastestCategoriesList:any = ref([])

    const nameError = computed(() => {
        return v$?.value.$errors?.find(item => item.$property === 'categoryName')?.$message || ''
    })

    const showImageInputs = ref(false)
    const loading = ref(false)
    const image = ref("")
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

            if(image.value == ''){
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
            }
            
            const data = {
                "oldImage": image.value,
                "mainImage": mainImage64,
                "title": state.categoryName,
            }

            const result = await updateCategory(route.params.id.toString(), data)

            await getCategories()
            loading.value = false

            if(result.status == 'success'){
                clearForm()
                showNotification('Categoría actualizada exitosamente', 'success')
                await router.push({name: 'list-category'})
            }

        }catch(error){
            console.log(error)
            showNotification('Error al actualizar producto', 'error')

        }

    }

    const clearForm = () => {

        state.categoryName = ''
        v$?.value.$reset()

    }
    const deleteImage = () => {
        image.value = ''
        showImageInputs.value = true
    }
    const getCategories = async () => {
        const result = await lastestCategories()
        lastestCategoriesList.value = result.data?.categories
    }
    onMounted( async () => {
        const categoryId = route.params.id.toString()
        const result = await getCategory(categoryId)
        state.categoryName = result.data?.name
        image.value= result.data?.image
        getCategories()
    })

</script>

<template>
   <section>
        <div>
            <h1>Create product</h1>
        </div>
        <div class="flex gap-4">
            <div class="rounded-md bg-white shadow-lg p-4 w-4/5">
                <form class="w-full" enctype="multipart/form-data" @submit.prevent="submitCategory">
                    <TextField label="Titulo de la categoría" type="text" placeholder="Ingrese el nombre de la categoría" :error="`${nameError}`" v-model="state.categoryName"/>

                    <div class="flex items-center" v-if="image">
                        <img :src="image" alt="product" class="w-32 h-32"/>
                        <ButtonIcon @click="deleteImage" title="Limpiar formulario" color="bg-red-500" size="h-12">
                            <TrashIcon />
                        </ButtonIcon>
                    </div>
                    <div class="flex w-full mb-3" v-if="showImageInputs">
                        <div>
                            <p class="font-bold">Imágen principal</p>
                            <InputField class="w-full" ref="main" fieldId="main"/>
                        </div>

                    </div>

                    <Button buttonType="submit" title="Actualizar categoría" color="bg-blue-500" :loading="loading"/>
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
    </section>
</template>