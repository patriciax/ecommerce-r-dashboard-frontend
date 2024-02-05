import { axiosGet, axiosPost } from "../client";

export const createProduct = async (data:any) => await axiosPost('/v1/products', data)
export const lastestProducts = async () => await axiosGet('/v1/products?limit=10&sort=-createdAt')