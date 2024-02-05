import { ref } from 'vue'
import { defineStore } from 'pinia'
import { axiosGet } from '@/api/client'

export const useAuthStore = defineStore('auth', () => {
    const user:any = ref(null)
  
    function setUser(_user:any){
        user.value = _user
    }

    async function getUserInfo(){
        const response = await axiosGet('/v1/users/user-info')
        user.value = response.data
    }


    return { user, setUser, getUserInfo }
})
