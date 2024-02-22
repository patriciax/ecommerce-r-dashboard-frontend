<script setup lang="ts">
import TextField from '@/components/TextField.vue'
import Button from '@/components/Button.vue'
import TextArea from '@/components/TextArea.vue'
import { reactive, ref, computed, onMounted } from 'vue'
import InputField from '@/components/InputField.vue'
import {
  updateProduct,
  getProduct,
  deleteSecondaryImage
} from '@/api/repositories/product.repository'
import { helpers, integer, numeric, required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import { showNotification } from '@/composables/useNotification'
import { lastestProducts } from '@/api/repositories/product.repository'
import { allSizes } from '@/api/repositories/product.repository'
import { allColors } from '@/api/repositories/product.repository'
import { allCategories } from '@/api/repositories/product.repository'
import MultipleSelectField from '@/components/MultipleSelectField.vue'
import { useRoute } from 'vue-router'
import ButtonIcon from '@/components/ButtonIcon.vue'
import TrashIcon from '@/components/icons/TrashIcon.vue'
import router from '@/router'

const route = useRoute()
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

const defaultMainImage = ref('')
const defaultImages = ref([])

const showDefaultImage = ref(true)
const showImageInputs = ref(true)
const loading = ref(false)
const sizes = ref([])
const colors = ref([])
const categories = ref([])
const defaultColors = ref([])
const defaultSizes = ref([])
const defaultCategories = ref([])
const state = reactive({
  colors: [],
  sizes: [],
  categories: [],
  productName: '',
  productNameEnglish: '',
  description: '',
  descriptionEnglish: '',
  price: null,
  priceDiscount: 0,
  stock: null
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
  sizes: { required: helpers.withMessage('Este campo no puede estar vacío', required) }
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
    let secondaryImageToEdit = false
    var images64: any = []
    let imagefile: any = document.querySelector('.main')
    var mainImage64: any = null

    if (imagefile.files.length > 0) {
      const reader = new FileReader()

      reader.onload = function () {
        const base64String = reader.result
        mainImage64 = base64String
      }

      reader.readAsDataURL(imagefile.files[0])
    }

    const secondaryImages: any = Array.from(document.querySelectorAll('.secondary'))

    if (secondaryImages) {
      for (let image of secondaryImages) {
        if (image.files.length > 0) {
          secondaryImageToEdit = true
          const readerSecondary = new FileReader()

          readerSecondary.onload = function () {
            const base64String = readerSecondary.result

            images64.push(base64String)
          }

          readerSecondary.readAsDataURL(image.files[0])
        }
      }
    }

    if (secondaryImageToEdit || imagefile.files.length) {
      while (mainImage64 == null && images64.length == 0) {
        await awaitTime()
      }
    }

    const data = {
      colors: state.colors,
      sizes: state.sizes,
      categories: state.categories,
      mainImage: mainImage64,
      images: images64,
      name: state.productName,
      nameEnglish: state.productNameEnglish,
      price: state.price,
      stock: state.stock,
      priceDiscount: state.priceDiscount || 0,
      description: state.description,
      descriptionEnglish: state.descriptionEnglish
    }

    await updateProduct(route.params.id.toString(), data)
    loading.value = false

    showNotification('Producto actualizado exitosamente', 'success')
    router.push({ name: 'list-product' })
  } catch (error) {
    console.log(error)
    showNotification('Error al crear el producto', 'error')
  }
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
      name: category.name
    }
  })
}

const loadProduct = async (productId: string) => {
  const result = await getProduct(productId)
  state.productName = result.data?.name
  state.productNameEnglish = result.data?.nameEnglish
  state.description = result.data?.description
  state.descriptionEnglish = result.data?.descriptionEnglish
  state.price = result.data?.price
  state.stock = result.data?.stock
  state.colors = result.data?.colors
  state.sizes = result.data?.sizes
  state.categories = result.data?.categories
  state.priceDiscount = result.data?.priceDiscount
  defaultMainImage.value = result.data?.mainImage
  defaultImages.value = result.data?.images

  defaultColors.value = state.colors.filter((color: any) =>
    colors.value.find((defaultColor: any) => defaultColor.id.toString() === color.toString())
  )
  defaultSizes.value = state.sizes.filter((size: any) =>
    sizes.value.find((defaultSize: any) => defaultSize.id.toString() === size.toString())
  )
  defaultCategories.value = state.categories.filter((category: any) =>
    categories.value.find(
      (defaultCategory: any) => defaultCategory.id.toString() === category.toString()
    )
  )
}

const deleteSecondImage = async (imageUrl: String) => {
  const imageIndex = imageUrl.substring(imageUrl.lastIndexOf('/') + 1, imageUrl.length)
  await deleteSecondaryImage(route.params.id.toString(), imageIndex)
  defaultImages.value = defaultImages.value.filter((image: any) => image !== imageUrl)
}

onMounted(async () => {
  const productId = route.params.id.toString()

  await getProducts()
  await getAllSizes()
  await getAllColors()
  await getAllCategories()
  await loadProduct(productId)
})
</script>

<template>
  <section>
    <div>
      <h1 class="title">Editar producto</h1>
    </div>
    <div class="flex flex-col xl:flex-row gap-4">
      <div class="rounded-md bg-white shadow-lg p-4 w-full lg:w-full xl:w-3/4 2xl:w-4/5">
        <form
          class="w-full grid lg:grid-cols-2 gap-y-4 gap-x-10 h-fit"
          enctype="multipart/form-data"
          @submit.prevent="submitProduct"
        >
          <section class="col-span-2 lg:col-span-1 gap-4 grid">
            <TextField
              label="Titulo del producto"
              type="text"
              placeholder="Ingrese el nombre del producto"
              :error="`${productError}`"
              v-model="state.productName"
            />

            <TextField
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
          </section>

          <div class="w-full gap-4 col-span-2 lg:col-span-1 grid">
            <TextField
              class="w-full "
              :onlyNumber="true"
              label="Stock del producto"
              type="text"
              placeholder="Ingrese el stock del producto"
              :error="`${stockError}`"
              v-model="state.stock"
            />
            <div class="flex flex-col lg:flex-row gap-4">
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
                placeholder="Ingrese el precio de descuento del producto"
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
          </div>

          <div class="grid w-full gap-4  col-span-2 lg:col-span-1">
            <MultipleSelectField
              v-if="categories"
              @changeValue="changeCategories"
              label="Categorías"
              placeholder="Seleccione uno o varias categorías"
              :options="categories"
              v-model="state.categories"
              :defaultValues="defaultCategories"
              :error="`${categoriesError}`"
            />
          </div>
          <div class="flex w-full gap-4 col-span-2 lg:col-span-1">
            <MultipleSelectField
              v-if="colors"
              @changeValue="changeColors"
              label="Colores"
              placeholder="Seleccione uno o varios colors"
              :options="colors"
              v-model="state.colors"
              :defaultValues="defaultColors"
              :error="`${colorsError}`"
              class="w-full"
            />
            <MultipleSelectField
              v-if="sizes"
              @changeValue="changeSizes"
              label="Tallas"
              placeholder="Seleccione uno o varias tallas"
              :options="sizes"
              v-model="state.sizes"
              :defaultValues="defaultSizes"
              :error="`${sizesError}`"
            />
          </div>

          <section class="mt-4 col-span-2 grid lg:grid-cols-2 gap-x-8 mb-6">
            <p class="text-sm mb-4 col-span-2 text-default-text font-semibold">
              Imagenes del producto:
            </p>

            <div
              class="flex mb-4 lg:mb-0 col-span-2 lg:col-span-1 w-full gap-4"
              v-if="showImageInputs"
            >
              <div class="w-full">
                <p class="font-bold mb-2">Imágen principal</p>
                <div class="flex flex-col items-center w-full relative group">
                  <div
                    :class="
                      showDefaultImage
                        ? 'absolute overflow-hidden top-1/4 lg:opacity-30 group-hover:opacity-100 h-24 rounded-lg borde- flex items-center justify-center'
                        : 'w-full'
                    "
                  >
                    <InputField
                      title="Cambiar imagen"
                      @changedImage="showDefaultImage = false"
                      class="w-full"
                      ref="main"
                      fieldId="main"
                    />
                  </div>
                  <img
                    v-if="showDefaultImage"
                    :src="defaultMainImage"
                    alt="product"
                    class="w-52 object-coverrounded-lg h-52"
                  />
                </div>
              </div>
            </div>
            <div v-if="showImageInputs" class="col-span-2 lg:col-span-1">
              <p class="font-bold mb-2">Imágenes secundarias</p>
              <div class="flex xl:flex-row flex-col items-center gap-4">
                <div class="flex flex-col border rounded-lg">
                  <InputField
                    v-if="!defaultImages[0]"
                    class="w-full"
                    ref="main"
                    fieldId="secondary"
                  />
                  <div v-else class="flex">
                    <img :src="defaultImages[0]" alt="product" class="w-32 h-32 object-cover" />
                    <ButtonIcon
                      @click="deleteSecondImage(defaultImages[0])"
                      color="bg-slate-100 text-blue-dark hover:text-red-500"
                      size="h-6"
                    >
                      <TrashIcon />
                    </ButtonIcon>
                  </div>
                </div>
                <div class="flex flex-col">
                  <InputField
                    v-if="!defaultImages[1]"
                    class="w-full"
                    ref="main"
                    fieldId="secondary"
                  />
                  <div v-else class="flex">
                    <img :src="defaultImages[1]" alt="product" class="w-32 h-32 object-cover" />
                    <ButtonIcon
                      @click="deleteSecondImage(defaultImages[1])"
                      color="bg-slate-100 text-blue-dark hover:text-red-500"
                      size="h-12"
                    >
                      <TrashIcon />
                    </ButtonIcon>
                  </div>
                </div>
                <div class="flex flex-col">
                  <InputField
                    v-if="!defaultImages[2]"
                    class="w-full"
                    ref="main"
                    fieldId="secondary"
                  />
                  <div v-else class="flex">
                    <img :src="defaultImages[2]" alt="product" class="w-32 h-32 object-cover" />
                    <ButtonIcon
                      @click="deleteSecondImage(defaultImages[2])"
                      color="bg-slate-100 text-blue-dark hover:text-red-500"
                      size="h-12"
                    >
                      <TrashIcon />
                    </ButtonIcon>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section class="text-end col-span-2">
            <Button buttonType="submit" title="Actualizar producto" :loading="loading" />
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
            <Button buttonType="submit" title="Ver todos los productos" :loading="loading" />
          </RouterLink>
        </section>
      </div>
    </div>
  </section>
</template>
