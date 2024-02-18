import { axiosDelete, axiosGet, axiosPatch, axiosPost } from "../client";

export const createGiftCard = async (data:any) => await axiosPost('/v1/gift-cards', data)
export const lastestGiftCards = async () => await axiosGet('/v1/gift-cards?limit=10&sort=-createdAt')
export const giftCardDelete = async (id:string) => await axiosDelete(`/v1/gift-cards/${id}`)
export const giftCardList = async(limit=10, page = 1) => await axiosGet(`/v1/gift-cards?limit=${limit}&page=${page}`)
export const getGiftCard = async(id:string) => await axiosGet(`/v1/gift-cards/${id}`)
export const updateGiftCard = async(id:string, data:any) => await axiosPatch(`/v1/gift-cards/${id}`, data)
