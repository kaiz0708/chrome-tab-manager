/** @format */

import { axios } from "../../common/axios";
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

   addTabToCollection: async (item, collectionId, position) => {
      const token = await serviceChrome.getValueLocal("token");
      const { title, url, favIconUrl } = item;
      const dataRequest = {
         title,
         url,
         favIconUrl,
         position,
         collection: {
            id: collectionId,
         },
      };
      const response = await axios.post(
         "/tab/move-collection",
         {
            ...dataRequest,
         },
         {
            headers: {
               Authorization: "Bearer " + token,
            },
         }
      );

      return response;
   },

   deleteTabToCollection: async (item, collectionId) => {
      const token = await serviceChrome.getValueLocal("token");
      const { id, position } = item;
      const dataRequest = {
         tab: {
            id,
         },
         position,
         collection: {
            id: collectionId,
         },
      };
      const response = await axios.post(
         "/tab/remove-collection",
         {
            ...dataRequest,
         },
         {
            headers: {
               Authorization: "Bearer " + token,
            },
         }
      );

      return response;
   },
};
