/** @format */

import { configureStore, current } from "@reduxjs/toolkit";
import windowSlices from "./features/windowSlices";
import popupSlices from "./features/popupSlices";
import collectionSlices from "./features/collectionSlices";
/* global chrome */
// Tạo store
const storePopup = configureStore({
   reducer: {
      window: windowSlices,
      current: popupSlices,
      collection: collectionSlices,
   },
});

export default {
   storePopup,
};
