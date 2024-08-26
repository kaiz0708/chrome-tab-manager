/** @format */

import { createSlice } from "@reduxjs/toolkit";

export const windowSlice = createSlice({
   name: "window",
   initialState: {
      value: [],
   },
   reducers: {
      setValue: (state, action) => {
         state.value = action.payload;
      },
      deleteWindow: (state, action) => {
         state.value = state.value.filter((e) => e.id !== action.payload);
      },
   },
});

export const { deleteWindow, setValue } = windowSlice.actions;

export default windowSlice.reducer;
