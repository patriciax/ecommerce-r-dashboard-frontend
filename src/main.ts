import './assets/styles/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueApexCharts from "vue3-apexcharts";
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.component('QuillEditor', QuillEditor)
app.use(createPinia())
app.use(router)
app.use(VueApexCharts);
app.use(Vue3Toastify, {
    autoClose: 3000,
  } as ToastContainerOptions);
app.mount('#app')
