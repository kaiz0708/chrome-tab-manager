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
      timeoutId: null,
      forgotPassword: false,
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
         state.notification = [action.payload, ...state.notification];
      },

      removeNoti: (state, action) => {
         state.notification = state.notification.filter((noti) => noti.id !== action.payload);
      },

      updateForgotPassword: (state, action) => {
         state.forgotPassword = action.payload;
      },
   },
});

export const { updateWindowCurrent, updateForgotPassword, addNoti, removeNoti, updateStateDisplay, updateStateCollection, updateAuth, updateRegister, updateDisplay } = popupSlice.actions;

export default popupSlice.reducer;
