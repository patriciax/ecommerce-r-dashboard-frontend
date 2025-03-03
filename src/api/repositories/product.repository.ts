import { axiosDelete, axiosGet, axiosPatch, axiosPost } from "../client";

export const createProduct = async (data:any) => await axiosPost('/v1/products', data)
export const lastestProducts = async () => await axiosGet('/v1/products?limit=10&sort=-createdAt')
export const allSizes = async () => await axiosGet('/v1/sizes')
export const allColors = async () => await axiosGet('/v1/colors')
export const allCategories = async () => await axiosGet('/v1/categories?categoryType=final')
export const productDelete = async (id:string) => await axiosDelete(`/v1/products/${id}`)
export const productList = async(limit=10, page = 1) => await axiosGet(`/v1/products?limit=${limit}&page=${page}`)
export const getProduct = async(id:string) => await axiosGet(`/v1/products/${id}`)
export const updateProduct = async(id:string, data:any) => await axiosPatch(`/v1/products/${id}`, data)
export const deleteSecondaryImage = async(id:string, imageId:string) => await axiosDelete(`/v1/products/${id}/secondary-image/${imageId}`)
export const getPrice = async () => await axiosGet('/v1/dolar-price')
