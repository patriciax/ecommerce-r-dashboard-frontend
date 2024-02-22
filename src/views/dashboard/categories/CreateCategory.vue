<script setup lang="ts">
import TextField from '@/components/TextField.vue'
import Button from '@/components/Button.vue'
import TextArea from '@/components/TextArea.vue'

import { reactive, ref, nextTick, computed, onMounted } from 'vue'
import InputField from '@/components/InputField.vue'
import { createCategory, getAllCategories } from '@/api/repositories/category.repository'
import { helpers, integer, numeric, required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import { showNotification } from '@/composables/useNotification'
import { lastestCategories } from '@/api/repositories/category.repository'
import SelectField from '@/components/SelectField.vue'

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

const showImageInputs = ref(true)
const loading = ref(false)

const allCategories = ref([])
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

  try {
    // var images64:any = []
    // let imagefile:any = document.querySelector('.main');
    // var mainImage64:any = null

    // if(imagefile.files.length == 0){
    //     showNotification('Imágen es obligatoria', 'error')
    //     return
    // }

    // loading.value = true

    // const reader = new FileReader();

    // reader.onload = function() {
    //     const base64String = reader.result;
    //     mainImage64 = base64String
    // };

    // reader.readAsDataURL(imagefile.files[0]);

    // while(mainImage64 == null){
    //     await awaitTime()
    // }

    const data = {
      //"mainImage": mainImage64,
      title: state.categoryName,
      titleEnglish: state.categoryNameEnglish,
      categoryType: state.categoryType,
      categoryParent: state.categoryParent
    }

    const result = await createCategory(data)

    if (result.status == 'success') {
      showNotification('Categoría creada exitosamente', 'success')
    }

    await getCategories()
    const response = await getAllCategories()
    allCategories.value = response.data?.categories?.map((item: any) => {
      return {
        id: item._id,
        name: item.name
      }
    })
    clearForm()
    loading.value = false
  } catch (error) {
    console.log(error)
    showNotification('Error al crear la categoría', 'error')
  }
}

const clearForm = () => {
  state.categoryName = ''
  state.categoryNameEnglish = ''
  state.categoryParent = ''
  state.categoryType = ''

  showImageInputs.value = false
  nextTick(() => {
    showImageInputs.value = true
  })

  v$?.value.$reset()
}

const getCategories = async () => {
  const result = await lastestCategories()
  lastestCategoriesList.value = result.data?.categories
}

onMounted(async () => {
  const response = await getAllCategories()
  allCategories.value = response.data?.categories?.map((item: any) => {
    return {
      id: item._id,
      name: item.name
    }
  })
  getCategories()
})
</script>

<template>
  <section>
    <div>
      <h1 class="title">Crear Categoria</h1>
    </div>
    <div class="flex flex-col xl:flex-row gap-4">
      <div class="card h-fit xl:w-3/4 2xl:w-4/5">
        <form class="w-full" enctype="multipart/form-data" @submit.prevent="submitCategory">
          <div class="grid lg:grid-cols-2 gap-x-10 gap-y-4">
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
              :error="categoryTypeError"
            />

            <SelectField
              label="Categoría padre"
              placeholder="seleccione"
              :options="allCategories"
              v-model="state.categoryParent"
            />
          </div>
          <!-- <div class="flex w-full mb-3" v-if="showImageInputs">
                        <div>
                            <p class="font-bold">Imágen principal</p>
                            <InputField class="w-full" ref="main" fieldId="main"/>
                        </div>

                    </div> -->
          <section class="text-end mt-20">
            <Button buttonType="submit" title="Crear categoría +" :loading="loading" />
          </section>
        </form>
      </div>
      <div class="rounded-md bg-white shadow-lg card h-fit xl:w-1/4 2xl:w-1/5 p-44">
        <div class="pb-2 flex items-center border-b mb-4">
          <div class="w-1 mr-2 rounded-lg h-5 bg-green-300"></div>
          <p class="font-semibold text-sm text-default-text" v-text="'Últimos agregados'"></p>
        </div>
        <div
          class="flex items-center justify-start bg-gray-100 px-4 pt-2 rounded-lg pb-2 mb-3"
          v-for="category in lastestCategoriesList"
          :key="category.id"
        >
          <!-- <img :src="category?.image" alt="product" class="w-14 h-16 rounded-full" /> -->
          <div class="">
            <p class="text-sm font-semibold mb-0.5 truncate w-42 text-default-text capitalize">
              {{ category.name }}
            </p>
          </div>
        </div>
        <section class="flex justify-center my-2 mt-4 pt-4 border-t">
          <RouterLink to="/dashboard/category/list">
            <Button buttonType="submit" title="Ver todas las categorías" :loading="loading" />
          </RouterLink>
        </section>
      </div>
    </div>
  </section>
</template>
