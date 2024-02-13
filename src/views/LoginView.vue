<script setup lang="ts">
import Button from '@/components/Button.vue';
import PasswordField from '@/components/PasswordField.vue';
import TextField from '@/components/TextField.vue';
import { computed, reactive, ref } from 'vue';
import { useVuelidate } from '@vuelidate/core'
import { required, email, helpers } from '@vuelidate/validators'
import {useAuthStore} from '@/stores/authStore'
import { RouterLink, useRoute } from 'vue-router';
import router from '@/router';
import {login} from '@/api/repositories/auth.repository'
import {showNotification} from '@/composables/useNotification'

const authStore = useAuthStore()
const loading = ref(false)
const route:any = useRoute()

const state = reactive({
  email: '',
  password: ''
})
const rules = {
  email: { required:helpers.withMessage('Este campo no puede estar vacío', required), email:helpers.withMessage('El formato de correo no es válido', email) },
  password: { required:helpers.withMessage('Este campo no puede estar vacío', required) }
}

const v$ = useVuelidate(rules, state)

const signIn = async() => {

  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) return

  loading.value = true

  const allowedRoles = ['ADMIN', 'EMPLOYEE']
  const response = await login({email: state.email, password: state.password})

  if(response.status == 'success'){
    localStorage.setItem(import.meta.env.VITE_BEARER_TOKEN_KEY, response.data)
    await authStore.getUserInfo()
    loading.value = false
    
    if(!allowedRoles.includes(authStore.user?.role?.name)){
      authStore.user = null
      localStorage.removeItem(import.meta.env.VITE_BEARER_TOKEN_KEY)
      return showNotification("Solo administradores pueden ingresar", "error")
    }

    if(route.query?.redirect){
      router.push(route.query?.redirect)
      return
    }

    router.push({name: 'dashboard'})
    return
  } 
  
  if(response.status == 'fail'){
    showNotification("Usuario o contraseña incorrectos", "warning")
  }

  else if(response.status == 'error'){
    showNotification("Ha ocurrido un error", "error")
  }

  loading.value = false

}
const emailError = computed(() => {
  return v$?.value.$errors?.find(item => item.$property === 'email')?.$message || ''
})

const passwordError = computed(() => {
  return v$?.value.$errors?.find(item => item.$property === 'password')?.$message || ''
})


</script>

<template>
  <main class="flex h-screen">
      <div class="w-0 md:w-1/2 bg-hero bg-no-repeat bg-cover bg-center">
        <div class="bg-blue-500/75 h-full flex items-center justify-center">
          <h1 class="text-white text-6xl font-bold">Hola de nuevo!</h1>
        </div>
      </div>
      <div class="w-full px-10 md:w-1/2 flex justify-center items-center">
        <form class="w-full md:px-20 lg:px-36" @submit.prevent="signIn">
          <h1 class="font-bold text-left text-3xl mb-2">Log In</h1>
          <TextField label="Email" type="email" placeholder="Ingrese su email" :error="`${emailError}`" v-model="state.email" />
          <PasswordField class="w-full mt-3" label="Contraseña" name="password" placeholder="Ingrese su contraseña" :error="`${passwordError}`" v-model="state.password"/>
          <Button
            buttonType="submit"
            color="bg-blue-500"
            title="Ingresar"
            size="w-full"
            :loading="loading"
            />
        </form>
      </div>
    </main>
</template>
