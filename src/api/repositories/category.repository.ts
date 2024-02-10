import { axiosGet, axiosPost , axiosDelete, axiosPatch} from "../client";

export const createCategory = async (data:any) => await axiosPost('/v1/categories', data)
export const lastestCategories = async () => await axiosGet('/v1/categories?limit=10&sort=-createdAt')
export const getCategory = async (categoryId:string) => await axiosGet(`/v1/categories/${categoryId}`)
export const categoryList = async(limit=10, page = 1) => await axiosGet(`/v1/categories?limit=${limit}&page=${page}`)
export const categoryDelete = async(categoryId:string) => await axiosDelete(`/v1/categories/${categoryId}`)
export const updateCategory = async (categoryId:string, data:any) => await axiosPatch(`/v1/categories/${categoryId}`, data)