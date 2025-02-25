import { axiosGet, axiosPost , axiosDelete, axiosPatch} from "../client";

export const createSize = async (data:any) => await axiosPost('/v1/sizes', data)
export const lastestSizes = async () => await axiosGet('/v1/sizes?limit=10&sort=-createdAt')
export const getSize = async (sizeId:string) => await axiosGet(`/v1/sizes/${sizeId}`)
export const sizeList = async(limit=10, page = 1) => await axiosGet(`/v1/sizes?limit=${limit}&page=${page}`)
export const sizeDelete = async(sizeId:string) => await axiosDelete(`/v1/sizes/${sizeId}`)
export const updateSize = async (sizeId:string, data:any) => await axiosPatch(`/v1/sizes/${sizeId}`, data)