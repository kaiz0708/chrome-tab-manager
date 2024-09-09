/** @format */

import { createSlice } from "@reduxjs/toolkit";
/* global chrome */

export const popupSlice = createSlice({
   name: "current",
   initialState: {
      value: null,
   },
   reducers: {
      updateWindowCurrent: (state, action) => {
         state.value = action.payload;
      },
   },
});

export const { updateWindowCurrent } = popupSlice.actions;

export default popupSlice.reducer;
