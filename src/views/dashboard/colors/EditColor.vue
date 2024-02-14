<script setup lang="ts">
    import TextField from '@/components/TextField.vue';
    import Button from '@/components/Button.vue';
    import TextArea from '@/components/TextArea.vue';
    
    import { reactive, ref, nextTick, computed, onMounted } from 'vue';
    import InputField from '@/components/InputField.vue';
    import { updateColor, lastestColors, getColors } from '@/api/repositories/color.repository';
    import { helpers, integer, numeric, required } from '@vuelidate/validators';
    import useVuelidate from '@vuelidate/core';
    import {showNotification} from '@/composables/useNotification';
    import { useRoute } from 'vue-router';
    import router from '@/router';

    const route = useRoute()
    const lastestColorsList:any = ref([])

    const nameError = computed(() => {
        return v$?.value.$errors?.find(item => item.$property === 'colorName')?.$message || ''
    })

    const hexError = computed(() => {
        return v$?.value.$errors?.find(item => item.$property === 'hex')?.$message || ''
    })

    const loading = ref(false)
    const state = reactive({
        colorName: '',
        hex:''
    });

    const rules = {
        colorName: { required:helpers.withMessage('Este campo no puede estar vacío', required)},
        hex: { required:helpers.withMessage('Este campo no puede estar vacío', required)}
    }

    const v$ = useVuelidate(rules, state)

    const submitColor = async () =>{

        const isFormCorrect = await v$.value.$validate();
        if (!isFormCorrect) return

        loading.value = true
        try{
            
            const data = {
                "title": state.colorName,
                "hex": state.hex

            }

            const result = await updateColor(route.params.id.toString(), data)

            if(result.status == 'success'){
                showNotification('Color actualizado exitosamente', 'success')
            }

            clearForm()
            await lastColors()
            loading.value = false

            await router.push({name: 'list-size'})

        }catch(error){
            console.log(error)
            showNotification('Error al actualizar talla', 'error')

        }

    }

    const clearForm = () => {

        state.colorName = ''
        state.hex = ''
        v$?.value.$reset()

    }

    const lastColors = async () => {
        const result = await lastestColors()
        lastestColorsList.value = result.data?.colors
    }
    onMounted( async () => {
        const colorId = route.params.id.toString()
        const result = await getColors(colorId)
        state.colorName = result.data?.name
        state.hex = result.data?.hex
        lastColors()
    })

</script>

<template>
   <section>
        <div>
            <h1>Create product</h1>
        </div>
        <div class="flex gap-4">
            <div class="rounded-md bg-white shadow-lg p-4 w-4/5">
                <form class="w-full" enctype="multipart/form-data" @submit.prevent="submitColor">
                    <TextField label="Titulo del color" type="text" placeholder="Ingrese el nombre del color" :error="`${nameError}`" v-model="state.colorName"/>
                    <TextField label="Color" type="color" :error="`${hexError}`" v-model="state.hex"/>

                    <Button buttonType="submit" title="Actualizar talla" color="bg-blue-500" :loading="loading"/>
                </form>
            </div>
            <div class="rounded-md bg-white shadow-lg w-1/5 p-4">
                <div class="flex items-center justify-start" v-for="color in lastestColorsList" :key="color._id">
                    <div class="pl-5 mr-2">
                        <div class="w-10 h-10 rounded-full" :style="{backgroundColor: color.hex}"></div>
                    </div>
                    <div class="pl-5">
                        <p>{{ color.name }}</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>