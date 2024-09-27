/** @format */

import { createSlice } from "@reduxjs/toolkit";
/* global chrome */

const popupSlice = createSlice({
   name: "current",
   initialState: {
      value: null,
      displayState: process.env.REACT_APP_TYPE_TAB_HORIZONTAL,
      displayCollection: false,
   },
   reducers: {
      updateWindowCurrent: (state, action) => {
         state.value = action.payload;
      },

      updateStateDisplay: (state, action) => {
         state.displayState = action.payload;
      },

      updateStateCollection: (state, action) => {
         state.displayCollection = action.payload;
      },
   },
});

export const {
   updateWindowCurrent,
   updateStateDisplay,
   updateStateCollection,
} = popupSlice.actions;

export default popupSlice.reducer;
