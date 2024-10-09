/** @format */

import { axios } from "../../common/axios";
import utils from "../../common/utils";

export default {
   listCollection: async () => {
      const token = await utils.getToken();
      const response = await axios.get("/collection", {
         headers: {
            Authorization: token,
         },
      });
      return response;
   },

   addTabToCollection: async (item, collectionId, position) => {
      const token = await utils.getToken();
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
      const token = await utils.getToken();
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

   createCollection: async (title, note) => {
      const token = await utils.getToken();
      const dataRequest = {
         title,
         note,
      };

      const response = await axios.post(
         "/collection",
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

   deleteCollection: async (id) => {
      const token = await utils.getToken();
      const response = await axios.delete(`/collection/${id}`, {
         headers: {
            Authorization: "Bearer " + token,
         },
      });
      console.log(response.data.data);

      return response;
   },
};
