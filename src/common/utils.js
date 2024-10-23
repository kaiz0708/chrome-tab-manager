/** @format */
/* global chrome */
import axios from "axios";
import serviceChrome from "../components/services/ServiceChrome";

export default {
   parseStringToObjects: (str, mainDelimiter, fieldDelimeter, fieldNames) => {
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

   combineObjectsToTabs: (mainResults, urlResults, idFieldName) => {
      const combined = {};
      mainResults.forEach((item) => {
         combined[item[idFieldName]] = { ...item, tabs: [] };
      });

      for (const item of urlResults) {
         if (combined[item[idFieldName]]) {
            combined[item[idFieldName]].tabs.push(item);
         }
      }
      return Object.values(combined);
   },

   getToken: async () => {
      return await serviceChrome.getValueLocal("token");
   },

   getStateOtp: async () => {
      return await serviceChrome.getValueLocal(process.env.REACT_APP_TYPE_NAME_STATE_OTP_VARIABLE);
   },

   getEmail: async () => {
      return await serviceChrome.getValueLocal(process.env.REACT_APP_TYPE_NAME_EMAIL);
   },

   getUsername: async () => {
      return await serviceChrome.getValueLocal("user");
   },

   getDisplayState: async () => {
      return await serviceChrome.getValueLocal(process.env.REACT_APP_TYPE_NAME_VIEW_VARIABLE);
   },
};
