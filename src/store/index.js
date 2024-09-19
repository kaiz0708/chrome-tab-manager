/** @format */

import { configureStore, current } from "@reduxjs/toolkit";
import windowSlices from "./features/windowSlices";
import popupSlices from "./features/popupSlices";
import windowCopy from "./features/windowCopy";
/* global chrome */
// Tạo store
const storePopup = configureStore({
   reducer: { window: windowSlices, current: popupSlices },
});

const storeMainPage = configureStore({
   reducer: { main: windowCopy, current: popupSlices },
});

export default {
   storePopup,
   storeMainPage,
};
