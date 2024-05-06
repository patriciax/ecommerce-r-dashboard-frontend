<script setup lang="ts">
import TextField from '@/components/TextField.vue'
import Button from '@/components/Button.vue'

import { reactive, ref, computed, onMounted } from 'vue'
import { createPagoMovil, getPagoMovil, deletePagoMovil } from '@/api/repositories/pagoMovil.repository'
import { helpers, required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import { showNotification } from '@/composables/useNotification'

const lastestColorsList: any = ref([])

const bankError = computed(() => {
  return v$?.value.$errors?.find((item) => item.$property === 'bank')?.$message || ''
})

const identificationError = computed(() => {
  return v$?.value.$errors?.find((item) => item.$property === 'identification')?.$message || ''
})

const phoneError = computed(() => {
  return v$?.value.$errors?.find((item) => item.$property === 'phone')?.$message || ''
})

const loading = ref(false)
const loadingDelete = ref(false)
const state = reactive({
  bank: '',
  identification: '',
  phone: ''
})

const clearForm = () => {
  state.bank = ''
  state.identification = ''
  state.phone = ''
  v$?.value.$reset()
}

const rules = {
  bank: { required: helpers.withMessage('Este campo no puede estar vacío', required) },
  identification: { required: helpers.withMessage('Este campo no puede estar vacío', required) },
  phone: { required: helpers.withMessage('Este campo no puede estar vacío', required) }
}

const v$ = useVuelidate(rules, state)

const removePagoMovil = async() => {
    loadingDelete.value = true
    await deletePagoMovil()
    clearForm()
    loadingDelete.value = false
}

const submitPagoMovil = async () => {
  const isFormCorrect = await v$.value.$validate()
  if (!isFormCorrect) return

  loading.value = true
  try {
    const data = {
      bank: state.bank,
      identification: state.identification,
      phone: state.phone
    }

    const result = await createPagoMovil(data)

    if (result.status == 'success') {
      showNotification('Pago móvil creado exitosamente', 'success')
    }

    loading.value = false
  } catch (error) {
    showNotification('Error al crear el pago movil', 'error')
  }
}

const pagoMovilData = async() => {
    
    const response = await getPagoMovil()

    state.bank = response.data?.bank
    state.identification = response.data?.identification
    state.phone = response.data?.phone

}

onMounted(() => {
    pagoMovilData()
})
</script>

<template>
  <section>
    <div>
      <h1 class="title">Crear Pago móvil</h1>
    </div>
    <div class="flex flex-col xl:flex-row gap-4">
      <div class="card-principal">
        <form
          class="w-full grid xl:grid-cols-2 gap-x-10 gap-y-4"
          enctype="multipart/form-data"
          @submit.prevent="submitPagoMovil"
        >
          <TextField
            label="Banco"
            type="text"
            placeholder="Ingrese el nombre del banco"
            :error="`${bankError}`"
            v-model="state.bank"
          />
          <TextField
            label="Teléfono"
            type="text"
            placeholder="Ingrese el número de teléfono"
            :error="`${phoneError}`"
            v-model="state.phone"
          />
          <TextField
            label="Cédula"
            type="text"
            placeholder="Ingrese su cédula"
            :error="`${identificationError}`"
            v-model="state.identification"
          />
          <section class="text-end col-span-2 mt-4 space-x-2">
            <Button buttonType="submit" title="Crear pago móvil +" class="" :loading="loading" />
            <Button buttonType="button" title="Eliminar pago móvil" class="" :loading="loadingDelete" @click="removePagoMovil" />
          </section>
        </form>
      </div>
    </div>
  </section>
</template>
