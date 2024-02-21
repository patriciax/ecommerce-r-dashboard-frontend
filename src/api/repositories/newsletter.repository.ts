import { axiosGet, axiosPost } from "../client";

export const createNewsletter = async (data:any) => await axiosPost('/v1/newsletter', data)
export const listNewsletters = async(limit=10, page = 1) => await axiosGet(`/v1/newsletter?limit=${limit}&page=${page}`)