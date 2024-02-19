import { axiosGet } from "../client";

export const clientList = async(limit=10, page = 1) => await axiosGet(`/v1/clients?limit=${limit}&page=${page}`)