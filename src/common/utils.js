/** @format */

export default {
   parseStringToObjects: (str, mainDelimiter, fieldDelimeter, fieldNames) => {
      let items = str.split(mainDelimiter);

      return items.map((item) => {
         let parts = item.split(fieldDelimeter);
         let obj = {};
         fieldNames.forEach((field, index) => {
            obj[field] = parts[index] || null;
         });

         return obj;
      });
   },

   combineObjects: (mainResults, urlResults, idFieldName) => {
      const combined = {};
      mainResults.forEach((item) => {
         combined[item[idFieldName]] = { ...item, urls: [] };
      });

      urlResults.forEach((item) => {
         if (combined[item[idFieldName]]) {
            combined[item[idFieldName]].urls.push(item.url);
         }
      });
      return Object.values(combined);
   },
};
