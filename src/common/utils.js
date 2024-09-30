/** @format */
/* global chrome */
import axios from "axios";

export default {
   parseStringToObjects: (str, mainDelimiter, fieldDelimeter, fieldNames) => {
      console.log(str);
      let items = null;
      if (str.includes(mainDelimiter)) {
         items = str.split(mainDelimiter);
      } else {
         items = [str];
      }

      return items.map((item) => {
         let parts = item.split(fieldDelimeter);
         let obj = {};
         fieldNames.forEach((field, index) => {
            obj[field] = parts[index] || null;
         });

         return obj;
      });
   },

   combineObjectsToTabs: async (mainResults, urlResults, idFieldName) => {
      const combined = {};
      mainResults.forEach((item) => {
         combined[item[idFieldName]] = { ...item, tabs: [] };
      });

      const urlOb = await axios.post("http://localhost:3000/api/infor", { data: urlResults });
      console.log(urlOb.data);

      for (const item of urlOb.data) {
         if (combined[item[idFieldName]]) {
            combined[item[idFieldName]].tabs.push(item);
         }
      }

      console.log(Object.values(combined));

      return Object.values(combined);
   },
};
