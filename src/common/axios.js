/** @format */
import originAxios from "axios";

export const axios = originAxios;

axios.defaults.baseURL = process.env.REACT_APP_PUBLIC_SERVER_URL;
axios.defaults.withCredentials = true;
