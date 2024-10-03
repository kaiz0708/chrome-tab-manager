/** @format */

import { createSlice } from "@reduxjs/toolkit";
/* global chrome */

const popupSlice = createSlice({
   name: "current",
   initialState: {
      value: null,
      displayState: process.env.REACT_APP_TYPE_TAB_HORIZONTAL,
      displayCollection: false,
      login: false,
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

      updateLogin: (state, action) => {
         state.login = action.payload;
      },
   },
});

export const { updateWindowCurrent, updateStateDisplay, updateStateCollection, updateLogin } = popupSlice.actions;

export default popupSlice.reducer;
