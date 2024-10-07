/** @format */
import { axios } from "../../common/axios";

export default {
   login: async (email, password) => {
      const response = await axios.post("/auth/login", { email, password });
      return response;
   },

   register: async (formData) => {
      const response = await axios.post("/auth/register", { ...formData });
      return response;
   },
};
