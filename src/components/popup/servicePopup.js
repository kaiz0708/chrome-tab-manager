/** @format */

import axios from "axios";
import serviceChrome from "../services/ServiceChrome";

export default {
   listCollection: async () => {
      const token = await serviceChrome.getValueLocal("token");
      const response = await axios.get("/collection", {
         headers: {
            Authorization: token,
         },
      });
      return response;
   },
};
