import { axiosGet, axiosPost , axiosDelete, axiosPatch} from "../client";

export const createItem = async (data:any) => await axiosPost('/v1/footers', data)
export const getItem = async (footerId:string) => await axiosGet(`/v1/footers/item/${footerId}`)
export const itemList = async(section:Number) => await axiosGet(`/v1/footers/${section}`)
export const itemDelete = async(footerId:string) => await axiosDelete(`/v1/footers/${footerId}`)
export const updateItem = async (footerId:string, data:any) => await axiosPatch(`/v1/footers/${footerId}`, data)