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

   createCollection: async (title) => {
      const token = await utils.getToken();
      const dataRequest = {
         title,
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

      return response;
   },

   updateCollection: async (title, collectionId) => {
      const token = await utils.getToken();
      const dataRequest = {
         title,
         collection: {
            id: collectionId,
         },
      };
      const response = await axios.put(
         "/collection",
         { ...dataRequest },
         {
            headers: {
               Authorization: "Bearer " + token,
            },
         }
      );
      return response;
   },

   moveItemCollectionToOther: async (item, collectionIdTo, position) => {
      const token = await utils.getToken();
      const { title, url, favIconUrl, id, collection } = item;
      const dataRequest = {
         title,
         url,
         favIconUrl,
         position,
         move: {
            tab: {
               id,
            },
            collectionFrom: {
               id: collection,
            },
            collectionTo: {
               id: collectionIdTo,
            },
         },
      };
      console.log(dataRequest);
      const response = await axios.post(
         "/tab/move-to-collection-other",
         { ...dataRequest },
         {
            headers: {
               Authorization: "Bearer " + token,
            },
         }
      );

      return response;
   },
};
