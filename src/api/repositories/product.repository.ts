import { axiosGet, axiosPost } from "../client";

export const createProduct = async (data:any) => await axiosPost('/v1/products', data)