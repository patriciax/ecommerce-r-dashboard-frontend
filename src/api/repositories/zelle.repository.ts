import { axiosGet, axiosPost , axiosDelete, axiosPatch} from "../client";

export const createZelle = async (data:any) => await axiosPost('/v1/zelle', data)
export const deleteZelle = async() => await axiosDelete(`/v1/zelle`)
export const getZelle = async() => await axiosGet(`/v1/zelle`)