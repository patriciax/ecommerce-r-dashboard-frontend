<script setup lang="ts">
import TextField from '@/components/TextField.vue'
import Button from '@/components/Button.vue'

import { reactive, ref, computed, onMounted } from 'vue'
import { createZelle, getZelle, deleteZelle } from '@/api/repositories/zelle.repository'
import { email, helpers, required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import { showNotification } from '@/composables/useNotification'

const emailError = computed(() => {
  return v$?.value.$errors?.find((item) => item.$property === 'email')?.$message || ''
})

const loading = ref(false)
const loadingDelete = ref(false)
const state = reactive({
  email: ''
})

const clearForm = () => {
  state.email = ''
  v$?.value.$reset()
}

const rules = {
  email: { 
    required: helpers.withMessage('Este campo no puede estar vacío', required),
    email: helpers.withMessage('Este email no es correcto', email) 
  },
}

const v$ = useVuelidate(rules, state)

const removeZelle = async() => {
    loadingDelete.value = true
    await deleteZelle()
    clearForm()
    loadingDelete.value = false
}

const submitZelle = async () => {
  const isFormCorrect = await v$.value.$validate()
  if (!isFormCorrect) return

  loading.value = true
  try {
    const data = {
      email: state.email,
    }

    const result = await createZelle(data)

    if (result.status == 'success') {
      showNotification('Zelle creado exitosamente', 'success')
    }

    loading.value = false
  } catch (error) {
    showNotification('Error al crear el zelle', 'error')
  }
}

const zelleData = async() => {
    
    const response = await getZelle()

    state.email = response.data?.email

}

onMounted(() => {
  zelleData()
})
</script>

<template>
  <section>
    <div>
      <h1 class="title">Crear Zelle</h1>
    </div>
    <div class="flex flex-col xl:flex-row gap-4">
      <div class="card-principal">
        <form
          class="w-full grid xl:grid-cols-2 gap-x-10 gap-y-4"
          enctype="multipart/form-data"
          @submit.prevent="submitZelle"
        >
          <TextField
            label="Email"
            type="text"
            placeholder="Ingrese el email"
            :error="`${emailError}`"
            v-model="state.email"
          />
          <section class="text-end col-span-2 mt-4 space-x-2">
            <Button buttonType="submit" title="Crear zelle +" class="" :loading="loading" />
            <Button buttonType="button" title="Eliminar zelle" class="" :loading="loadingDelete" @click="removeZelle" />
          </section>
        </form>
      </div>
    </div>
  </section>
</template>
