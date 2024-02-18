<script setup lang="ts">
    import TextField from '@/components/TextField.vue';
    import Button from '@/components/Button.vue';
    
    import { reactive, ref, computed, onMounted } from 'vue';
    import { createGiftCard, lastestGiftCards } from '@/api/repositories/giftCard.repository';
    import { helpers, minValue, numeric, required } from '@vuelidate/validators';
    import useVuelidate from '@vuelidate/core';
    import {showNotification} from '@/composables/useNotification';

    const lastestGiftCardsList:any = ref([])

    const nameError = computed(() => {
        return v$?.value.$errors?.find(item => item.$property === 'giftCardName')?.$message || ''
    })

    const nameErrorEnglish = computed(() => {
        return v$?.value.$errors?.find(item => item.$property === 'giftCardNameEnglish')?.$message || ''
    })

    const amountError = computed(() => {
        return v$?.value.$errors?.find(item => item.$property === 'amount')?.$message || ''
    })

    const loading = ref(false)

    const state = reactive({
        giftCardName: '',
        giftCardNameEnglish:'',
        amount: 0
    });

    const rules = {
        giftCardName: { required:helpers.withMessage('Este campo no puede estar vacío', required)},
        giftCardNameEnglish: { required:helpers.withMessage('Este campo no puede estar vacío', required)},
        amount: { required:helpers.withMessage('Este campo no puede estar vacío', required), numeric:helpers.withMessage('Este campo debe ser numérico', numeric), minValue:helpers.withMessage('El valor mínimo es 1', minValue(1))}
    }

    const v$ = useVuelidate(rules, state)

    const submitGiftCard = async () =>{

        const isFormCorrect = await v$.value.$validate();
        if (!isFormCorrect) return

        
        try{
            
            const data = {
                "title": state.giftCardName,
                "titleEnglish": state.giftCardNameEnglish,
                "amount": state.amount,
            }

            const result = await createGiftCard(data)

            if(result.status == 'success'){
                showNotification('Gift card creada exitosamente', 'success')
            }

            await getLastCategories()

            clearForm()
            loading.value = false

        }catch(error){
            console.log(error)
            showNotification('Error al crear gift card', 'error')

        }

    }

    const clearForm = () => {

        state.giftCardName = ''
        state.giftCardNameEnglish = ''
        state.amount = 0

        v$?.value.$reset()

    }

    const getLastCategories = async () => {
        const result = await lastestGiftCards()
        lastestGiftCardsList.value = result.data?.giftCards
    }

    onMounted( async() => { 
        getLastCategories()
    })

</script>

<template>
   <section>
        <div>
            <h1>Create product</h1>
        </div>
        <div class="flex gap-4">
            <div class="rounded-md bg-white shadow-lg p-4 w-4/5">
                <form class="w-full" enctype="multipart/form-data" @submit.prevent="submitGiftCard">
                    <TextField label="Titulo del gift card" type="text" placeholder="Ingrese el nombre del Gift card" :error="`${nameError}`" v-model="state.giftCardName"/>
                    <TextField label="Titulo del gift card en inglés" type="text" placeholder="Ingrese el nombre del gift card en inglés" :error="`${nameErrorEnglish}`" v-model="state.giftCardNameEnglish"/>
                    <TextField label="Precio" type="text" :onlyNumber="true" placeholder="Ingrese el precio" :error="`${amountError}`" v-model="state.amount"/>
                    

                    <Button buttonType="submit" title="Crear gift card" color="bg-blue-500" :loading="loading"/>
                </form>
            </div>
            <div class="rounded-md bg-white shadow-lg w-1/5 p-4">
                <div class="flex items-center justify-start" v-for="category in lastestGiftCardsList" :key="category.id">
                    <div class="pl-5">
                        <p>{{ category.name }}</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>