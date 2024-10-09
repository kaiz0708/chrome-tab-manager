/** @format */

import { createSlice } from "@reduxjs/toolkit";

const popupSlice = createSlice({
   name: "current",
   initialState: {
      value: null,
      displayState: process.env.REACT_APP_TYPE_TAB_HORIZONTAL,
      displayCollection: false,
      auth: false,
      register: false,
      display: false,
      notification: [],
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

      addNoti: (state, action) => {
         state.notification.push(action.payload);
      },

      removeNoti: (state, action) => {
         state.notification = state.notification.filter((e) => e.id !== action.payload);
      },
   },
});

export const { updateWindowCurrent, addNoti, removeNoti, updateStateDisplay, updateStateCollection, updateAuth, updateRegister, updateDisplay } = popupSlice.actions;

export default popupSlice.reducer;
