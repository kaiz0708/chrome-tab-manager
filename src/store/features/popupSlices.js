/** @format */

import { createSlice } from "@reduxjs/toolkit";
import React from "react";
/* global chrome */

const popupSlice = createSlice({
   name: "current",
   initialState: {
      value: null,
      displayState: process.env.REACT_APP_TYPE_TAB_HORIZONTAL,
   },
   reducers: {
      updateWindowCurrent: (state, action) => {
         state.value = action.payload;
      },

      updateStateDisplay: (state, action) => {
         console.log(action.payload);
         state.displayState = action.payload;
      },
   },
});

export const { updateWindowCurrent, updateStateDisplay } = popupSlice.actions;

export default popupSlice.reducer;
