import { axiosGet, axiosPatch } from "../client";

export const invoicesList = async(limit=10, page = 1) => await axiosGet(`/v1/invoices?limit=${limit}&page=${page}`)
export const updateInvoice = async(invoiceId:string, data:any) => await axiosPatch(`/v1/invoices/${invoiceId}`, data)