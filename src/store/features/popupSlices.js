/** @format */

import { createSlice } from "@reduxjs/toolkit";
/* global chrome */

const popupSlice = createSlice({
   name: "current",
   initialState: {
      value: null,
      displayState: process.env.REACT_APP_TYPE_TAB_HORIZONTAL,
      displayCollection: false,
      auth: false,
      register: false,
      display: false,
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

      updateAuth: (state, action) => {
         state.auth = action.payload;
      },

      updateRegister: (state, action) => {
         state.register = action.payload;
      },

      updateDisplay: (state, action) => {
         state.display = action.payload;
      },
   },
});

export const { updateWindowCurrent, updateStateDisplay, updateStateCollection, updateAuth, updateRegister, updateDisplay } = popupSlice.actions;

export default popupSlice.reducer;
