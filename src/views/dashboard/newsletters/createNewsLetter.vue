<script setup lang="ts">

    import TextArea from '@/components/TextArea.vue';
    import TextField from '@/components/TextField.vue';
    import { showNotification } from '@/composables/useNotification';
    import Button from '@/components/Button.vue';
    import useVuelidate from '@vuelidate/core';
    import {createNewsletter, listNewsletters} from '@/api/repositories/newsletter.repository';
    import { helpers, required } from '@vuelidate/validators';
    import { computed, reactive, ref, nextTick, onMounted } from 'vue';

    const showField = ref(true)
    const newsletters:any = ref([])
    const loading = ref(false)
    const state = reactive({
        description: '',
        title:''
    });

    const titleError = computed(() => {
        return v$?.value.$errors?.find(item => item.$property === 'title')?.$message || ''
    })

    const descriptionError = computed(() => {
        return v$?.value.$errors?.find(item => item.$property === 'description')?.$message || ''
    })

    const rules = {
        description: { required:helpers.withMessage('Este campo no puede estar vacío', required) },
        title: { required:helpers.withMessage('Este campo no puede estar vacío', required) }
    }

    const v$ = useVuelidate(rules, state)

    const saveNewsletter = async () => {

        const isFormCorrect = await v$.value.$validate();
        if (!isFormCorrect) return
        
        try{
            loading.value = true
            await createNewsletter(state)

            showNotification('Newsletter creada', 'success')
            showField.value = false
            nextTick(() => {
                showField.value = true
            })

            state.description = ''
            state.title = ''

            v$?.value.$reset()

            loading.value = false

            await getNewsletters()

        }catch(error){
            
            loading.value = false
            showNotification('Error al crear el newsletter', 'error')
        }

    }

    const getNewsletters = async () => {
        const response = await listNewsletters()
        newsletters.value = response.data?.newsletters
    }

    onMounted(async () => {
        getNewsletters()
    })

</script>

<template>
    <div class="flex">
        <form @submit.prevent="saveNewsletter">
            <h1 class="text-2xl font-bold mb-4">Crear Newsletter</h1>
            <TextField label="Titulo del newsletter" type="text" placeholder="Ingrese el nombre del newsletter" v-model="state.title" :error="`${titleError}`"/>
            <TextArea
                v-if="showField"
                label="Descripción del producto"
                placeholder="Ingrese la descripción del producto"
                :error="`${descriptionError}`"
                v-model="state.description"
                />
            <Button
                buttonType="submit"
                title="Enviar newsletter"
                color="bg-blue-500"
                :loading="loading"
            />
        </form>
        <div class="rounded-md bg-white shadow-lg w-1/5 p-4">
            <div class="flex items-center justify-start" v-for="newsletter in newsletters" :key="newsletter._id">
                <div class="pl-5">
                    <p class="text-black">{{ newsletter.title }}</p>
                </div>
            </div>
        </div>
    </div>
</template>