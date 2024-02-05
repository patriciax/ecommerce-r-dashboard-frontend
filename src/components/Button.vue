<script setup lang="ts">

    import Spinner from '@/assets/icons/Spinner.vue'
    import type { ButtonHTMLAttributes, PropType } from 'vue';

    const emit = defineEmits(['click'])
    const props = defineProps({
        buttonType: {
            type: String as PropType<ButtonHTMLAttributes['type']>,
            default: 'button'
        },
        title: {
            type: String,
            required: true
        },
        color: {
            type: String,
            default: ''
        },
        size: {
            type: String,
            default: ''
        },
        loading: {
            type: Boolean,
            default: false
        }
    })

</script>

 <template>
    <button
        :type="props.buttonType"
        @click="emit('click')"
        :className="`px-6 py-4 bg-blue-500 rounded-md text-white ${props.color} ${props.size} text-center`"
    >
        <div class="text-center flex justify-center">
            <template v-if="props.loading">
                <Spinner />
            </template>
            <template v-else>
                {{ props.title }}
            </template>
        </div>
    </button>
 </template>