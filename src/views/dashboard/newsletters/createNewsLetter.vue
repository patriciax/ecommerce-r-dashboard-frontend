<script setup lang="ts">
import TextArea from '@/components/TextArea.vue'
import TextField from '@/components/TextField.vue'
import { showNotification } from '@/composables/useNotification'
import Button from '@/components/Button.vue'
import useVuelidate from '@vuelidate/core'
import { createNewsletter, listNewsletters } from '@/api/repositories/newsletter.repository'
import { helpers, required } from '@vuelidate/validators'
import { computed, reactive, ref, nextTick, onMounted } from 'vue'

const showField = ref(true)
const newsletters: any = ref([])
const loading = ref(false)
const state = reactive({
  description: '',
  title: ''
})

const titleError = computed(() => {
  return v$?.value.$errors?.find((item) => item.$property === 'title')?.$message || ''
})

const descriptionError = computed(() => {
  return v$?.value.$errors?.find((item) => item.$property === 'description')?.$message || ''
})

const rules = {
  description: { required: helpers.withMessage('Este campo no puede estar vacío', required) },
  title: { required: helpers.withMessage('Este campo no puede estar vacío', required) }
}

const v$ = useVuelidate(rules, state)

const saveNewsletter = async () => {
  const isFormCorrect = await v$.value.$validate()
  if (!isFormCorrect) return

  try {
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
  } catch (error) {
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
  <div>
    <h1 class="title">Crear Newsletter</h1>
  </div>
  <div class="flex flex-col xl:flex-row gap-4">
    <div class="card-principal">
      <form @submit.prevent="saveNewsletter" class="w-full flex flex-col gap-x-10 gap-y-4">
        <TextField
          label="Titulo del newsletter"
          type="text"
          placeholder="Ingrese el nombre del newsletter"
          v-model="state.title"
          :error="`${titleError}`"
        />
        <TextArea
          v-if="showField"
          label="Descripción "
          placeholder="Ingrese la descripción "
          :error="`${descriptionError}`"
          v-model="state.description"
        />

        <section class="text-end col-span-2 mt-4">
          <Button buttonType="submit" title="Enviar newsletter +" class="" :loading="loading" />
        </section>
      </form>
    </div>
    <div class="card-secondary">
      <div class="pb-2 flex items-center border-b mb-4">
        <div class="w-1 mr-2 rounded-lg h-5 bg-indigo-400"></div>
        <p class="font-semibold text-sm text-default-text" v-text="'Últimos agregados'"></p>
      </div>
      <div
        class="flex items-center justify-start bg-gray-100 px-4 pt-2 rounded-lg pb-2 mb-3"
        v-for="newsletter in newsletters"
        :key="newsletter._id"
      >
        <div class="pl-5">
          <p class="text-black">{{ newsletter.title }}</p>
        </div>
      </div>
      <p
        v-if="!newsletters"
        class="text-sm font-medium text-center"
        v-text="'No hay newsletter agregado'"
      ></p>
    </div>
  </div>
</template>
