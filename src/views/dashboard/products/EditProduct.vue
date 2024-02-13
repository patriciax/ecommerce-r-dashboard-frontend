<script setup lang="ts">
    import TextField from '@/components/TextField.vue';
    import Button from '@/components/Button.vue';
    import TextArea from '@/components/TextArea.vue';
    import DashboardLayout from '@/views/DashboardLayout.vue';
    import { reactive, ref, nextTick, computed, onMounted } from 'vue';
    import InputField from '@/components/InputField.vue';
    import { createProduct, getProduct } from '@/api/repositories/product.repository';
    import { helpers, integer, numeric, required } from '@vuelidate/validators';
    import useVuelidate from '@vuelidate/core';
    import {showNotification} from '@/composables/useNotification';
    import {lastestProducts} from '@/api/repositories/product.repository';
    import {allSizes} from '@/api/repositories/product.repository';
    import {allColors} from '@/api/repositories/product.repository';
    import {allCategories} from '@/api/repositories/product.repository';
    import SelectField from '@/components/SelectField.vue';
    import MultipleSelectField from '@/components/MultipleSelectField.vue';
    import {useRoute} from 'vue-router';

    const route = useRoute()
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
    const sizes = ref([])
    const colors = ref([])
    const categories = ref([])
    const defaultColors = ref([])
    const defaultSizes = ref([])
    const state = reactive({
        colors:[],
        sizes:[],
        category: '',
        productName: '',
        description: '',
        price: null,
        stock: null
    });

    const changeColors = (value:any) => {
        state.colors = value
    }

    const changeSizes = (value:any) => {
        state.sizes = value
    }

    const rules = {
        productName: { required:helpers.withMessage('Este campo no puede estar vacío', required)},
        description: { required:helpers.withMessage('Este campo no puede estar vacío', required) },
        price: { required:helpers.withMessage('Este campo no puede estar vacío', required), numeric:helpers.withMessage('Solo se permiten números', numeric) },
        stock: { required:helpers.withMessage('Este campo no puede estar vacío', required), integer:helpers.withMessage('Solo se permiten números', integer) },
        colors: { required:helpers.withMessage('Este campo no puede estar vacío', required) },
        category: { required:helpers.withMessage('Este campo no puede estar vacío', required) },
        sizes: { required:helpers.withMessage('Este campo no puede estar vacío', required) }
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
                "colors": state.colors,
                "sizes": state.sizes,
                "category": state.category,
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
        state.colors = []
        state.sizes = []
        state.category = ''

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

    const getAllSizes = async () => {
        const response = await allSizes()
        sizes.value = response.data?.sizes.map((size:any) => {
            return {
                id: size._id,
                name: size.name
            }
        })
    }

    const getAllColors = async () => {
        const response = await allColors()
        colors.value = response.data?.colors.map((color:any) => {
            return {
                id: color._id,
                name: color.name
            }
        })
    }

    const getAllCategories = async () => {
        const response = await allCategories()
        categories.value = response.data?.categories.map((category:any) => {
            return {
                id: category._id,
                name: category.name
            }
        })
    }

    const loadProduct = async (productId:string) => {
        const result = await getProduct(productId)
        state.productName = result.data?.name
        state.description = result.data?.description
        state.price = result.data?.price
        state.stock = result.data?.stock
        state.colors = result.data?.colors
        state.sizes = result.data?.sizes
        state.category = result.data?.category

        defaultColors.value = result.data?.colors
        defaultSizes.value = result.data?.sizes
    }

    onMounted( () => { 

        const productId = route.params.id.toString()

        getProducts()
        getAllSizes()
        getAllColors()
        getAllCategories()
        loadProduct(productId)
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

                    <div class="flex w-full gap-4">
                        <SelectField label="Categorías" placeholder="Seleccione una categoría" :options="categories"
                        v-model="state.category"
                        />
                    </div>
                    <div class="flex w-full gap-4">
                        <MultipleSelectField @changeValue="changeColors" label="Colores" placeholder="Seleccione uno o varios colors" :options="colors"
                        v-model="state.colors"
                        :defaultValues="defaultColors"
                        />
                        <MultipleSelectField @changeValue="changeSizes" label="Tallas" placeholder="Seleccione uno o varias tallas" :options="sizes"
                        v-model="state.sizes"
                        :defaultValues="defaultSizes"
                        />
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