import { axiosGet, axiosPost} from "../client";

export const manageBanner = async (data:any) => await axiosPost('/v1/banners', data)
export const getBanner = async () => await axiosGet('/v1/banners')