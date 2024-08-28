/** @format */
import { createSlice } from "@reduxjs/toolkit";

const solveDelele = (window, tab) => {
   for (let i = 0; i < window.length; i++) {
      if (window[i].tabs.length === 1 && tab.id === window[i].tabs[0].id) {
         return window.filter((e) => e.id !== window[i].id);
      } else {
         const index = window[i].tabs.findIndex((item) => item.id === tab.id);
         if (index !== -1 && window[i].tabs[index].active) {
            let index_last = window[i].tabs.length - 1;
            if (index == 0) {
               window[i].tabs[index_last].active = true;
            } else {
               index < index_last
                  ? (window[i].tabs[index + 1].active = true)
                  : (window[i].tabs[index - 1].active = true);
            }
         }
         window[i].tabs = window[i].tabs.filter((e) => e.id !== tab.id);
      }
   }
   return window;
};

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
      deleteTab: (state, action) => {
         state.value = solveDelele(state.value, action.payload);
      },
      addEmptyTab: (state, action) => {
         state.value = state.value.map((window) => {
            if (window.id !== action.payload.windowId) {
               return window;
            }
            const updatedTabs = window.tabs.map((tab) => ({
               ...tab,
               active: false,
            }));

            // Thêm tab mới vào mảng tabs
            updatedTabs.push({
               ...action.payload.newTab,
               active: true,
            });

            // Trả về window với mảng tabs mới
            return {
               ...window,
               tabs: updatedTabs,
            };
         });
      },
   },
});

export const { deleteWindow, setValue, deleteTab, addEmptyTab } =
   windowSlice.actions;

export default windowSlice.reducer;
