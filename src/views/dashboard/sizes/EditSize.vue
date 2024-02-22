<script setup lang="ts">
import TextField from '@/components/TextField.vue'
import Button from '@/components/Button.vue'
import TextArea from '@/components/TextArea.vue'

import { reactive, ref, nextTick, computed, onMounted } from 'vue'
import InputField from '@/components/InputField.vue'
import { updateSize, lastestSizes, getSize } from '@/api/repositories/size.repository'
import { helpers, integer, numeric, required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import { showNotification } from '@/composables/useNotification'
import { useRoute } from 'vue-router'
import router from '@/router'

const route = useRoute()
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

    await updateSize(route.params.id.toString(), data)
    loading.value = false

    showNotification('Talla actualizada exitosamente', 'success')

    await router.push({ name: 'list-size' })
  } catch (error) {
    console.log(error)
    showNotification('Error al actualizar talla', 'error')
  }
}

const getSizes = async () => {
  const result = await lastestSizes()
  lastestSizesList.value = result.data?.sizes
}
onMounted(async () => {
  const sizeId = route.params.id.toString()
  const result = await getSize(sizeId)
  state.sizeName = result.data?.name
  state.sizeNameEnglish = result.data?.englishName
  getSizes()
})
</script>

<template>
  <section>
    <div>
      <h1 class="title">Editar talla</h1>
    </div>
    <div class="flex flex-col xl:flex-row gap-4">
      <div class="card-principal h-fit ">
        <form class="w-full grid gap-4" enctype="multipart/form-data" @submit.prevent="submitSize">
          <TextField
            label="Titulo de la categoría"
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
            <Button
            buttonType="submit"
            title="Actualizar talla"
            :loading="loading"
          />
        </section>
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
          v-for="size in lastestSizesList"
          :key="size._id"
        >
          <div class="text-sm font-semibold mb-0.5 truncate w-36 text-default-text capitalize">
            <p>{{ size.name }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
