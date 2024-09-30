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
               index < index_last ? (window[i].tabs[index + 1].active = true) : (window[i].tabs[index - 1].active = true);
            }
         }
         window[i].tabs = window[i].tabs.filter((e) => e.id !== tabId);
      }
   }
   return window;
};

const windowSlice = createSlice({
   name: "window",
   initialState: {
      value: [],
      collection: [],
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
      moveTabAroundWindow: (state, action) => {
         const { fromIndex, toIndex, windowId } = action.payload;
         state.value.forEach((window) => {
            if (window.id === windowId) {
               const [element] = window.tabs.splice(fromIndex, 1);
               window.tabs.splice(toIndex, 0, element);
            }
         });
      },
      pinTab: (state, action) => {
         const { tab, pinned } = action.payload;
         if (pinned) {
            let fromIndex = null;
            let toIndex = tab.index;
            state.value.forEach((window) => {
               if (window.id === tab.id) {
                  window.tabs.forEach((item, index) => {
                     item.id === tab.id ? (fromIndex = index) : (fromIndex = 0);
                  });
               }
            });
            const payload = {
               fromIndex: fromIndex,
               toIndex: toIndex,
               windowId: tab.windowId,
            };
            moveTabAroundWindow(state.value, payload);
         }
      },
      navigateTab: (state, action) => {
         const { tabNavigate } = action.payload;
         state.value = state.value.map((window) => {
            if (window.id === tabNavigate.windowId) {
               window.tabs = window.tabs.map((tab) => {
                  if (tab.id === tabNavigate.id) {
                     return tabNavigate;
                  }
                  return tab;
               });
            }
            return window;
         });
      },
      moveTabWithoutWindow: (state, action) => {
         const { tabId, newPosition, newWindowId } = action.payload;
         var tabDrag = null;
         state.value.forEach((window) => {
            window.tabs.forEach((tab) => {
               if (tab.id === tabId) {
                  tabDrag = tab;
                  state.value = solveDelele(state.value, tabId);
                  tabDrag.active = false;
                  tabDrag.windowId = newWindowId;
               }
            });
         });

         state.value.forEach((window) => {
            if (window.id === newWindowId) {
               if (newPosition !== -1) {
                  window.tabs.splice(newPosition, 0, tabDrag);
               } else {
                  window.tabs.push(tabDrag);
               }
            }
         });
      },
      activeTab: (state, action) => {
         const { tabId, windowId } = action.payload;
         state.value.forEach((window) => {
            if (window.id === windowId) {
               window.tabs.forEach((tab) => (tab.id === tabId ? (tab.active = true) : (tab.active = false)));
            }
         });
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

      ///Collection

      setValueCollection: (state, action) => {
         state.collection = action.payload;
      },

      addCollection: (state, action) => {
         const { id, newPosition, tab } = action.payload;
         const { title, url, favIconUrl } = tab;
         const newCollection = { title, url, favIconUrl, id: id };
         state.collection.forEach((collection) => {
            if (id === collection.id) {
               if (newPosition !== -1) {
                  collection.tabs.splice(newPosition, 0, newCollection);
               } else {
                  collection.tabs.push(newCollection);
               }
            }
         });
         state.value = solveDelele(state.value, tab.id);
      },
   },
});

// Lưu trạng thái Redux vào chrome.storage mỗi khi store thay đổi

export const { deleteWindow, setValueCollection, addCollection, setValue, deleteTab, addEmptyTab, addWindow, moveTabAroundWindow, moveTabWithoutWindow, activeTab, navigateTab, pinTab } = windowSlice.actions;

export default windowSlice.reducer;
