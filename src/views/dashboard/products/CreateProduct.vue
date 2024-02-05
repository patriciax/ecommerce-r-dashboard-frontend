<script setup lang="ts">
    import TextField from '@/components/TextField.vue';
    import Button from '@/components/Button.vue';
    import TextArea from '@/components/TextArea.vue';
    import DashboardLayout from '@/views/DashboardLayout.vue';
    import { reactive, ref, nextTick, computed, onMounted } from 'vue';
    import InputField from '@/components/InputField.vue';
    import { createProduct } from '@/api/repositories/product.repository';
    import { helpers, integer, numeric, required } from '@vuelidate/validators';
    import useVuelidate from '@vuelidate/core';
    import {showNotification} from '@/composables/useNotification';
    import {lastestProducts} from '@/api/repositories/product.repository';

    const lastestProductsList:any = ref([])

    const productError = computed(() => {
        return v$?.value.$errors?.find(item => item.$property === 'productName')?.$message || ''
    })

    const descriptionError = computed(() => {
        return v$?.value.$errors?.find(item => item.$property === 'description')?.$message || ''
    })

    const priceError = computed(() => {
        return v$?.value.$errors?.find(item => item.$property === 'price')?.$message || ''
    })

    const stockError = computed(() => {
        return v$?.value.$errors?.find(item => item.$property === 'stock')?.$message || ''
    })

    const showImageInputs = ref(true)
    const loading = ref(false)
    const state = reactive({
        productName: '',
        description: '',
        price: null,
        stock: null
    });

    const rules = {
        productName: { required:helpers.withMessage('Este campo no puede estar vacío', required)},
        description: { required:helpers.withMessage('Este campo no puede estar vacío', required) },
        price: { required:helpers.withMessage('Este campo no puede estar vacío', required), numeric:helpers.withMessage('Solo se permiten números', numeric) },
        stock: { required:helpers.withMessage('Este campo no puede estar vacío', required), integer:helpers.withMessage('Solo se permiten números', integer) }
    }

    const v$ = useVuelidate(rules, state)

    const awaitTime = () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 1000);
        });
    }

    const submitProduct = async () =>{

        const isFormCorrect = await v$.value.$validate();
        if (!isFormCorrect) return

        loading.value = true
        try{

            var images64:any = []
            const formData = new FormData();
            let imagefile:any = document.querySelector('.main');
            var mainImage64:any = null

            if(imagefile.files.length == 0){
                showNotification('Imágen principal es obligatoria', 'error')
                return
            }

            const reader = new FileReader();

            reader.onload = function() {
                const base64String = reader.result;
                mainImage64 = base64String
            };

            reader.readAsDataURL(imagefile.files[0]);

            const secondaryImages:any = Array.from(document.querySelectorAll('.secondary'))
            for(let image of secondaryImages){

                if(image.files.length > 0){
                    const readerSecondary = new FileReader();

                    readerSecondary.onload = function() {
                        const base64String = readerSecondary.result;

                        images64.push(base64String)
                    };

                    readerSecondary.readAsDataURL(image.files[0]);
                }
                
            }

            while(mainImage64 == null && images64.length == 0){
                await awaitTime()
            }
            
            const data = {
                "mainImage": mainImage64,
                "images": images64,
                "title": state.productName,
                "price": state.price,
                "stock": state.stock,
                "description": state.description
            }

            await createProduct(data)
            clearForm()
            await getProducts()
            loading.value = false

            showNotification('Producto creado exitosamente', 'success')

        }catch(error){
            console.log(error)
            showNotification('Error al crear el producto', 'error')

        }

    }

    const clearForm = () => {

        state.productName = ''
        state.description = ''
        state.price = null
        state.stock = null

        showImageInputs.value = false
        nextTick(() => {
            showImageInputs.value = true
        })

        v$?.value.$reset()

    }

    const getProducts = async () => {
        const result = await lastestProducts()
        lastestProductsList.value = result.data?.products
    }

    onMounted( () => { 
        getProducts()
    })

</script>

<template>
    <DashboardLayout>
        <div>
            <h1>Create product</h1>
        </div>
        <div class="flex gap-4">
            <div class="rounded-md bg-white shadow-lg p-4 w-4/5">
                <form class="w-full" enctype="multipart/form-data" @submit.prevent="submitProduct">
                    <TextField label="Titulo del producto" type="text" placeholder="Ingrese el nombre del producto" :error="`${productError}`" v-model="state.productName"/>

                    <div class="flex w-full gap-4">
                        <TextField class="w-full" :onlyNumber="true" label="Precio del producto" type="text" placeholder="Ingrese el precio del producto" :error="`${priceError}`" v-model="state.price"/>

                        <TextField class="w-full" :onlyNumber="true" label="Stock del producto" type="text" placeholder="Ingrese el stock del producto" :error="`${stockError}`" v-model="state.stock"/>
                    </div>

                    <div class="flex w-full gap-4" v-if="showImageInputs">
                        <div>
                            <p class="font-bold">Imágen principal</p>
                            <InputField class="w-full" ref="main" fieldId="main"/>
                        </div>
                        <div>
                            <p class="font-bold">Imágenes secundarias</p>
                            <div class="flex">
                                <InputField class="w-full" ref="main" fieldId="secondary"/>
                                <InputField class="w-full" ref="main" fieldId="secondary"/>
                                <InputField class="w-full" ref="main" fieldId="secondary"/>
                            </div>
                        </div>


                    </div>

                    <TextArea v-if="showImageInputs" label="Descripción del producto" placeholder="Ingrese la descripción del producto" :error="`${descriptionError}`" v-model="state.description" />

                    <Button buttonType="submit" title="Crear producto" color="bg-blue-500" :loading="loading"/>
                </form>
            </div>
            <div class="rounded-md bg-white shadow-lg w-1/5 p-4">
                <div class="flex items-center justify-start" v-for="latestProduct in lastestProductsList" :key="latestProduct.id">
                    <img :src="latestProduct?.mainImage" alt="product" class="w-16 h-16 rounded-full"/>
                    <div class="pl-5">
                        <p>{{ latestProduct.name }}</p>
                        <p>Precio: {{ latestProduct.price }}</p>
                    </div>
                </div>
            </div>
        </div>
    </DashboardLayout>
</template>