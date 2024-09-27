/** @format */

import { createSlice } from "@reduxjs/toolkit";
/* global chrome */

const collectionSlice = createSlice({
   name: "collection",
   initialState: {
      value: [],
   },
   reducers: {
      setValue: (state, action) => {
         state.value = action.payload;
      },
   },
});

export const { setValue } = collectionSlice.actions;

export default collectionSlice.reducer;
