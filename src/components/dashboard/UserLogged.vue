<script setup lang="ts">
import UserIcon from '@/assets/icons/UserIcon.vue';
import ProfileIcon from '@/assets/icons/ProfileIcon.vue';
import { ref } from 'vue';

const showMenu = ref(false);
const props = defineProps({
    "name": String,
    "role": String
})
</script>

<template>
    <div class="flex items-center justify-start cursor-pointer" @click="showMenu = !showMenu">
        <UserIcon />
        <div>
            <p class="text-md font-bold">
                {{ props.name }}
            </p>
            <p class="text-sm">
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
            </ul>
        </div>
    </Transition>
</template>