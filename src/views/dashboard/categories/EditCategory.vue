<script setup lang="ts">
import TextField from '@/components/TextField.vue'
import Button from '@/components/Button.vue'

import { reactive, ref, computed, onMounted } from 'vue'
import InputField from '@/components/InputField.vue'
import { getAllCategories, updateCategory } from '@/api/repositories/category.repository'
import { helpers, required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import { showNotification } from '@/composables/useNotification'
import { lastestCategories, getCategory } from '@/api/repositories/category.repository'
import { useRoute } from 'vue-router'
import ButtonIcon from '@/components/ButtonIcon.vue'
import TrashIcon from '@/components/icons/TrashIcon.vue'
import router from '@/router'
import SelectField from '@/components/SelectField.vue'

const route = useRoute()
const lastestCategoriesList: any = ref([])

const nameError = computed(() => {
  return v$?.value.$errors?.find((item) => item.$property === 'categoryName')?.$message || ''
})

const nameErrorEnglish = computed(() => {
  return v$?.value.$errors?.find((item) => item.$property === 'categoryNameEnglish')?.$message || ''
})

const categoryTypeError = computed(() => {
  return v$?.value.$errors?.find((item) => item.$property === 'categoryType')?.$message || ''
})

const allCategories = ref([])
const showImageInputs = ref(false)
const loading = ref(false)
const image = ref('')

const optionsType = ref([
  { id: 'main', name: 'Principal' },
  { id: 'sub', name: 'Subcategoría' },
  { id: 'final', name: 'Categoría final' }
])
const state = reactive({
  categoryName: '',
  categoryNameEnglish: '',
  categoryType: '',
  categoryParent: ''
})

const rules = {
  categoryName: { required: helpers.withMessage('Este campo no puede estar vacío', required) },
  categoryNameEnglish: {
    required: helpers.withMessage('Este campo no puede estar vacío', required)
  },
  categoryType: { required: helpers.withMessage('Este campo no puede estar vacío', required) }
}

const v$ = useVuelidate(rules, state)

// const awaitTime = () => {
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             resolve(true);
//         }, 1000);
//     });
// }

const submitCategory = async () => {
  const isFormCorrect = await v$.value.$validate()
  if (!isFormCorrect) return

  loading.value = true
  try {
    // if(image.value == ''){
    //     let imagefile:any = document.querySelector('.main');
    //     var mainImage64:any = null

    //     if(imagefile.files.length == 0){
    //         showNotification('Imágen es obligatoria', 'error')
    //         loading.value = false
    //         return
    //     }

    //     const reader = new FileReader();

    //     reader.onload = function() {
    //         const base64String = reader.result;
    //         mainImage64 = base64String
    //     };

    //     reader.readAsDataURL(imagefile.files[0]);

    //     while(mainImage64 == null){
    //         await awaitTime()
    //     }
    // }

    const data = {
      // "oldImage": image.value,
      // "mainImage": mainImage64,
      title: state.categoryName,
      titleEnglish: state.categoryNameEnglish,
      categoryType: state.categoryType,
      categoryParent: state.categoryParent
    }

    const result = await updateCategory(route.params.id.toString(), data)

    await getCategories()
    const response = await getAllCategories()
    allCategories.value = response.data?.categories?.map((item: any) => {
      return {
        id: item._id,
        name: item.name
      }
    })
    loading.value = false

    if (result.status == 'success') {
      showNotification('Categoría actualizada exitosamente', 'success')
      await router.push({ name: 'list-category' })
    }
  } catch (error) {
    loading.value= false
    console.log(error)
    showNotification('Error al actualizar producto', 'error')
  }
}

// const deleteImage = () => {
//     image.value = ''
//     showImageInputs.value = true
// }
const getCategories = async () => {
  const result = await lastestCategories()
  lastestCategoriesList.value = result.data?.categories
}
onMounted(async () => {
  const categoryId = route.params.id.toString()
  const result = await getCategory(categoryId)
  state.categoryName = result.data?.name
  state.categoryNameEnglish = result.data?.englishName
  state.categoryType = result.data?.categoryType
  state.categoryParent = result.data?.parent_id
  image.value = result.data?.image
  getCategories()
  const response = await getAllCategories()
  allCategories.value = response.data?.categories?.map((item: any) => {
    return {
      id: item._id,
      name: item.name
    }
  })
})
</script>

<template>
  <section>
    <div>
      <h1 class="title">Editar categoria</h1>
    </div>
    <div class="flex flex-col xl:flex-row gap-4">
      <div class="card-principal h-fit">
        <form
          class="w-full grid gap-x-10 gap-y-4 grid-cols-2"
          enctype="multipart/form-data"
          @submit.prevent="submitCategory"
        >
          <TextField
            label="Titulo de la categoría"
            type="text"
            placeholder="Ingrese el nombre de la categoría"
            :error="`${nameError}`"
            v-model="state.categoryName"
          />
          <TextField
            label="Titulo de la categoría en inglés"
            type="text"
            placeholder="Ingrese el nombre de la categoría en inglés"
            :error="`${nameErrorEnglish}`"
            v-model="state.categoryNameEnglish"
          />

          <SelectField
            label="Tipo de categoría"
            placeholder="seleccione"
            :options="optionsType"
            v-model="state.categoryType"
            :error="categoryTypeError as string"
          />

          <SelectField
            label="Categoría padre"
            placeholder="seleccione"
            :options="allCategories"
            v-model="state.categoryParent"
          />

          <!-- <div class="flex items-center" v-if="image">
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

                    </div> -->

        <div class="text-end col-span-2">
            <Button
            buttonType="submit"
            title="Actualizar categoría"
            :loading="loading"
          />
        </div>
        </form>
      </div>
      <div class="card-secondary">
        <div class="pb-2 flex items-center border-b mb-4">
          <div class="w-1 mr-2 rounded-lg h-5 bg-gray-300"></div>
          <p
            class="font-semibold text-sm text-default-text"
            v-text="'Últimos agregados'"
          ></p>
        </div>
        <div
        class="flex items-center justify-start bg-gray-100 px-4 pt-2 rounded-lg pb-2 mb-3"
          v-for="category in lastestCategoriesList"
          :key="category.id"
        >
          <!-- <img :src="category?.image" alt="product" class="w-16 h-16 rounded-full" /> -->
          <div class="">
            <p class="text-sm font-semibold mb-0.5 truncate w-36 text-default-text capitalize">{{ category.name }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
