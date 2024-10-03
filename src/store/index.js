/** @format */

import { configureStore, current } from "@reduxjs/toolkit";
import windowSlices from "./features/windowSlices";
import popupSlices from "./features/popupSlices";
/* global chrome */
const storePopup = configureStore({
   reducer: {
      window: windowSlices,
      current: popupSlices,
   },
});

export default {
   storePopup,
};
