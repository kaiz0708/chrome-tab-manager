/** @format */
import { createSlice } from "@reduxjs/toolkit";

const solveDelele = (window, tabId) => {
   for (let i = 0; i < window.length; i++) {
      if (window[i].tabs.length === 1 && tabId === window[i].tabs[0].id) {
         return window.filter((e) => e.id !== window[i].id);
      } else {
         const index = window[i].tabs.findIndex((item) => item.id === tabId);
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
         window[i].tabs = window[i].tabs.filter((e) => e.id !== tabId);
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
      addWindow: (state, action) => {
         state.value.push(action.payload);
      },
      deleteTab: (state, action) => {
         state.value = solveDelele(state.value, action.payload);
      },
      moveTab: (state, action) => {
         const { tabDrag, tabHover } = action.payload;
         console.log(action.payload);
         if (tabDrag.windowId === tabHover.windowId) {
            state.value.forEach((window) => {
               if (window.id === tabDrag.windowId) {
                  const value = window.tabs[tabDrag.index];
                  window.tabs[tabDrag.index] = window.tabs[tabHover.index];
                  window.tabs[tabHover.index] = value;
               }
            });
         } else {
            let valueTabDrag = null;
            state.value.forEach((window) => {
               if (window.id === tabDrag.windowId) {
                  valueTabDrag = window.tabs[tabDrag.index];
                  state.value = solveDelele(state.value, valueTabDrag.id);
                  valueTabDrag.active = false;
                  valueTabDrag.windowId = tabHover.windowId;
               }
            });

            let check = state.value.find(
               (window) =>
                  window.id === tabHover.windowId &&
                  window.tabs.some((tab) => tab.id === tabHover.tabId)
            );

            if (check === undefined) {
               state.value.forEach((window) => {
                  if (window.id === tabHover.windowId) {
                     if (tabHover.index !== -1) {
                        window.tabs.splice(tabHover.index, 0, valueTabDrag);
                     } else {
                        window.tabs.push(valueTabDrag);
                     }
                  }
               });
            }
         }
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

export const {
   deleteWindow,
   setValue,
   deleteTab,
   addEmptyTab,
   addWindow,
   moveTab,
} = windowSlice.actions;

export default windowSlice.reducer;
