import axios from 'axios';

const setHeaders = () => {
    const token = localStorage.getItem(import.meta.env.VITE_BEARER_TOKEN_KEY)
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }

    return headers
}


export const axiosPost = async(url:string, data:object) => {

    try{
        
        const response = await axios.post(`${import.meta.env.VITE_API_URL}${url}`, data, {
            headers: setHeaders()
        })
        return response.data
    }catch(err: any){
        return err.response.data
    }


}

export const axiosGet = async(url:string) => {

    try{
        const response = await axios.get(`${import.meta.env.VITE_API_URL}${url}`, {
            headers: setHeaders()
        })
    
        return response.data
    }catch(err: any){
        return err.response.data
    }

}

export const axiosPatch = async(url:string, data:object) => {

    const response = await axios.patch(`${import.meta.env.VITE_API_URL}${url}`, {
        headers: setHeaders()
    }, data)
    console.log(response)

}

export const axiosDelete = async(url:string) => {

    const response = await axios.delete(`${import.meta.env.VITE_API_URL}${url}`, {
        headers: setHeaders()
    })
    console.log(response)

}