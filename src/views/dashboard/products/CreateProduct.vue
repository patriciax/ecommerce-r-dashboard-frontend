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
import { useRouter } from 'vue-router'
import ButtonIcon from '@/components/ButtonIcon.vue'
import IconEcosystem from '@/components/icons/IconEcosystem.vue'
import IconRefresh from '@/components/icons/IconRefresh.vue'
const router = useRouter();

const lastestProductsList: any = ref([])

const openNewTab = (routeName:string) => {
  const routeData = router.resolve({name: routeName});
  window.open(routeData.href, '_blank');
}

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

const colorsError = computed(() => {
  return v$?.value.$errors?.find((item) => item.$property === 'colors')?.$message || ''
})

const sizesError = computed(() => {
  return v$?.value.$errors?.find((item) => item.$property === 'sizes')?.$message || ''
})

const showImageInputs = ref(true)
const loading = ref(false)
const sizes:any = ref([])
const colors:any = ref([])
const categories = ref([])
const state = reactive({
  colors: '',
  sizes: '',
  categories: [],
  productName: '',
  productNameEnglish: '',
  description: '',
  descriptionEnglish: '',
  price: null,
  stock: 0,
  priceDiscount: '',
  showInHomeSection: '',
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
      categories: state.categories,
      mainImage: mainImage64,
      images: images64,
      title: state.productName,
      titleEnglish: state.productNameEnglish,
      price: state.price,
      description: state.description,
      descriptionEnglish: state.descriptionEnglish,
      priceDiscount: state.priceDiscount || 0,
      showInHomeSection: state.showInHomeSection,
      productVariations: state.productVariations,
      length: state.length,
      width: state.width,
      weight: state.weight,
      height: state.height
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

const clearForm = () => {
  state.productName = ''
  state.description = ''
  state.productNameEnglish = ''
  state.descriptionEnglish = ''
  state.price = null
  state.stock = 0
  state.colors = ''
  state.sizes = ''
  state.categories = []
  state.priceDiscount = ''
  state.productVariations = []
  state.width = ''
  state.weight = ''
  state.length = ''
  state.height = ''

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
                <div class="mb-4">
                  <div class="flex">
                    <MultipleSelectField
                      v-if="showImageInputs"
                      @changeValue="changeCategories"
                      label="Categorías"
                      placeholder="Seleccione uno o varias categorías"
                      :options="categories"
                      v-model="state.categories"
                      :error="`${categoriesError}`"
                    />
                    <ButtonIcon @click="getAllCategories" class="mt-3">
                      <IconRefresh />
                    </ButtonIcon>
                  </div>
                  <small class="text-blue-500 cursor-pointer" @click="openNewTab('create-category')" >Ir a categorías</small>
                </div>
                <SelectField
                  v-if="showImageInputs"
                  v-model="state.showInHomeSection"
                  label="Sección del home"
                  placeholder="Seleccione una sección"
                  :options="[{ id: 'section-1', name: 'Novedades' }, { id: 'section-2', name: 'Productos recomendados' }, { id: 'section-3', name: 'Popular' }]" />
              </div>
            </div>
            <section class="grid h-fit gap-4">
              <div class="flex flex-col w-full gap-4">
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

          <div class="flex items-center justify-center">
            <p>Variaciones del producto</p>
          </div>

          <div class="flex gap-4">
            <div class="w-1/4">
              <div class="flex">
                <SelectField
                v-if="showImageInputs"
                @changeValue="changeColors"
                label="Colores"
                placeholder="Seleccione un color"
                :options="colors"
                v-model="state.colors"
                :error="`${colorsError}`"/>
                <ButtonIcon @click="getAllColors" class="mt-3">
                <IconRefresh />
              </ButtonIcon>
              </div>

              <small class="text-blue-500 cursor-pointer" @click="openNewTab('create-color')" >Ir a colores</small>
            </div>
            <div class="w-1/4">
              <div class="flex">
                <SelectField
                  v-if="showImageInputs"
                  @changeValue="changeSizes"
                  label="Tallas"
                  placeholder="Seleccione una talla"
                  :options="sizes"
                  v-model="state.sizes"
                  :error="`${sizesError}`"/>
                <ButtonIcon @click="getAllSizes" class="mt-3">
                  <IconRefresh />
                </ButtonIcon>
              </div>
              
              <small class="text-blue-500 cursor-pointer" @click="openNewTab('create-size')" >Ir a tallas</small>
            </div>

            <TextField
                class="w-1/4"
                :onlyNumber="true"
                label="Stock"
                type="text"
                placeholder="Ingrese el stock"
                v-model="state.stock"
              />

              <Button class="w-1/4" buttonType="button" title="+" @click="addVariation" />
              
          </div>

          <table class="w-full">
            <tr>
              <th class="text-start w-1/4">Color</th>
              <th class="text-start w-1/4">Talla</th>
              <th class="text-start w-1/4">Stock</th>
              <th class="w-1/4"></th>
            </tr>
            <tr v-for="(variation, index) in state.productVariations" :key="index">
              <td>{{ colors.find((color: any) => color.id == variation.color)?.name }}</td>
              <td>{{ sizes.find((size: any) => size.id == variation.size)?.name }}</td>
              <td>{{ variation.stock }}</td>
              <td>
                <Button buttonType="button" title="Eliminar" @click="deleteVariation(index)" />
              </td>
            </tr>
          </table>

          <section class="text-end mt-6">
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
