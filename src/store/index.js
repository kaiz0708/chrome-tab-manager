/** @format */

import { configureStore } from "@reduxjs/toolkit";
import windowSlices from "./features/windowSlices";

// Tạo store
const store = configureStore({
   reducer: { window: windowSlices },
});

export default store;
