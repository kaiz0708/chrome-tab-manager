/** @format */
import { axios } from "../../common/axios";

export default {
   login: async (email, password) => {
      try {
         const response = await axios.post("/auth/login", { email, password });
         return response;
      } catch (error) {
         return null;
      }
   },

   register: async (formData) => {
      try {
         const response = await axios.post("/auth/register", { ...formData });
         return response;
      } catch (error) {
         return null;
      }
   },

   loginGoogle: async (userInfo) => {
      const { name, email } = userInfo;
      const dataRequest = {
         username: name,
         email,
      };
      try {
         const response = await axios.post("/auth/google/login", { ...dataRequest });
         return response;
      } catch (error) {
         return null;
      }
   },

   forgotPassword: async (email) => {
      const dataRequest = {
         email,
      };
      try {
         const response = await axios.post("/auth/forgot-password", { ...dataRequest });
         return response;
      } catch (error) {
         return null;
      }
   },

   verifyOtp: async (code, email) => {
      const dataRequest = {
         email,
         code,
      };
      try {
         const response = await axios.post("/auth/verify-otp", { ...dataRequest });
         return response;
      } catch (error) {
         return null;
      }
   },

   changePassword: async (email, password) => {
      const dataRequest = {
         email,
         password,
      };
      try {
         const response = await axios.post("/auth/change-password", { ...dataRequest });
         return response;
      } catch (error) {
         return null;
      }
   },
};
