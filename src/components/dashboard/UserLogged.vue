<script setup lang="ts">
import UserIcon from '@/assets/icons/UserIcon.vue';
import ProfileIcon from '@/assets/icons/ProfileIcon.vue';
import LogOutIcon from '../icons/LogOutIcon.vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { UserCircleIcon} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const router = useRouter()

const showMenu = ref(false);
const props = defineProps({
    "name": String,
    "role": String
})

const closeMenu = () => {
    showMenu.value = false
}

const logout = () => {
    localStorage.removeItem(import.meta.env.VITE_BEARER_TOKEN_KEY)
    authStore.setUser(null)
    closeMenu()
    router.push({name: 'login'})
}

</script>

<template>
    <div class="flex items-center justify-start cursor-pointer" @click="showMenu = !showMenu">
       <UserCircleIcon class="w-8 mr-2 text-blue-light"/>
        <div class="text-blue-light">
            <p class="text-md font-bold text-xs">
                {{ props.name }}
            </p>
            <p class="text-xs">
                {{ props.role }}
            </p>
        </div>
    </div>

    <Transition>
        <div class="rounded-md bg-white fixed w-44 mt-24 shadow-lg" v-if="showMenu">
            <ul>
                <li class="p-2 cursor-pointer flex items-center hover:bg-blue-300 hover:text-blue-600 hover:font-bold rounded-md" @click="showMenu = !showMenu">
                    <ProfileIcon />
                    <span class="ml-2">Perfil</span>
                </li>
                <li class="p-2 cursor-pointer flex items-center hover:bg-blue-300 hover:text-blue-600 hover:font-bold rounded-md" @click="logout">
                    <LogOutIcon />
                    <span class="ml-2">Cerrar sesión</span>
                </li>
            </ul>
        </div>
    </Transition>
</template>