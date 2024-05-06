import { axiosGet, axiosPost , axiosDelete, axiosPatch} from "../client";

export const createPagoMovil = async (data:any) => await axiosPost('/v1/pago-movil', data)
export const deletePagoMovil = async() => await axiosDelete(`/v1/pago-movil`)
export const getPagoMovil = async() => await axiosGet(`/v1/pago-movil`)