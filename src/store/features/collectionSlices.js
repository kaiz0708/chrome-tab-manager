/** @format */

import { createSlice } from "@reduxjs/toolkit";
/* global chrome */

const collectionSlice = createSlice({
   name: "collection",
   initialState: {
      value: [],
   },
   reducers: {
      setValueCollection: (state, action) => {
         state.value = action.payload;
      },
   },
});

export const { setValueCollection } = collectionSlice.actions;

export default collectionSlice.reducer;
