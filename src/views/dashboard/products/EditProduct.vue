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
import SelectField from '@/components/SelectField.vue'

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

const weightError = computed(() => {
  return v$?.value.$errors?.find((item) => item.$property === 'weight')?.$message || ''
})

const widthError = computed(() => {
  return v$?.value.$errors?.find((item) => item.$property === 'width')?.$message || ''
})

const lengthError = computed(() => {
  return v$?.value.$errors?.find((item) => item.$property === 'length')?.$message || ''
})

const heightError = computed(() => {
  return v$?.value.$errors?.find((item) => item.$property === 'height')?.$message || ''
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

const defaultMainImage = ref('')
const defaultImages = ref([])

const showDefaultImage = ref(true)
const showImageInputs = ref(true)
const loading = ref(false)
const sizes:any = ref([])
const colors:any = ref([])
const categories = ref([])
const defaultColors = ref([])
const defaultSizes = ref([])
const defaultCategories = ref([])
const state = reactive({
  colors: '',
  sizes: '',
  showInHomeSection: '',
  categories: [],
  productName: '',
  productNameEnglish: '',
  description: '',
  descriptionEnglish: '',
  price: null,
  priceDiscount: 0,
  stock: 0,
  productVariations: [] as any,
  width: '',
  height: '',
  length: '',
  weight: ''
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
  categories: { required: helpers.withMessage('Este campo no puede estar vacío', required) },
  priceDiscount: { numeric: helpers.withMessage('Solo se permiten números', numeric) },
  width: {
    required: helpers.withMessage('Este campo no puede estar vacío', required), 
    numeric: helpers.withMessage('Solo se permiten números', numeric)
  },
  height: {
    required: helpers.withMessage('Este campo no puede estar vacío', required), 
    numeric: helpers.withMessage('Solo se permiten números', numeric)
  },
  length: {
    required: helpers.withMessage('Este campo no puede estar vacío', required), 
    numeric: helpers.withMessage('Solo se permiten números', numeric)
  },
  weight: {
    required: helpers.withMessage('Este campo no puede estar vacío', required), 
    numeric: helpers.withMessage('Solo se permiten números', numeric)
  },
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

  if(state.productVariations.length == 0){
    showNotification('Debe agregar al menos una variación', 'error')
    return
  }

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
      categories: state.categories,
      mainImage: mainImage64,
      images: images64,
      name: state.productName,
      nameEnglish: state.productNameEnglish,
      price: state.price,
      priceDiscount: state.priceDiscount || 0,
      description: state.description,
      descriptionEnglish: state.descriptionEnglish,
      showInHomeSection: state.showInHomeSection,
      productVariations: state.productVariations,
      width: state.width,
      length: state.length,
      height: state.height,
      weight: state.weight
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

const addVariation = () => {
  if (state.colors && state.sizes && state.stock) {

    if(state.productVariations.length > 0){
      const exist = state.productVariations.find((item: any) => item.color === state.colors && item.size === state.sizes)
      if(exist){
        showNotification('Ya existe una variación con el mismo color y talla', 'error')
        return
      }
    }

    state.productVariations.push({
      color: state.colors as string,
      size: state.sizes as string,
      stock: state.stock as number
    });

    state.colors = ''
    state.sizes = ''
    state.stock = 0
  }else{
    showNotification('Debe seleccionar un color, una talla y un stock', 'error')
    return
  }
}

const deleteVariation = (index: number) => {
  state.productVariations.splice(index, 1)
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
  state.showInHomeSection = result.data?.showInHomeSection
  state.height = result.data?.height
  state.width = result.data?.width
  state.weight = result.data?.weight
  state.length = result.data?.length

  state.productVariations = result.data?.productVariations.map((item: any) => {
    return {
      color: item.color[0]?._id,
      size: item.size[0]?._id,
      stock: item.stock
    }
  })

  defaultCategories.value = state.categories.map((category: any) =>
    categories.value.find(
      (defaultCategory: any) => {
        return defaultCategory.id.toString() === category._id.toString()
      }
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

            <div class="flex gap-4">
                <TextField
                  class="w-full"
                  :onlyNumber="true"
                  label="Ancho del paquete (cm)"
                  type="text"
                  placeholder="Ingrese el ancho del empaque"
                  :error="`${widthError}`"
                  v-model="state.width"
                />

                <TextField
                  class="w-full"
                  :onlyNumber="true"
                  label="Alto del paquete (cm)"
                  type="text"
                  placeholder="Ingrese el alto del empaque"
                  :error="`${heightError}`"
                  v-model="state.height"
                />
              </div>

              <div class="flex gap-4">
                <TextField
                  class="w-full"
                  :onlyNumber="true"
                  label="Largo del paquete (cm)"
                  type="text"
                  placeholder="Ingrese el largo del empaque"
                  :error="`${lengthError}`"
                  v-model="state.length"
                />

                <TextField
                  class="w-full"
                  :onlyNumber="true"
                  label="Peso del paquete (kg)"
                  type="text"
                  placeholder="Ingrese el peso del empaque"
                  :error="`${weightError}`"
                  v-model="state.weight"
                />
              </div>

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
            <SelectField
                  v-if="showImageInputs"
                  v-model="state.showInHomeSection"
                  label="Sección del home"
                  placeholder="Seleccione una sección"
                  :options="[{ id: 'section-1', name: 'Novedades' }, { id: 'section-2', name: 'Productos recomendados' }, { id: 'section-3', name: 'Popular' }]" />
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

          <section class="w-full">
            <div class="flex items-center justify-center">
              <p>Variaciones del producto</p>
            </div>

            <div class="flex gap-4">
              <SelectField
                v-if="showImageInputs"
                @changeValue="changeColors"
                label="Colores"
                placeholder="Seleccione un color"
                :options="colors"
                v-model="state.colors"
                />
              
              <SelectField
                v-if="showImageInputs"
                @changeValue="changeSizes"
                label="Tallas"
                placeholder="Seleccione una talla"
                :options="sizes"
                v-model="state.sizes"
                />

              <TextField
                  class="w-full"
                  :onlyNumber="true"
                  label="Stock"
                  type="text"
                  placeholder="Ingrese el stock"
                  v-model="state.stock"
                />

                <Button buttonType="button" title="+" @click="addVariation" />
                
            </div>

            <table class="w-full">
              <tr>
                <th class="text-start w-1/4">Color</th>
                <th class="text-start w-1/4">Talla</th>
                <th class="text-start w-1/4">Stock</th>
                <th class="w-1/4"></th>
              </tr>
              <tr v-for="(variation, index) in state.productVariations" :key="index">
                <td>{{ colors.find((color: any) => color.id == variation?.color)?.name }}</td>
                <td>{{ sizes.find((size: any) => size.id == variation?.size)?.name }}</td>
                <td>{{ variation.stock }}</td>
                <td>
                  <Button buttonType="button" title="Eliminar" @click="deleteVariation(index)" />
                </td>
              </tr>
            </table>
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
      </div>
    </div>
  </section>
</template>
