<script setup lang="ts">
import Button from '@/components/Button.vue';
import TextArea from '@/components/TextArea.vue';
import TextField from '@/components/TextField.vue';
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import { computed, nextTick, onMounted, reactive, ref } from 'vue';
import {createItem} from '@/api/repositories/footer.repository'
import { showNotification } from '@/composables/useNotification';
import { itemList, itemDelete, getItem, updateItem } from '@/api/repositories/footer.repository';
import TrashIcon from '@/components/icons/TrashIcon.vue';
import EditIcon from '@/components/icons/EditIcon.vue';

const props = defineProps({
  section: Number,
  title: String
})

const showTextArea = ref(true)
const items = ref([])
const loading = ref(false)
const state = reactive({
    id: '',
    title: '',
    description: '',
    titleEnglish: '',
    descriptionEnglish: ''
})

const rules = {
  title: { required: helpers.withMessage('Este campo no puede estar vacío', required) },
  description: { required: helpers.withMessage('Este campo no puede estar vacío', required) },
  titleEnglish: { required: helpers.withMessage('Este campo no puede estar vacío', required) },
  descriptionEnglish: { required: helpers.withMessage('Este campo no puede estar vacío', required) }
}

const v$ = useVuelidate(rules, state)

const titleError = computed(() => {
  return v$?.value.$errors?.find((item) => item.$property === 'title')?.$message || ''
})

const descriptionError = computed(() => {
  return v$?.value.$errors?.find((item) => item.$property === 'description')?.$message || ''
})

const titleEnglishError = computed(() => {
  return v$?.value.$errors?.find((item) => item.$property === 'titleEnglish')?.$message || ''
})

const descriptionEnglishError = computed(() => {
  return v$?.value.$errors?.find((item) => item.$property === 'descriptionEnglish')?.$message || ''
})

const clearForm = async () => {
  state.id = ''
  state.title = ''
  state.description = ''
  state.titleEnglish = ''
  state.descriptionEnglish = ''
  showTextArea.value = false
  nextTick(() => {
    showTextArea.value = true
  })
  v$?.value.$reset()
}

const deleteItem = async (id) => {
  try {
    const response = await itemDelete(id)
    if(response.status === 'success') {
      showNotification('Item eliminado exitosamente', 'success')
      await getList()
    }
  } catch (error) {
    console.log(error)
    showNotification('Error al eliminar el item', 'error')
  }
}

const editItem = async (id) => {
  try {
    const response = await getItem(id)

    if(response.status === 'success') {
      state.id = response.data._id
      state.title = response.data.title
      state.description = response.data.description
      state.titleEnglish = response.data.titleEnglish
      state.descriptionEnglish = response.data.descriptionEnglish
    }

  } catch (error) {
    console.log(error)
    showNotification('Error al eliminar el item', 'error')
  }
}

const creationItem = async() => {
  const isFormCorrect = await v$.value.$validate()
  if (!isFormCorrect) return

  loading.value = true
  try {
    const data = {
        title: state.title,
        titleEnglish: state.titleEnglish,
        description: state.description,
        descriptionEnglish: state.descriptionEnglish,
        section: props.section
    }

    const result = await createItem(data)
    if (result.status == 'success') {
      showNotification('Item creado exitosamente', 'success')
      await getList()
      clearForm()
    }

  
    loading.value = false
  } catch (error) {
    console.log(error)
    showNotification('Error al crear el color', 'error')
  }
}

const updatingItem = async() => {
  const isFormCorrect = await v$.value.$validate()
  if (!isFormCorrect) return

  loading.value = true
  try {
    const data = {
        title: state.title,
        titleEnglish: state.titleEnglish,
        description: state.description,
        descriptionEnglish: state.descriptionEnglish,
    }

    const result = await updateItem(state.id, data)
    if (result.status == 'success') {
      showNotification('Item actualizado exitosamente', 'success')
      await getList()
      clearForm()
    }

  
    loading.value = false
  } catch (error) {
    console.log(error)
    showNotification('Error al actualizar el item', 'error')
  }
}

const submitItem = async () => {
  
  if(state.id) {
    await updatingItem()
  } else {
    await creationItem()
  }

}

const getList = async () => {
  try {
    const response = await itemList(props.section)
    if(response.status === 'success') {
      items.value = response.data
    }
    
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  getList()
})

</script>

<template>
    <section>
    <div>
      <h1 class="title">Crear item {{ props.title }}</h1>
    </div>
    <div class="flex flex-col xl:flex-row gap-4">
      <div class="card-principal">
        <form
          class="w-full grid xl:grid-cols-2 gap-x-10 gap-y-4"
          enctype="multipart/form-data"
          @submit.prevent="submitItem"
        >
          <div>
            <TextField
                label="Titulo del item"
                type="text"
                placeholder="Ingrese el titulo del item"
                :error="`${titleError}`"
                v-model="state.title"
            />

            <TextArea
            v-if="showTextArea"
                label="Texto del item"
                placeholder="Ingrese el texto del item"
                :error="`${descriptionError}`"
                v-model="state.description"
              />
          </div>

          <div>
            <TextField
                label="Titulo del item en inglés"
                type="text"
                placeholder="Ingrese el titulo del item en inglés"
                :error="`${titleEnglishError}`"
                v-model="state.titleEnglish"
            />

            <TextArea
              v-if="showTextArea"
                label="Texto del item en inglés"
                placeholder="Ingrese el texto del item en inglés"
                :error="`${descriptionEnglishError}`"
                v-model="state.descriptionEnglish"
              />
          </div>
        
          <section class="text-end col-span-2 mt-4">
            <Button buttonType="button" title="Limpiar" @click="clearForm" class="mr-2"/>
            <Button buttonType="submit" :title="state.id ? 'Actualizar item' : 'Crear item +'" class="" :loading="loading" />
          </section>
        </form>
      </div>
      <div class="card-secondary">
        <div class="pb-2 flex items-center border-b mb-4">
          <div class="w-1 mr-2 rounded-lg h-5 bg-yellow-300"></div>
          <p
            class="font-semibold text-sm text-default-text"
            v-text="'Items'"
          ></p>
        </div>
        <div
        class="flex items-center justify-between bg-gray-100 px-4 pt-2 rounded-lg pb-2 mb-3"
          v-for="item in items"
          :key="item.id"
          >
          <p class="text-sm font-semibold mb-0.5 truncate w-36 text-default-text capitalize">{{ item.title }}</p>
          <div class="flex items-center gap-2">
            <button class="text-sm text-red-500" @click="deleteItem(item._id)">
              <TrashIcon />
            </button>
            <button class="text-sm text-blue-500" @click="editItem(item._id)">
              <EditIcon />
            </button>
          </div>
        </div>  

      </div>
    </div>
  </section>
</template>