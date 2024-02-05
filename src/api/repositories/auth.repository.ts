import { axiosGet, axiosPost } from "../client";

export const login = async (data:any) => await axiosPost('/v1/users/login', data)
export const userInfo = async () => await axiosGet('/v1/users/user-info')