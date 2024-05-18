import { axiosGet} from "../client";

export const statistic = async () => await axiosGet(`/v1/statistics`)