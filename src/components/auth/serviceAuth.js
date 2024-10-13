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

   loginGoogle: async (userInfo) => {
      const { name, email } = userInfo;
      const dataRequest = {
         username: name,
         email,
      };
      const response = await axios.post("/auth/google/login", { ...dataRequest });
      return response;
   },
};
