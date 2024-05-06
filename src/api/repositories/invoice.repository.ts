import { axiosGet, axiosPatch } from "../client";

export const invoicesList = async(limit=10, page = 1) => await axiosGet(`/v1/invoices?limit=${limit}&page=${page}&sort=-created`)
export const updateInvoice = async(invoiceId:string, data:any) => await axiosPatch(`/v1/invoices/${invoiceId}`, data)

export const updateInvoiceStatus = async (invoiceId:any, data:any) => await axiosPatch(`/v1/invoices/status/${invoiceId}`, data)
export const updateGiftCardStatus = async (invoiceId:any, data:any) => await axiosPatch(`/v1/invoices/status-giftcard/${invoiceId}`, data)