<script setup lang="ts">

import { ArrowLeftIcon, ArrowRightIcon} from '@heroicons/vue/24/outline'
import ButtonIcon from './ButtonIcon.vue';
    const props = defineProps({
        actualPage: {
            type: Number,
            required: true
        },
        totalPages: {
            type: Number,
            required: true
        }
    })

    const emit = defineEmits(['changePageEmit'])

    const nextPage = () => {

        if(!props?.actualPage || !props.totalPages) return

        if(props?.actualPage +1 > props?.totalPages) return

        emit('changePageEmit', props?.actualPage + 1)
    }

    const previousPage = () => {

        if(!props?.actualPage || !props.totalPages) return

        if(props?.actualPage - 1 == 0) return

        emit('changePageEmit', props?.actualPage - 1)
    }

</script>

<template>

    <div class="flex">
        <div class="flex w-full justify-center items-center">
            <p class="font-bold">Página: {{ actualPage }} de {{ props.totalPages }}</p>
            <ButtonIcon v-if="props?.actualPage - 1 > 0">
                <ArrowLeftIcon class="w-5 h-5 text-black" @click="previousPage()"/>
            </ButtonIcon>
            <ButtonIcon v-if="props?.actualPage + 1 <= props?.totalPages">
                <ArrowRightIcon class="w-5 h-5 text-black" @click="nextPage()"/>
            </ButtonIcon>
        </div>
    </div>

</template>