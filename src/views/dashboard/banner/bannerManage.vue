<script setup lang="ts">
import RadioButton from '@/components/RadioButton.vue';
import Button from '@/components/Button.vue';
import InputVideoField from '@/components/InputVideoField.vue';
import InputField from '@/components/InputField.vue';
import { onMounted, ref } from 'vue';
import TextField from '@/components/TextField.vue';
import { manageBanner, getBanner } from '@/api/repositories/banner.repository';
import { showNotification } from '@/composables/useNotification';

const type = ref("image")
const loading = ref(false)
const mainText1 = ref("")
const mainText2 = ref("")
const mainText3 = ref("")

const secondaryText1 = ref("")
const secondaryText2 = ref("")
const secondaryText3 = ref("")

const actualVideo = ref("")
const image1 = ref("")
const image2 = ref("")
const image3 = ref("")

const awaitTime = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 1000)
  })
}

const submitBanner = async() => {

    if(type.value == "video") {

        let videofile: any = document.querySelector('.video-upload')
        let mainVideo64: any = null

        if(!videofile.files.length){
            showNotification('No se ha seleccionado un video', 'error')
            return
        }

        if (videofile.files.length > 0) {
            const reader = new FileReader()

            reader.onload = function () {
                const base64String = reader.result
                mainVideo64 = base64String
            }

            reader.readAsDataURL(videofile.files[0])
        }

        while (mainVideo64 == null) {
            await awaitTime()
        }
        
        const data = {
            "video": mainVideo64,
            "type": type.value
        }

        const response = await manageBanner(data)
        if(response.status == 'success'){
            showNotification('Banner actualizado', 'success')
        }

    }

    else if(type.value == "image"){

        let hasImages = false
        let images64: any = []
        const images: any = Array.from(document.querySelectorAll('.image'))

        if (images) {
            for (let image of images) {
                if (image.files.length > 0) {
                    hasImages = true
                    const readerSecondary = new FileReader()

                    readerSecondary.onload = function () {
                        const base64String = readerSecondary.result

                        images64.push(base64String)
                    }

                    readerSecondary.readAsDataURL(image.files[0])

                }
            }

            if(!hasImages){
                showNotification('No se han seleccionado imágenes', 'error')
                return
            }

            while (images64.length == 0) {
                await awaitTime()
            }
        }

        images64.push(image1.value)
        images64.push(image2.value)
        images64.push(image3.value)

        if(images64.every((image: any) => image == "") || !images64){
            showNotification('No se han seleccionado todas las imágenes', 'error')
            return
        }


        const data = {
            "images": images64,
            "mainText1": mainText1.value,
            "mainText2": mainText2.value,
            "mainText3": mainText3.value,
            "secondaryText1": secondaryText1.value,
            "secondaryText2": secondaryText2.value,
            "secondaryText3": secondaryText3.value,
            "type": type.value
        }

        const response = await manageBanner(data)
        if(response.status == 'success'){
            showNotification('Banner actualizado', 'success')
        }


    }

}

onMounted(async() => {
    
    const response = await getBanner()
    console.log(response)
    
    if(response.status == 'success'){

        if(response.data?.type == "video") {
            type.value = "video"

            actualVideo.value = response.data.video

        }

        else if(response.data?.type == "image") {
            type.value = "image"
            mainText1.value = response.data.mainTexts[0]
            mainText2.value = response.data.mainTexts[1]
            mainText3.value = response.data.mainTexts[2]
            secondaryText1.value = response.data.secondaryTexts[0]
            secondaryText2.value = response.data.secondaryTexts[1]
            secondaryText3.value = response.data.secondaryTexts[2]
            image1.value = response.data.images[0]
            image2.value = response.data.images[1]
            image3.value = response.data.images[2]
        }

    

    }

})

</script>

<template>

    <section>
        <div>
            <h1 class="title">Banner</h1>
        </div>
        <div class="flex gap-4">
            <div class="card-principal">
                <form
                class="w-full gap-x-10 gap-y-4"
                enctype="multipart/form-data"
                @submit.prevent="submitBanner"
                >
                
                    <div class="flex">
                        <RadioButton value="image" v-model="type" label="Imagen"/>
                        <RadioButton value="video" v-model="type" label="Video"/>
                    </div>

                    <div v-if="type === 'video'">
                        <div>
                            <InputVideoField fieldId="video-upload" title="Cargar video" :default-video="actualVideo"/>
                        </div>
                    </div>

                    <div v-if="type === 'image'">
                        <div class="flex">
                            <TextField label="Texto principal 1" type="text" v-model="mainText1"/>
                            <TextField label="Texto secundario 1" type="text" v-model="secondaryText1"/>
                        </div>

                        <div class="flex">
                            <TextField label="Texto principal 2" type="text" v-model="mainText2"/>
                            <TextField label="Texto secundario 2" type="text" v-model="secondaryText2"/>
                        </div>

                        <div class="flex">
                            <TextField label="Texto principal 3" type="text" v-model="mainText3"/>
                            <TextField label="Texto secundario 3" type="text" v-model="secondaryText3"/>
                        </div>

                        <InputField fieldId="image" title="imagen 1" :defaultImage="image1" @changed-image="image1 = ''"/>

                        <InputField fieldId="image" title="imagen 2" :defaultImage="image2" @changed-image="image2 = ''"/>

                        <InputField fieldId="image" title="imagen 3" :defaultImage="image3" @changed-image="image3 = ''"/>
                    </div>

                    <section class="text-end col-span-2 mt-4">
                        <Button buttonType="submit" title="Actualizar banner" class="" :loading="loading" />
                    </section>
                </form>
            </div>

        </div>
  </section>

</template>