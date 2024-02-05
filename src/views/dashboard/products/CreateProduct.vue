<script setup lang="ts">
    import TextField from '@/components/TextField.vue';
    import Button from '@/components/Button.vue';
    import TextArea from '@/components/TextArea.vue';
    import DashboardLayout from '@/views/DashboardLayout.vue';
    import { reactive, ref, nextTick } from 'vue';
    import InputField from '@/components/InputField.vue';
    import { createProduct } from '@/api/repositories/product.repository';

    const productError = ref('');
    const descriptionError = ref('');
    const priceError = ref('');
    const stockError = ref('');

    const state = reactive({
        productName: '',
        description: '',
        price: 0,
        stock: 0,
        mainImage: null,
    });

    const awaitTime = () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 1000);
        });
    }

    const submitProduct = async () =>{

        var images64:any = []
        const formData = new FormData();
        let imagefile:any = document.querySelector('.main');
        var mainImage64:any = null

        const reader = new FileReader();

        reader.onload = function() {
            const base64String = reader.result;
            mainImage64 = base64String
        };

        reader.readAsDataURL(imagefile.files[0]);

        const secondaryImages:any = Array.from(document.querySelectorAll('.secondary'))
        for(let image of secondaryImages){

            const readerSecondary = new FileReader();

            readerSecondary.onload = function() {
                const base64String = readerSecondary.result;

                images64.push(base64String)
            };

            readerSecondary.readAsDataURL(image.files[0]);
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

    }

</script>

<template>
    <DashboardLayout>
        <div>
            <h1>Create product</h1>
        </div>
        <div class="rounded-md w-full bg-white shadow-lg p-4">
            <form enctype="multipart/form-data" @submit.prevent="submitProduct">
                <TextField label="Titulo del producto" type="text" placeholder="Ingrese el nombre del producto" :error="`${productError}`" v-model="state.productName"/>

                <div class="flex w-full gap-4">
                    <TextField class="w-full" :onlyNumber="true" label="Precio del producto" type="text" placeholder="Ingrese el precio del producto" :error="`${priceError}`" v-model="state.price"/>

                    <TextField class="w-full" :onlyNumber="true" label="Stock del producto" type="text" placeholder="Ingrese el stock del producto" :error="`${stockError}`" v-model="state.stock"/>
                </div>

                <div class="flex w-full gap-4">
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

                <TextArea label="Descripción del producto" placeholder="Ingrese la descripción del producto" :error="`${descriptionError}`" v-model="state.description" />

                <Button buttonType="submit" title="Crear producto" color="bg-blue-500" />
            </form>
            
        </div>
    </DashboardLayout>
</template>