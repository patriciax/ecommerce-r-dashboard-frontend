<script setup lang="ts">
    import TextField from '@/components/TextField.vue';
    import Button from '@/components/Button.vue';
    import TextArea from '@/components/TextArea.vue';
    import DashboardLayout from '@/views/DashboardLayout.vue';
    import { reactive, ref, nextTick, computed, onMounted } from 'vue';
    import InputField from '@/components/InputField.vue';
    import { updateSize, lastestSizes, getSize } from '@/api/repositories/size.repository';
    import { helpers, integer, numeric, required } from '@vuelidate/validators';
    import useVuelidate from '@vuelidate/core';
    import {showNotification} from '@/composables/useNotification';
    import { useRoute } from 'vue-router';
    import router from '@/router';

    const route = useRoute()
    const lastestSizesList:any = ref([])

    const nameError = computed(() => {
        return v$?.value.$errors?.find(item => item.$property === 'sizeName')?.$message || ''
    })

    const loading = ref(false)
    const state = reactive({
        sizeName: ''
    });

    const rules = {
        sizeName: { required:helpers.withMessage('Este campo no puede estar vacío', required)}
    }

    const v$ = useVuelidate(rules, state)

    const submitSize = async () =>{

        const isFormCorrect = await v$.value.$validate();
        if (!isFormCorrect) return

        loading.value = true
        try{
            
            const data = {
                "title": state.sizeName,
            }

            await updateSize(route.params.id.toString(), data)
            clearForm()
            await getSizes()
            loading.value = false

            showNotification('Talla actualizada exitosamente', 'success')

            await router.push({name: 'list-size'})

        }catch(error){
            console.log(error)
            showNotification('Error al actualizar talla', 'error')

        }

    }

    const clearForm = () => {

        state.sizeName = ''

        v$?.value.$reset()

    }

    const getSizes = async () => {
        const result = await lastestSizes()
        lastestSizesList.value = result.data?.sizes
    }
    onMounted( async () => {
        const sizeId = route.params.id.toString()
        const result = await getSize(sizeId)
        state.sizeName = result.data?.name
        getSizes()
    })

</script>

<template>
    <DashboardLayout>
        <div>
            <h1>Create product</h1>
        </div>
        <div class="flex gap-4">
            <div class="rounded-md bg-white shadow-lg p-4 w-4/5">
                <form class="w-full" enctype="multipart/form-data" @submit.prevent="submitSize">
                    <TextField label="Titulo de la categoría" type="text" placeholder="Ingrese el nombre de la talla" :error="`${nameError}`" v-model="state.sizeName"/>

                    <Button buttonType="submit" title="Actualizar talla" color="bg-blue-500" :loading="loading"/>
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
    </DashboardLayout>
</template>