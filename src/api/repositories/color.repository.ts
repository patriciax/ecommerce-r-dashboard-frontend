import { axiosGet, axiosPost , axiosDelete, axiosPatch} from "../client";

export const createColor = async (data:any) => await axiosPost('/v1/colors', data)
export const lastestColors = async () => await axiosGet('/v1/colors?limit=10&sort=-createdAt')
export const getColors = async (colorId:string) => await axiosGet(`/v1/colors/${colorId}`)
export const colorList = async(limit=10, page = 1) => await axiosGet(`/v1/colors?limit=${limit}&page=${page}`)
export const colorDelete = async(colorId:string) => await axiosDelete(`/v1/colors/${colorId}`)
export const updateColor = async (colorId:string, data:any) => await axiosPatch(`/v1/colors/${colorId}`, data)