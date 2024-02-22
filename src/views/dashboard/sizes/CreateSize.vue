<script setup lang="ts">
import TextField from '@/components/TextField.vue'
import Button from '@/components/Button.vue'

import { reactive, ref, computed, onMounted } from 'vue'
import { createSize, lastestSizes } from '@/api/repositories/size.repository'
import { helpers, required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import { showNotification } from '@/composables/useNotification'

const lastestSizesList: any = ref([])

const nameError = computed(() => {
  return v$?.value.$errors?.find((item) => item.$property === 'sizeName')?.$message || ''
})

const nameEnglishError = computed(() => {
  return v$?.value.$errors?.find((item) => item.$property === 'sizeNameEnglish')?.$message || ''
})

const loading = ref(false)
const state = reactive({
  sizeName: '',
  sizeNameEnglish: ''
})

const rules = {
  sizeName: { required: helpers.withMessage('Este campo no puede estar vacío', required) },
  sizeNameEnglish: { required: helpers.withMessage('Este campo no puede estar vacío', required) }
}

const v$ = useVuelidate(rules, state)

const submitSize = async () => {
  const isFormCorrect = await v$.value.$validate()
  if (!isFormCorrect) return

  loading.value = true
  try {
    const data = {
      title: state.sizeName,
      titleEnglish: state.sizeNameEnglish
    }

    await createSize(data)
    clearForm()
    await getSizes()
    loading.value = false

    showNotification('Talla creada exitosamente', 'success')
  } catch (error) {
    console.log(error)
    showNotification('Error al crear la tall', 'error')
  }
}

const clearForm = () => {
  state.sizeName = ''
  state.sizeNameEnglish = ''
  v$?.value.$reset()
}

const getSizes = async () => {
  const result = await lastestSizes()
  lastestSizesList.value = result.data?.sizes
}

onMounted(() => {
  getSizes()
})
</script>

<template>
  <section class="bg-background-layout">
    <div>
      <h1 class="title">Crear Tallas</h1>
    </div>
    <div class="flex flex-col xl:flex-row gap-4">
      <div class="card-principal h-fit">
        <form class="w-full grid gap-4" enctype="multipart/form-data" @submit.prevent="submitSize">
          <TextField
            label="Titulo de la talla"
            type="text"
            placeholder="Ingrese el nombre de la talla"
            :error="`${nameError}`"
            v-model="state.sizeName"
          />
          <TextField
            label="Titulo de la talla en inglés"
            type="text"
            placeholder="Ingrese el nombre de la talla en inglés"
            :error="`${nameEnglishError}`"
            v-model="state.sizeNameEnglish"
          />

          <section class="text-end mt-4">
            <Button buttonType="submit" title="Crear talla +" :loading="loading" />
          </section>
        </form>
      </div>
      <div class="card-secondary">
        <div class="pb-2 flex items-center border-b mb-4">
          <div class="w-1 mr-2 rounded-lg h-5 bg-blue-600"></div>
          <p class="font-semibold text-sm text-default-text" v-text="'Últimos agregados'"></p>
        </div>
        <div
          class="flex items-center justify-start bg-gray-100 px-4 pt-2 rounded-lg pb-2 mb-3"
          v-for="size in lastestSizesList"
          :key="size._id"
        >
          <div class="text-sm font-semibold mb-0.5 truncate w-36 text-default-text capitalize">
            <p>{{ size.name }}</p>
          </div>
        </div>

        <section class="flex justify-center my-2 mt-4 pt-4 border-t">
          <RouterLink to="/dashboard/size/list">
            <Button buttonType="submit" title="Ver todos las tallas" :loading="loading" />
          </RouterLink>
        </section>
      </div>
    </div>
  </section>
</template>
