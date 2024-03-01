<script setup lang="ts">
import TextField from '@/components/TextField.vue'
import Button from '@/components/Button.vue'
import TextArea from '@/components/TextArea.vue'
import { reactive, ref, nextTick, computed, onMounted } from 'vue'
import InputField from '@/components/InputField.vue'
import { createProduct } from '@/api/repositories/product.repository'
import { helpers, integer, numeric, required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import { showNotification } from '@/composables/useNotification'
import { lastestProducts } from '@/api/repositories/product.repository'
import { allSizes } from '@/api/repositories/product.repository'
import { allColors } from '@/api/repositories/product.repository'
import { allCategories } from '@/api/repositories/product.repository'
import MultipleSelectField from '@/components/MultipleSelectField.vue'
import SelectField from '@/components/SelectField.vue'

const lastestProductsList: any = ref([])

const productError = computed(() => {
  return v$?.value.$errors?.find((item) => item.$property === 'productName')?.$message || ''
})

const productErrorEnglish = computed(() => {
  return v$?.value.$errors?.find((item) => item.$property === 'productNameEnglish')?.$message || ''
})

const descriptionError = computed(() => {
  return v$?.value.$errors?.find((item) => item.$property === 'description')?.$message || ''
})

const descriptionErrorEnglish = computed(() => {
  return v$?.value.$errors?.find((item) => item.$property === 'descriptionEnglish')?.$message || ''
})

const priceError = computed(() => {
  return v$?.value.$errors?.find((item) => item.$property === 'price')?.$message || ''
})

const priceDiscountError = computed(() => {
  return v$?.value.$errors?.find((item) => item.$property === 'priceDiscount')?.$message || ''
})

const stockError = computed(() => {
  return v$?.value.$errors?.find((item) => item.$property === 'stock')?.$message || ''
})

const categoriesError = computed(() => {
  return v$?.value.$errors?.find((item) => item.$property === 'categories')?.$message || ''
})

const colorsError = computed(() => {
  return v$?.value.$errors?.find((item) => item.$property === 'colors')?.$message || ''
})

const sizesError = computed(() => {
  return v$?.value.$errors?.find((item) => item.$property === 'sizes')?.$message || ''
})

const showImageInputs = ref(true)
const loading = ref(false)
const sizes = ref([])
const colors = ref([])
const categories = ref([])
const state = reactive({
  colors: [],
  sizes: [],
  categories: [],
  productName: '',
  productNameEnglish: '',
  description: '',
  descriptionEnglish: '',
  price: null,
  stock: null,
  priceDiscount: '',
  showInHomeSection: ''
})

const changeColors = (value: any) => {
  state.colors = value
}

const changeSizes = (value: any) => {
  state.sizes = value
}

const changeCategories = (value: any) => {
  state.categories = value
}

const rules = {
  productName: { required: helpers.withMessage('Este campo no puede estar vacío', required) },
  productNameEnglish: {
    required: helpers.withMessage('Este campo no puede estar vacío', required)
  },
  description: { required: helpers.withMessage('Este campo no puede estar vacío', required) },
  descriptionEnglish: {
    required: helpers.withMessage('Este campo no puede estar vacío', required)
  },
  price: {
    required: helpers.withMessage('Este campo no puede estar vacío', required),
    numeric: helpers.withMessage('Solo se permiten números', numeric)
  },
  stock: {
    required: helpers.withMessage('Este campo no puede estar vacío', required),
    integer: helpers.withMessage('Solo se permiten números', integer)
  },
  colors: { required: helpers.withMessage('Este campo no puede estar vacío', required) },
  categories: { required: helpers.withMessage('Este campo no puede estar vacío', required) },
  sizes: { required: helpers.withMessage('Este campo no puede estar vacío', required) },
  priceDiscount: { numeric: helpers.withMessage('Solo se permiten números', numeric) }
}

const v$ = useVuelidate(rules, state)

const awaitTime = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 1000)
  })
}

const submitProduct = async () => {
  const isFormCorrect = await v$.value.$validate()
  if (!isFormCorrect) return

  loading.value = true
  try {
    var images64: any = []
    let imagefile: any = document.querySelector('.main')
    var mainImage64: any = null

    if (imagefile.files.length == 0) {
      showNotification('Imágen principal es obligatoria', 'error')
      loading.value = false
      return
    }

    const reader = new FileReader()

    reader.onload = function () {
      const base64String = reader.result
      mainImage64 = base64String
    }

    reader.readAsDataURL(imagefile.files[0])

    const secondaryImages: any = Array.from(document.querySelectorAll('.secondary'))
    for (let image of secondaryImages) {
      if (image.files.length > 0) {
        const readerSecondary = new FileReader()

        readerSecondary.onload = function () {
          const base64String = readerSecondary.result

          images64.push(base64String)
        }

        readerSecondary.readAsDataURL(image.files[0])
      }
    }

    while (mainImage64 == null && images64.length == 0) {
      await awaitTime()
    }

    const data = {
      colors: state.colors,
      sizes: state.sizes,
      categories: state.categories,
      mainImage: mainImage64,
      images: images64,
      title: state.productName,
      titleEnglish: state.productNameEnglish,
      price: state.price,
      stock: state.stock,
      description: state.description,
      descriptionEnglish: state.descriptionEnglish,
      priceDiscount: state.priceDiscount || 0,
      showInHomeSection: state.showInHomeSection
    }

    await createProduct(data)
    clearForm()
    await getProducts()
    loading.value = false

    showNotification('Producto creado exitosamente', 'success')
  } catch (error) {
    console.log(error)
    showNotification('Error al crear el producto', 'error')
  }
}

const clearForm = () => {
  state.productName = ''
  state.description = ''
  state.productNameEnglish = ''
  state.descriptionEnglish = ''
  state.price = null
  state.stock = null
  state.colors = []
  state.sizes = []
  state.categories = []
  state.priceDiscount = ''

  showImageInputs.value = false
  nextTick(() => {
    showImageInputs.value = true
  })

  v$?.value.$reset()
}

const getProducts = async () => {
  const result = await lastestProducts()
  lastestProductsList.value = result.data?.products
}

const getAllSizes = async () => {
  const response = await allSizes()
  sizes.value = response.data?.sizes.map((size: any) => {
    return {
      id: size._id,
      name: size.name
    }
  })
}

const getAllColors = async () => {
  const response = await allColors()
  colors.value = response.data?.colors.map((color: any) => {
    return {
      id: color._id,
      name: color.name
    }
  })
}

const getAllCategories = async () => {
  const response = await allCategories()
  categories.value = response.data?.categories.map((category: any) => {
    return {
      id: category._id,
      name: `${category.ancestors.reverse().map((item:any) => item.name)} ${category.name}`  
    }
  })
}

onMounted(() => {
  getProducts()
  getAllSizes()
  getAllColors()
  getAllCategories()
})
</script>

<template>
  <section class="bg-background-layout">
    <div>
      <h1 class="title">Crear producto</h1>
    </div>
    <div class="flex flex-col xl:flex-row gap-4">
      <div class="card-principal">
        <form class="w-full" enctype="multipart/form-data" @submit.prevent="submitProduct">
          <section class="grid lg:grid-cols-2 gap-10">
            <div class="grid gap-4 h-fit">
              <TextField
                class="w-full pr-3"
                label="Titulo del producto"
                type="text"
                placeholder="Ingrese el nombre del producto"
                :error="`${productError}`"
                v-model="state.productName"
              />

              <TextField
                class="w-full pr-3"
                label="Titulo del producto en inglés"
                type="text"
                placeholder="Ingrese el nombre del producto en inglés"
                :error="`${productErrorEnglish}`"
                v-model="state.productNameEnglish"
              />

              <TextArea
                v-if="showImageInputs"
                label="Descripción del producto"
                placeholder="Ingrese la descripción del producto"
                :error="`${descriptionError}`"
                v-model="state.description"
              />
              <div class="flex-col w-full gap-4">
                <MultipleSelectField
                  v-if="showImageInputs"
                  @changeValue="changeCategories"
                  label="Categorías"
                  placeholder="Seleccione uno o varias categorías"
                  :options="categories"
                  v-model="state.categories"
                  :error="`${categoriesError}`"
                />
                <SelectField
                  v-if="showImageInputs"
                  v-model="state.showInHomeSection"
                  label="Sección del home"
                  placeholder="Seleccione una sección"
                  :options="[{ id: 'section-1', name: 'Novedades' }, { id: 'section-2', name: 'Novedades 2' }, { id: 'section-3', name: 'Novedades 3' }]" />
              </div>
            </div>
            <section class="grid h-fit gap-4">
              <TextField
                class="w-full"
                :onlyNumber="true"
                label="Stock del producto"
                type="text"
                placeholder="Ingrese el stock del producto"
                :error="`${stockError}`"
                v-model="state.stock"
              />
              <div class="flex w-full gap-4">
                <TextField
                  class="w-full"
                  :onlyNumber="true"
                  label="Precio del producto"
                  type="text"
                  placeholder="Ingrese el precio del producto"
                  :error="`${priceError}`"
                  v-model="state.price"
                />
                <TextField
                  class="w-full"
                  :onlyNumber="true"
                  label="Precio de descuento"
                  type="text"
                  placeholder="Ingrese el precio de descuento"
                  :error="`${priceDiscountError}`"
                  v-model="state.priceDiscount"
                />
              </div>
              <TextArea
                v-if="showImageInputs"
                label="Descripción del producto en inglés"
                placeholder="Ingrese la descripción del producto en inglés"
                :error="`${descriptionErrorEnglish}`"
                v-model="state.descriptionEnglish"
              />

              <div class="flex flex-col xl:flex-row w-full gap-4">
                <MultipleSelectField
                  v-if="showImageInputs"
                  @changeValue="changeColors"
                  label="Colores"
                  placeholder="Seleccione uno o varios colors"
                  :options="colors"
                  v-model="state.colors"
                  :error="`${colorsError}`"
                />
                <MultipleSelectField
                  v-if="showImageInputs"
                  @changeValue="changeSizes"
                  label="Tallas"
                  placeholder="Seleccione uno o varias tallas"
                  :options="sizes"
                  v-model="state.sizes"
                  :error="`${sizesError}`"
                />
              </div>
            </section>
          </section>
          <div class="grid xl:grid-cols-2 w-full gap-x-10 gap-y-3 mt-4 mb-6" v-if="showImageInputs">
            <p
              class="text-base col-span-2 font-bold mb-0.5 text-default-text"
              v-text="'Imagenes del producto'"
            />
            <div>
              <p class="text-sm font-medium mb-0.5 text-default-text">Imágen principal</p>
              <InputField class="w-full" ref="main" fieldId="main" />
            </div>
            <div>
              <p class="text-sm font-medium mb-0.5 text-default-text">Imágenes secundarias</p>
              <div class="flex xl:flex-row flex-col gap-2">
                <InputField class="w-full" ref="main" fieldId="secondary" />
                <InputField class="w-full" ref="main" fieldId="secondary" />
                <InputField class="w-full" ref="main" fieldId="secondary" />
              </div>
            </div>
          </div>
          <section class="text-end">
            <Button buttonType="submit" title="Crear producto +" :loading="loading" />
          </section>
        </form>
      </div>
      <div class="card-secondary">
        <div class="pb-2 flex items-center border-b mb-4">
          <div class="w-1 mr-2 rounded-lg h-5 bg-blue-300"></div>
          <p
            class="font-semibold text-sm text-default-text"
            v-text="'Últimos productos agregados'"
          ></p>
        </div>
        <div
          class="flex items-center justify-start bg-gray-100 px-4 pt-2 rounded-lg pb-2 mb-3"
          v-for="latestProduct in lastestProductsList"
          :key="latestProduct.id"
        >
          <img :src="latestProduct?.mainImage" alt="product" class="w-16 mr-2 h-16 rounded-full" />
          <div class="w-full flex justify-between">
            <p class="text-sm font-semibold mb-0.5 truncate w-36 text-default-text capitalize">
              {{ latestProduct.name }}
            </p>
            <span class="font-semibold">${{ latestProduct.price }}</span>
          </div>
        </div>

        <section class="flex justify-center my-2 mt-4 pt-4 border-t">
          <RouterLink to="/dashboard/product/list">
            <Button buttonType="button" title="Ver todos los productos" />
          </RouterLink>
        </section>
      </div>
    </div>
  </section>
</template>
