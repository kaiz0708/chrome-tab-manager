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
            let valueTabHover = null;
            state.value.forEach((window) => {
               switch (window.id) {
                  case tabDrag.windowId:
                     valueTabDrag = window.tabs[tabDrag.index];
                     break;
                  case tabHover.windowId:
                     valueTabHover = window.tabs[tabHover.index];
                     break;
                  default:
                     break;
               }
            });
            state.value.forEach((window) => {
               if (window.id === tabDrag.windowId) {
                  window.tabs[tabDrag.index] = valueTabHover;
                  window.tabs[tabDrag.index].active = false;
                  window.tabs[tabDrag.index].windowId = tabDrag.windowId;
               }
               if (window.id === tabHover.windowId) {
                  window.tabs[tabHover.index] = valueTabDrag;
                  window.tabs[tabHover.index].active = false;
                  window.tabs[tabHover.index].windowId = tabHover.windowId;
               }
            });
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
