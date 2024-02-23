<script setup lang="ts">
import TextField from '@/components/TextField.vue'
import Button from '@/components/Button.vue'

import { reactive, ref, computed, onMounted } from 'vue'
import { createColor, lastestColors } from '@/api/repositories/color.repository'
import { helpers, integer, numeric, required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import { showNotification } from '@/composables/useNotification'

const lastestColorsList: any = ref([])

const nameError = computed(() => {
  return v$?.value.$errors?.find((item) => item.$property === 'colorName')?.$message || ''
})

const nameErrorEnglish = computed(() => {
  return v$?.value.$errors?.find((item) => item.$property === 'colorNameEnglish')?.$message || ''
})

const hexError = computed(() => {
  return v$?.value.$errors?.find((item) => item.$property === 'hexColor')?.$message || ''
})

const loading = ref(false)
const state = reactive({
  colorName: '',
  colorNameEnglish: '',
  hexColor: ''
})

const rules = {
  colorName: { required: helpers.withMessage('Este campo no puede estar vacío', required) },
  hexColor: { required: helpers.withMessage('Este campo no puede estar vacío', required) },
  colorNameEnglish: { required: helpers.withMessage('Este campo no puede estar vacío', required) }
}

const v$ = useVuelidate(rules, state)

const submitColor = async () => {
  const isFormCorrect = await v$.value.$validate()
  if (!isFormCorrect) return

  loading.value = true
  try {
    const data = {
      title: state.colorName,
      titleEnglish: state.colorNameEnglish,
      hexColor: state.hexColor
    }

    const result = await createColor(data)

    if (result.status == 'success') {
      showNotification('Color creado exitosamente', 'success')
    }

    clearForm()
    await getColors()
    loading.value = false
  } catch (error) {
    console.log(error)
    showNotification('Error al crear el color', 'error')
  }
}

const clearForm = () => {
  state.colorName = ''
  state.colorNameEnglish = ''
  state.hexColor = ''
  v$?.value.$reset()
}

const getColors = async () => {
  const result = await lastestColors()
  lastestColorsList.value = result.data?.colors
}

onMounted(() => {
  getColors()
})
</script>

<template>
  <section>
    <div>
      <h1 class="title">Crear Color</h1>
    </div>
    <div class="flex flex-col xl:flex-row gap-4">
      <div class="card-principal">
        <form
          class="w-full grid xl:grid-cols-2 gap-x-10 gap-y-4"
          enctype="multipart/form-data"
          @submit.prevent="submitColor"
        >
          <TextField
            label="Titulo del color"
            type="text"
            placeholder="Ingrese el nombre del color"
            :error="`${nameError}`"
            v-model="state.colorName"
          />
          <TextField
            label="Titulo del color en ingles"
            type="text"
            placeholder="Ingrese el nombre del color en inglés"
            :error="`${nameErrorEnglish}`"
            v-model="state.colorNameEnglish"
          />
          <TextField
          class=""
            label="Seleccione el color"
            type="color"
            :error="`${hexError}`"
            v-model="state.hexColor"
          />
          <section class="text-end col-span-2 mt-4">
            <Button buttonType="submit" title="Crear color +" class="" :loading="loading" />
          </section>
        </form>
      </div>
      <div class="card-secondary">
        <div class="pb-2 flex items-center border-b mb-4">
          <div class="w-1 mr-2 rounded-lg h-5 bg-yellow-300"></div>
          <p
            class="font-semibold text-sm text-default-text"
            v-text="'Últimos agregados'"
          ></p>
        </div>
        <div
        class="flex items-center justify-start bg-gray-100 px-4 pt-2 rounded-lg pb-2 mb-3"
          v-for="color in lastestColorsList"
          :key="color._id"
        >
          <div class=" mr-2">
            <div class="w-10 h-10 rounded-full" :style="{ backgroundColor: color.hex }"></div>
          </div>
          <p class="text-sm font-semibold mb-0.5 truncate w-36 text-default-text capitalize">{{ color.name }}</p>
        </div>
        <section class="flex justify-center my-2 mt-4 pt-4 border-t">
          <RouterLink to="/dashboard/size/list">
            <Button buttonType="button" title="Ver todos los colores" />
          </RouterLink>
        </section>

      </div>
    </div>
  </section>
</template>
