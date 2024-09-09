/** @format */

import { configureStore } from "@reduxjs/toolkit";
import windowSlices from "./features/windowSlices";
import popupSlices from "./features/popupSlices";
// Tạo store
const store = configureStore({
   reducer: { window: windowSlices, current: popupSlices },
});

export default store;
