<script setup lang="ts">
import TextField from '@/components/TextField.vue'
import Button from '@/components/Button.vue'

import { reactive, ref, computed, onMounted } from 'vue'
import { createGiftCard, lastestGiftCards } from '@/api/repositories/giftCard.repository'
import { helpers, minValue, numeric, required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import { showNotification } from '@/composables/useNotification'

const lastestGiftCardsList: any = ref([])

const nameError = computed(() => {
  return v$?.value.$errors?.find((item) => item.$property === 'giftCardName')?.$message || ''
})

const nameErrorEnglish = computed(() => {
  return v$?.value.$errors?.find((item) => item.$property === 'giftCardNameEnglish')?.$message || ''
})

const amountError = computed(() => {
  return v$?.value.$errors?.find((item) => item.$property === 'amount')?.$message || ''
})

const loading = ref(false)

const state = reactive({
  giftCardName: '',
  giftCardNameEnglish: '',
  amount: 0
})

const rules = {
  giftCardName: { required: helpers.withMessage('Este campo no puede estar vacío', required) },
  giftCardNameEnglish: {
    required: helpers.withMessage('Este campo no puede estar vacío', required)
  },
  amount: {
    required: helpers.withMessage('Este campo no puede estar vacío', required),
    numeric: helpers.withMessage('Este campo debe ser numérico', numeric),
    minValue: helpers.withMessage('El valor mínimo es 1', minValue(1))
  }
}

const v$ = useVuelidate(rules, state)

const submitGiftCard = async () => {
  const isFormCorrect = await v$.value.$validate()
  if (!isFormCorrect) return

  try {
    loading.value = true
    const data = {
      title: state.giftCardName,
      titleEnglish: state.giftCardNameEnglish,
      amount: state.amount
    }

    const result = await createGiftCard(data)

    if (result.status == 'success') {
      showNotification('Gift card creada exitosamente', 'success')
    }

    await getLastCategories()

    clearForm()
    loading.value = false
  } catch (error) {
    console.log(error)
    showNotification('Error al crear gift card', 'error')
  }
}

const clearForm = () => {
  state.giftCardName = ''
  state.giftCardNameEnglish = ''
  state.amount = 0

  v$?.value.$reset()
}

const getLastCategories = async () => {
  const result = await lastestGiftCards()
  lastestGiftCardsList.value = result.data?.giftCards
}

onMounted(async () => {
  getLastCategories()
})
</script>

<template>
  <section>
    <div>
      <h1 class="title">Crear gift card</h1>
    </div>
    <div class="flex flex-col xl:flex-row gap-4">
      <div class="card-principal h-fit">
        <form class="w-full grid gap-4" enctype="multipart/form-data" @submit.prevent="submitGiftCard">
          <TextField
            label="Titulo del gift card"
            type="text"
            placeholder="Ingrese el nombre del Gift card"
            :error="`${nameError}`"
            v-model="state.giftCardName"
          />
          <TextField
            label="Titulo del gift card en inglés"
            type="text"
            placeholder="Ingrese el nombre del gift card en inglés"
            :error="`${nameErrorEnglish}`"
            v-model="state.giftCardNameEnglish"
          />
          <TextField
            label="Precio"
            type="text"
            :onlyNumber="true"
            placeholder="Ingrese el precio"
            :error="`${amountError}`"
            v-model="state.amount"
          />

          <section class="text-end mt-4">
            <Button buttonType="submit" title="Crear gift card +" :loading="loading" />
          </section>
        </form>
      </div>
      <div class="card-secondary">
        <div class="pb-2 flex items-center border-b mb-4">
          <div class="w-1 mr-2 rounded-lg h-5 bg-cyan-600"></div>
          <p class="font-semibold text-sm text-default-text" v-text="'Últimos agregados'"></p>
        </div>
        <div
          class="flex items-center justify-start bg-gray-100 px-4 pt-2 rounded-lg pb-2 mb-3"
          v-for="category in lastestGiftCardsList"
          :key="category.id"
        >
          <div class="">
            <p class="text-sm font-semibold mb-0.5 truncate w-36 text-default-text capitalize">{{ category.name }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
