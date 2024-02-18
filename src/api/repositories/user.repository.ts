import { axiosGet, axiosPost , axiosDelete, axiosPatch} from "../client";

export const createEmployee = async (data:any) => await axiosPost('/v1/users/employee', data)
export const updateEmployee = async (employeeId:string, data:any) => await axiosPatch(`/v1/users/employee/${employeeId}`, data)
export const getEmployees = async (data:any) => await axiosGet('/v1/users/employee')
export const lastestEmployees = async () => await axiosGet(`/v1/users/employee?limit=10&sort=-createdAt`)
export const employeeList = async(limit=10, page = 1) => await axiosGet(`/v1/users/employee?limit=${limit}&page=${page}`)
export const employeeDelete = async(employeeId:string) => await axiosDelete(`/v1/users/employee/${employeeId}`)
export const getEmployee = async(employeeId:string) => await axiosGet(`/v1/users/employee/${employeeId}`)
export const verifyRepeatedEmail = async(data:any) => await axiosPost(`/v1/users/verify-repeated-email`, data)