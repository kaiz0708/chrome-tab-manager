/** @format */

import { configureStore } from "@reduxjs/toolkit";
import windowSlices from "./features/windowSlices";
import popupSlices from "./features/popupSlices";
/* global chrome */
// Tạo store
const store = configureStore({
   reducer: { window: windowSlices, current: popupSlices },
});

store.subscribe(() => {
   const state = store.getState().window.value;
   const windowCurrent = store.getState().current.displayState;
   chrome.storage.local.set({ reduxState: state }, () => {
      console.log("State saved to chrome.storage", state);
   });
   chrome.storage.local.set({ windowCurrent: windowCurrent }, () => {
      console.log("State saved to chrome.storage", windowCurrent);
   });
});

export default store;
