/** @format */

import { axios } from "../../common/axios";
import utils from "../../common/utils";

export default {
   listCollection: async () => {
      try {
         const token = await utils.getToken();
         const response = await axios.get("/collection", {
            headers: {
               Authorization: token,
            },
         });
         return response;
      } catch (error) {
         return null;
      }
   },

   addTabToCollection: async (item, collectionId, position) => {
      try {
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
      } catch (error) {
         return null;
      }
   },

   deleteTabToCollection: async (item, collectionId) => {
      try {
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
      } catch (error) {
         return null;
      }
   },

   createCollection: async (title) => {
      try {
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
      } catch (error) {
         return null;
      }
   },

   deleteCollection: async (id) => {
      try {
         const token = await utils.getToken();
         const response = await axios.delete(`/collection/${id}`, {
            headers: {
               Authorization: "Bearer " + token,
            },
         });

         return response;
      } catch (error) {
         return null;
      }
   },

   updateCollection: async (title, collectionId) => {
      try {
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
      } catch (error) {
         return null;
      }
   },

   moveItemCollectionToOther: async (item, collectionIdTo, position) => {
      try {
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
      } catch (error) {
         return null;
      }
   },
};
